"use client";
import useLoginModal from "../hooks/useLoginModal";
import { useRouter } from "next/navigation";
import apiService from "../services/apiService";
import Conversation from "./inbox/Conversation";

interface ContactButtonProps {
  userId: string | null;
  landlordId: string;
}
const ContactButton: React.FC<ContactButtonProps> = ({
  userId,
  landlordId,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const startConversation = async () => {
    if (userId) {
      try {
        const conversation = await apiService.get(
          `/api/chat/conversations/start/${landlordId}/`
        );
        if (conversation.conversation_id) {
          router.push(`/inbox/${conversation.conversation_id}`);
        }
      } catch (error) {
        console.error("Error starting conversation:", error);
        // You might want to show an error message to the user here
      }
    } else {
      loginModal.open();
    }
  };

  return (
    <button
      onClick={startConversation}
      className="mt-4 py-2 px-6 bg-purple-700 text-white cursor-pointer rounded-xl transition duration-300 ease-in-out transform hover:bg-purple-800 hover:scale-105 hover:shadow-2xl border-gray-300 shadow-xl"
    >
      Contact
    </button>
  );
};

export default ContactButton;
