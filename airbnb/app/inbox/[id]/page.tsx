"use client";
import ConversationDetail from "@/app/components/inbox/ConverstionDetail";
import { getUserId, getAccessToken } from "@/app/lib/action";
import React, { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";
import { UserType } from "../page";

interface MessageType {
  id: string;
  message: string;
  body: string;
  message_type: "image" | "text" | "file";
  sender_id: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
}

interface ConversationData {
  id: string;
  users: UserType[];
  messages?: MessageType[];
  last_message?: MessageType;
  unread_count?: number;
  typing_users?: string[];
  last_message_at?: string;
  other_user: UserType;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const ConversationPage = ({ params }: PageProps) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationData | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params to ensure it's not a Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        setConversationId(resolvedParams.id);
      } catch (err) {
        console.error("Error resolving params:", err);
        setError("Invalid conversation ID");
      }
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const initialize = async () => {
      if (!conversationId) return;

      try {
        setLoading(true);
        // Fetch user ID and token in parallel
        const [userIdResult, tokenResult] = await Promise.all([
          getUserId(),
          getAccessToken(),
        ]);

        setUserId(userIdResult);
        setToken(tokenResult ?? undefined);

        if (userIdResult && conversationId) {
          // Fetch conversation data using the new chat method
          const response = await apiService.chat.getConversation(
            conversationId
          );
          setConversation(response);
        }
      } catch (err) {
        console.error("Error initializing:", err);
        setError("Failed to load conversation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [conversationId]);

  if (loading) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-500 text-base animate-bounce">
            Loading conversation...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="bg-red-100 border border-red-300 rounded-xl p-8 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow border border-gray-100 max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            Authentication Required
          </p>
          <p className="text-gray-500">
            Please log in to view this conversation.
          </p>
        </div>
      </main>
    );
  }

  if (!conversation) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow border border-gray-100 max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            Conversation Not Found
          </p>
          <p className="text-gray-500">
            The conversation you're looking for doesn't exist or you don't have
            access to it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6 mt-4">
      <ConversationDetail
        token={token}
        userId={userId}
        conversation={conversation}
      />
    </main>
  );
};

export default ConversationPage;
