"use client";
import { useRouter } from "next/navigation";
import { ConversationType } from "@/app/inbox/page";
import React from "react";
import { format } from "date-fns";

interface ConversationProps {
  conversation: ConversationType;
  userId: string;
}

const Conversation: React.FC<ConversationProps> = ({
  conversation,
  userId,
}) => {
  const router = useRouter();

  // Add validation for conversation and other_user
  if (!conversation || !conversation.other_user) {
    console.error("Invalid conversation data:", conversation);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600">Invalid conversation data</p>
      </div>
    );
  }

  const otherUser = conversation.other_user;
  const lastMessage = conversation.last_message;
  const unreadCount = conversation.unread_count || 0;
  const isTyping = conversation.typing_users?.includes(otherUser?.id || "");

  // Add validation for otherUser
  if (!otherUser) {
    console.error("Could not find other user in conversation:", conversation);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600">User information not available</p>
      </div>
    );
  }

  const getMessagePreview = () => {
    if (!lastMessage) return "No messages yet";

    if (lastMessage.message_type === "image") {
      return "📷 Image";
    } else if (lastMessage.message_type === "file") {
      return `📎 ${lastMessage.file_name || "File"}`;
    }
    return lastMessage.body;
  };

  const getMessageIcon = () => {
    if (!lastMessage) return null;

    switch (lastMessage.message_type) {
      case "image":
        return "📷";
      case "file":
        return "📎";
      default:
        return null;
    }
  };

  return (
    <div
      className="cursor-pointer px-4 py-4 border rounded-xl shadow-md border-gray-300 hover:border-purple-500 transition-colors duration-200"
      onClick={() => router.push(`/inbox/${conversation.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <img
            src={otherUser.profile_image_url || "/profile_pic_1.jpg"}
            alt={otherUser.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-lg">
              {otherUser.name || "Unknown User"}
            </p>
            {isTyping && <p className="text-sm text-purple-600">typing...</p>}
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {lastMessage && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1 truncate">
            {getMessageIcon()}
            <span className="truncate">{getMessagePreview()}</span>
          </div>
          <span className="text-xs text-gray-500">
            {format(new Date(lastMessage.created_at), "MMM d, h:mm a")}
          </span>
        </div>
      )}
    </div>
  );
};

export default Conversation;
