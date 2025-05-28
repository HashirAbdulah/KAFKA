import { useEffect, useState, useRef } from "react";
import CustomButton from "../forms/CustomButton";
import { ConversationType as BaseConversationType } from "@/app/inbox/page";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { format } from "date-fns";
import apiService from "@/app/services/apiService";

interface ConversationType extends BaseConversationType {
  messages?: Message[];
  users: {
    id: string;
    name: string;
    profile_image_url?: string;
  }[];
}

interface Message {
  id?: string;
  body: string;
  name?: string;
  sender_id?: string;
  created_by?: {
    id: string;
    name: string;
    profile_image?: string;
  };
  sent_to?: {
    id: string;
    name: string;
    profile_image?: string;
  };
  created_at?: string;
  read?: boolean;
  read_at?: string;
  isOptimistic?: boolean;
  message_type?: "text" | "image" | "file";
  media_url?: string;
  file_name?: string;
  file_size?: number;
  is_edited?: boolean;
  edited_at?: string;
  reply_to?: {
    id: string;
    body: string;
    created_by: {
      id: string;
      name: string;
      profile_image?: string;
    };
    created_at: string;
    message_type: string;
  } | null;
}

interface WebSocketMessage {
  type?:
    | "chat_message"
    | "read_receipt"
    | "typing_status"
    | "message_edited"
    | "message_deleted";
  body?: string;
  sender_id?: string;
  name?: string;
  id?: string;
  message_id?: string;
  reader_id?: string;
  conversation_id?: string;
  created_at?: string;
  message_type?: "text" | "image" | "file";
  media_url?: string;
  file_name?: string;
  file_size?: number;
  is_edited?: boolean;
  edited_at?: string;
  reply_to?: {
    id: string;
    body: string;
    created_by: {
      id: string;
      name: string;
      profile_image?: string;
    };
    created_at: string;
    message_type: string;
  } | null;
  is_typing?: boolean;
  new_body?: string;
  deleted_by?: string;
  deleted_at?: string;
  [key: string]: any;
}

interface ConversationDetailProps {
  token: string | undefined;
  userId: string;
  conversation: ConversationType;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  userId,
  token,
  conversation,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const myUser = conversation.users.find((user) => user.id === userId);
  const otherUser = conversation.users.find((user) => user.id !== userId);

  // Dynamic WebSocket URL
  const wsHost = process.env.NEXT_PUBLIC_WS_HOST || "127.0.0.1:8000";
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = token
    ? `${wsProtocol}://${wsHost}/ws/${conversation.id}/?token=${token}`
    : null;

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<WebSocketMessage>(wsUrl, {
      share: false,
      shouldReconnect: () => true,
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      onError: (event) => {
        setError("WebSocket connection error. Please try again later.");
        console.error("WebSocket error:", event);
      },
    });

