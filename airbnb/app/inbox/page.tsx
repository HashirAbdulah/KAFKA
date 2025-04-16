import Conversation from "@/app/components/inbox/Conversation";
import apiService from "../services/apiService";
// import { useEffect, useState } from "react";
import { getUserId } from "../lib/action";

export type UserType = {
  id: string;
  name: string;
  profile_image_url: string;
}

export type ConversationType = {
  id: string;
  users: UserType[];
}


const InboxPage = async () => {

  const userId = await getUserId();

  if (!userId) {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <h1>You need to be Authenticated...</h1>
      </main>
    );
  }

  const conversations = await apiService.get('/api/chat/')

  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6 mt-4 space-y-4">
      <h1 className="my-6 text-2xl">Inbox</h1>
      {conversations.map((conversation: ConversationType)=>{
        return(
          <Conversation
           key={conversation.id}
            userId= {userId}
            conversation={conversation}
          />
        )
      })}
    </main>
  );
};

export default InboxPage;
