import { useEffect, useState, useRef } from "react";
import CustomButton from "../forms/CustomButton";
import { ConversationType as BaseConversationType } from "@/app/inbox/page";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { format } from "date-fns";
import apiService from "@/app/services/apiService";

interface ConversationType extends BaseConversationType {
  messages?: Message[];
}

interface Message {
  id?: string;
  body: string;
  name?: string;
  sender_id?: string;
  created_by?: {
    id: string;
    name: string;
  };
  sent_to?: {
    id: string;
    name: string;
  };
  created_at?: string;
  read?: boolean;
  isOptimistic?: boolean; // Flag for optimistic updates
}

interface WebSocketMessage {
  type?: string;
  body?: string;
  sender_id?: string;
  name?: string;
  id?: string;
  message_id?: string;
  reader_id?: string;
  conversation_id?: string;
  created_at?: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center p-4 border-b">
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
          <h2 className="text-lg font-semibold">{otherUser?.name || "User"}</h2>
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
                  key={msg.id || `temp-${index}`}
                  className={`w-[80%] py-4 px-6 rounded-xl ${
                    isMyMessage(msg) ? "ml-[20%] bg-purple-200" : "bg-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-gray-500">
                      {isMyMessage(msg)
                        ? myUser?.name || "You"
                        : otherUser?.name || "Other User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(msg.created_at)}
                    </p>
                  </div>
                  <p className="mb-2">{msg.body}</p>

                  {isMyMessage(msg) && (
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {msg.read ? (
                          <span className="flex items-center justify-end">
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
      <div className="mt-4 px-6 py-4 flex border border-gray-300 space-x-4 rounded-xl">
        <input
          type="text"
          placeholder="Enter Message"
          className="w-full p-2 rounded-xl bg-gray-200"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isSending || readyState !== ReadyState.OPEN}
        />
        <CustomButton
          label={isSending ? "Sending..." : "Send"}
          onClick={handleSendMessage}
          className="w-[100px]"
          disabled={
            isSending || message.trim() === "" || readyState !== ReadyState.OPEN
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
    </div>
  );
};

export default ConversationDetail;
