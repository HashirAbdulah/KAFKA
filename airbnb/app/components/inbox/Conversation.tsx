"use client";
import { useRouter } from "next/navigation";
import { ConversationType } from "@/app/inbox/page";
import React from "react";

interface ConversationProps {
  conversation: ConversationType;
  userId: string;
}
const Conversation: React.FC<ConversationProps> = ({
  conversation,
  userId,
}) => {
  const router = useRouter();
  const otherUser = conversation.users.find((user) => user.id != userId);
  return (
    <div className="cursor-pointer px-4 py-4 border rounded-xl shadow-md border-gray-300">
      <p className="mb-4 text-xl">{otherUser?.name}</p>
      <p
        onClick={() => router.push(`/inbox/${conversation.id}`)}
        className="text-airbnb-dark"
      >
        Go to Conversations
      </p>
    </div>
  );
};

export default Conversation;
