"use client";
import ConversationDetail from "@/app/components/inbox/ConverstionDetail";
import { getUserId, getAccessToken } from "@/app/lib/action";
import React, { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";
import { UserType } from "../page";

export type MessageType = {
  id: string;
  name: string;
  body: string;
  conversationId: string;
  sent_to: UserType;
  created_by: UserType;
};

interface PageProps {
  params: Promise<{ id: string }> | { id: string }; // Account for both Promise and direct object
}

const ConversationPage = ({ params }: PageProps) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversation, setConversation] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Resolve params to ensure it's not a Promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setConversationId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const initialize = async () => {
      if (!conversationId) return; // Wait until conversationId is resolved

      try {
        // Fetch user ID and token in parallel
        const [userIdResult, tokenResult] = await Promise.all([
          getUserId(),
          getAccessToken(),
        ]);
        setUserId(userIdResult);
        setToken(tokenResult ?? undefined);

        if (userIdResult && conversationId) {
          // Fetch conversation data using the resolved conversationId
          const response = await apiService.get(`/api/chat/${conversationId}/`);
          setConversation(response.conversation || response);
        }
      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [conversationId]);

  if (loading) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <h1>You need to be Authenticated...</h1>
      </main>
    );
  }

  if (!conversation) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <h1>Conversation not found</h1>
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
