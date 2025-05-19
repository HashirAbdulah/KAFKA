"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiService";
import { useNotification } from "../ui/Notification";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileCompletionModal = ({
  isOpen,
  onClose,
}: ProfileCompletionModalProps) => {
  const router = useRouter();
  const showNotification = useNotification((state) => state.showNotification);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            router.push("/profile");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, onClose, router]);

  const content = (
    <div className="space-y-4">
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Complete Your Profile
        </h3>
        <p className="text-gray-600">
          Take a moment to complete your profile to get the most out of your
          experience.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to profile page in {countdown} seconds...
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            onClose();
            router.push("/profile");
          }}
          className="px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
        >
          Go Now
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      title="Welcome!"
      content={content} label={""}    />
  );
};

export default ProfileCompletionModal;
