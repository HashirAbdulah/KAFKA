"use client";

import { useState, useEffect } from "react";
import Conversation from "@/app/components/inbox/Conversation";
import apiService from "../services/apiService";
import { getUserId } from "../lib/action";

export type UserType = {
  id: string;
  name: string;
  profile_image_url: string;
};

export type ConversationType = {
  id: string;
  users: UserType[];
};

const InboxPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUserId = await getUserId();
        setUserId(currentUserId);

        if (currentUserId) {
          const data = await apiService.get("/api/chat/");
          setConversations(data || []);
        }
      } catch (err) {
        console.error("Error fetching inbox data:", err);
        setError("Error loading conversations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const PageTitle = () => (
    <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-10">
      Inbox
    </h1>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <PageTitle />
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-gray-500 text-base animate-bounce">
              Loading your conversations...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <PageTitle />
          <div className="text-center py-16">
            <div className="bg-red-100 border border-red-300 rounded-xl p-8 inline-block shadow-md">
              <p className="text-base text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <PageTitle />
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow border border-gray-100 max-w-md mx-auto">
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
                Please log in to view your conversations.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <PageTitle />

        <div className="space-y-4">
          {conversations.length > 0 ? (
            conversations.map((conversation: ConversationType) => (
              <div
                key={conversation.id}
                className="bg-white rounded-2xl border border-gray-200 shadow hover:shadow-md transition-all duration-300 hover:border-purple-300"
              >
                <Conversation userId={userId} conversation={conversation} />
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow border border-gray-100 max-w-md mx-auto">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No conversations yet
                </p>
                <p className="text-gray-500">
                  Start chatting with property owners to discuss your stay!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default InboxPage;