  // Load initial messages
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        setLoading(true);
        if (conversation.messages && Array.isArray(conversation.messages)) {
          setMessages(
            conversation.messages.map((msg) => ({
              ...msg,
              isOptimistic: false,
            }))
          );
          setHasMore(conversation.messages.length >= 50); // Backend sends 50 messages
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setError("Failed to load messages. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialMessages();
  }, [conversation]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastJsonMessage) {
      const wsMessage = lastJsonMessage as WebSocketMessage;

      if (wsMessage.type === "read_receipt") {
        // Update message read status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === wsMessage.message_id ? { ...msg, read: true } : msg
          )
        );
      } else if (wsMessage.type === "chat_message" || !wsMessage.type) {
        // Handle new message
        const newMessage: Message = {
          id: wsMessage.id,
          body: wsMessage.body || "",
          sender_id: wsMessage.sender_id,
          name: wsMessage.name,
          created_at: wsMessage.created_at || new Date().toISOString(),
          read: wsMessage.sender_id === userId,
          isOptimistic: false,
        };

        setMessages((prev) => {
          // Check for duplicates or optimistic messages
          const existingMessage = prev.find(
            (msg) =>
              (msg.isOptimistic &&
                msg.body === newMessage.body &&
                msg.sender_id === newMessage.sender_id) ||
              msg.id === newMessage.id
          );
          if (existingMessage) {
            // Replace optimistic message with real message
            return prev.map((msg) =>
              msg === existingMessage ? newMessage : msg
            );
          }
          return [...prev, newMessage];
        });

        // Send read receipt for received messages
        if (
          wsMessage.sender_id !== userId &&
          wsMessage.id &&
          readyState === ReadyState.OPEN
        ) {
          sendJsonMessage({
            type: "read_receipt",
            message_id: wsMessage.id,
            reader_id: userId,
            conversation_id: conversation.id,
          });
        }
      }
    }
  }, [lastJsonMessage, userId, conversation.id, sendJsonMessage, readyState]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Log WebSocket state
  useEffect(() => {
    const stateNames = {
      [ReadyState.CONNECTING]: "Connecting",
      [ReadyState.OPEN]: "Open",
      [ReadyState.CLOSING]: "Closing",
      [ReadyState.CLOSED]: "Closed",
      [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    };
    console.log(`WebSocket state: ${stateNames[readyState]} (${readyState})`);

    if (readyState === ReadyState.OPEN) {
      setError(null);
    }
  }, [readyState]);

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await apiService.get(
        `/api/chat/${conversation.id}/messages/?page=${nextPage}`
      );

      const olderMessages: Message[] = response.data || [];
      if (olderMessages.length > 0) {
        setMessages((prev) => [
          ...olderMessages.map((msg) => ({ ...msg, isOptimistic: false })),
          ...prev,
        ]);
        setPage(nextPage);
      }
      setHasMore(olderMessages.length >= 20); // Backend paginates 20 messages
    } catch (err) {
      console.error("Error loading more messages:", err);
      setError("Failed to load more messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll for pagination
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && hasMore && !loading) {
        loadMoreMessages();
      }
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (message.trim() && readyState === ReadyState.OPEN && !isSending) {
      try {
        setIsSending(true);
        const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update
        sendJsonMessage({
          message: message,
          sender_id: userId,
          conversation_id: conversation.id,
          type: "chat_message",
        });

        // Optimistic update
        const optimisticMessage: Message = {
          id: tempId,
          body: message,
          sender_id: userId,
          created_at: new Date().toISOString(),
          read: true,
          isOptimistic: true,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Failed to send message. Please try again.");
      } finally {
        setIsSending(false);
      }
    } else if (readyState !== ReadyState.OPEN) {
      setError("Cannot send message. Connection is not open.");
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return format(date, "MMM d, h:mm a");
    } catch (err) {
      console.error("Error formatting timestamp:", err);
      return "";
    }
  };

  // Check if message is from current user
  const isMyMessage = (msg: Message) => {
    return (
      (msg.sender_id && msg.sender_id === userId) ||
      (msg.created_by && msg.created_by.id === userId)
    );
  };

  // Handle typing status
  const handleTyping = () => {
    if (!isTyping && readyState === ReadyState.OPEN) {
      setIsTyping(true);
      sendJsonMessage({
        type: "typing_status",
        is_typing: true,
        conversation_id: conversation.id,
        user_id: userId,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && readyState === ReadyState.OPEN) {
        setIsTyping(false);
        sendJsonMessage({
          type: "typing_status",
          is_typing: false,
          conversation_id: conversation.id,
          user_id: userId,
        });
      }
    }, 2000);
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile || !token) return;

    try {
      setIsSending(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("conversation_id", conversation.id);
      formData.append(
        "message_type",
        selectedFile.type.startsWith("image/") ? "image" : "file"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/chat/upload/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();

      // Send message with file info
      sendJsonMessage({
        type: "chat_message",
        message: data.file_name,
        sender_id: userId,
        conversation_id: conversation.id,
        message_type: data.message_type,
        media_url: data.media_url,
        file_name: data.file_name,
        file_size: data.file_size,
      });

      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle message edit
  const handleEditMessage = async (message: Message, newBody: string) => {
    if (!message.id || !token) return;

    try {
      setIsSending(true);
      const response = await apiService.put(
        `/api/chat/messages/${message.id}/edit/`,
        {
          body: newBody,
        }
      );

      if (response) {
        sendJsonMessage({
          type: "edit_message",
          message_id: message.id,
          new_body: newBody,
          user_id: userId,
        });
        setEditingMessage(null);
      }
    } catch (err) {
      console.error("Error editing message:", err);
      setError("Failed to edit message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (message: Message) => {
    if (!message.id || !token) return;

    try {
      setIsSending(true);
      const response = await apiService.delete(
        `/api/chat/messages/${message.id}/delete/`
      );

      if (response) {
        sendJsonMessage({
          type: "delete_message",
          message_id: message.id,
          user_id: userId,
        });
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      setError("Failed to delete message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle message search
  const handleSearch = async (query: string) => {
    if (!query.trim() || !token) return;

    try {
      setIsSearching(true);
      const response = await apiService.get(
        `/api/chat/conversations/${
          conversation.id
        }/search/?q=${encodeURIComponent(query)}`
      );
      setSearchResults(response.results || []);
    } catch (err) {
      console.error("Error searching messages:", err);
      setError("Failed to search messages. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Update WebSocket message handler
  useEffect(() => {
    if (lastJsonMessage) {
      const wsMessage = lastJsonMessage as WebSocketMessage;

      switch (wsMessage.type) {
        case "typing_status":
          if (wsMessage.user_id !== userId) {
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              if (wsMessage.is_typing) {
                newSet.add(wsMessage.user_id!);
              } else {
                newSet.delete(wsMessage.user_id!);
              }
              return newSet;
            });
          }
          break;

        case "message_edited":
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === wsMessage.message_id
                ? {
                    ...msg,
                    body: wsMessage.new_body!,
                    is_edited: true,
                    edited_at: wsMessage.edited_at,
                  }
                : msg
            )
          );
          break;

        case "message_deleted":
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== wsMessage.message_id)
          );
          break;

        // ... existing message handling cases ...
      }
    }
  }, [lastJsonMessage, userId]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header with search */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={
                otherUser?.profile_image_url
                  ? `${process.env.NEXT_PUBLIC_API_HOST}${otherUser.profile_image_url}`
                  : "/profile_pic_1.jpg"
              }
              alt={otherUser?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">
              {otherUser?.name || "User"}
            </h2>
            {typingUsers.size > 0 && (
              <p className="text-sm text-gray-500">
                {Array.from(typingUsers)
                  .map(
                    (id) => conversation.users.find((u) => u.id === id)?.name
                  )
                  .filter(Boolean)
                  .join(", ")}{" "}
                {typingUsers.size === 1 ? "is" : "are"} typing...
              </p>
            )}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white border-b border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Search Results
          </h3>
          <div className="space-y-2">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => {
                  const element = document.getElementById(
                    `message-${result.id}`
                  );
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  element?.classList.add("highlight-message");
                  setTimeout(
                    () => element?.classList.remove("highlight-message"),
                    2000
                  );
                }}
              >
                <p className="text-sm text-gray-600">{result.body}</p>
                <p className="text-xs text-gray-400">
                  {formatTimestamp(result.created_at)} by{" "}
                  {result.created_by?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-grow max-h-[500px] overflow-auto flex flex-col space-y-4 p-4"
        onScroll={handleScroll}
      >
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="text-center py-2">
                {loading ? (
                  <div className="animate-spin inline-block h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                ) : (
                  <button
                    onClick={loadMoreMessages}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Load more messages
                  </button>
                )}
              </div>
            )}

            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-4">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  id={`message-${msg.id}`}
                  key={msg.id || `temp-${index}`}
                  className={`w-[80%] py-4 px-6 rounded-xl ${
                    isMyMessage(msg) ? "ml-[20%] bg-purple-200" : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  {/* Reply preview */}
                  {msg.reply_to && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg text-sm">
                      <p className="font-semibold text-gray-600">
                        Replying to {msg.reply_to.created_by.name}
                      </p>
                      <p className="text-gray-500 truncate">
                        {msg.reply_to.body}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-gray-500">
                      {isMyMessage(msg)
                        ? myUser?.name || "You"
                        : otherUser?.name || "Other User"}
                    </p>
                    <div className="flex items-center space-x-2">
                      {msg.is_edited && (
                        <span className="text-xs text-gray-400">(edited)</span>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(msg.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Message content */}
                  {msg.message_type === "image" && msg.media_url ? (
                    <div className="mb-2">
                      <img
                        src={msg.media_url}
                        alt={msg.file_name || "Image"}
                        className="max-w-full rounded-lg"
                        onClick={() => window.open(msg.media_url, "_blank")}
                      />
                    </div>
                  ) : msg.message_type === "file" && msg.media_url ? (
                    <div className="mb-2">
                      <a
                        href={msg.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        <span>{msg.file_name}</span>
                        <span className="text-xs text-gray-500">
                          ({(msg.file_size! / 1024).toFixed(1)} KB)
                        </span>
                      </a>
                    </div>
                  ) : (
                    <p className="mb-2">{msg.body}</p>
                  )}

                  {/* Message actions */}
                  {isMyMessage(msg) && (
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingMessage(msg)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">
                        {msg.read ? (
                          <span className="flex items-center">
                            Read
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 ml-1 text-blue-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span>Sent</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="mt-4 px-6 py-4 flex flex-col border border-gray-300 space-y-4 rounded-xl">
        {/* Reply preview */}
        {replyToMessage && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Replying to {replyToMessage.created_by?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {replyToMessage.body}
              </p>
            </div>
            <button
              onClick={() => setReplyToMessage(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}

        {/* File preview */}
        {selectedFile && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span className="text-sm text-gray-600">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Message input and actions */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter Message"
            className="flex-grow p-2 rounded-xl bg-gray-200"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
            disabled={isSending || readyState !== ReadyState.OPEN}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
            disabled={isSending}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <CustomButton
            label={isSending ? "Sending..." : "Send"}
            onClick={selectedFile ? handleFileUpload : handleSendMessage}
            className="w-[100px]"
            disabled={
              isSending ||
              (selectedFile ? false : message.trim() === "") ||
              readyState !== ReadyState.OPEN
            }
            icon={
              isSending ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              )
            }
          />
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-2 text-sm">
        {!token && (
          <p className="text-red-500">Waiting for authentication token...</p>
        )}
        {readyState === ReadyState.CONNECTING && (
          <p className="text-purple-500">Connecting to chat server...</p>
        )}
        {readyState === ReadyState.OPEN && (
          <p className="text-purple-600">Connected to chat server</p>
        )}
        {readyState === ReadyState.CLOSED && (
          <p className="text-red-500">Disconnected. Trying to reconnect...</p>
        )}
      </div>

      {/* Edit Message Modal */}
      {editingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Message</h3>
            <textarea
              className="w-full p-2 border rounded-lg mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingMessage(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditMessage(editingMessage, message)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;
