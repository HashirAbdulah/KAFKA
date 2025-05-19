"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/action";
import { useNotification } from "../ui/Notification";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

const EmailVerificationModal = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}: EmailVerificationModalProps) => {
  const router = useRouter();
  const showNotification = useNotification((state) => state.showNotification);

  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const startResendCountdown = () => {
    setResendDisabled(true);
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;

    setLoading(true);
    setError(null);

    try {
      await apiService.postWithoutToken(
        "/api/auth/verify-email/send-code/",
        { email }
      );
      showNotification("Verification code resent successfully!", "success");
      startResendCountdown();
    } catch (error: any) {
      setError(error.message || "Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.postWithoutToken(
        "/api/auth/verify-email/verify/",
        { email, code: verificationCode }
      );

      if (response.access) {
        handleLogin(response.user.pk, response.access, response.refresh);
        showNotification("Email verified successfully!", "success");
        onVerificationSuccess();
        onClose();
        router.push("/");
      } else {
        setError("Invalid verification code");
      }
    } catch (error: any) {
      setError(error.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="space-y-2">
        <p className="text-gray-600 text-sm">
          Please enter the verification code sent to {email}
        </p>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
          className="w-full h-[54px] px-4 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
          required
        />
      </div>

      <div className="flex flex-col space-y-4">
        <button
          type="submit"
          disabled={loading || !verificationCode}
          className="w-full h-[54px] bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner /> : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendDisabled || loading}
          className="text-purple-500 hover:text-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendDisabled
            ? `Resend code in ${resendCountdown}s`
            : "Resend verification code"}
        </button>
      </div>
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      title="Verify your email"
      content={content} label={""}    />
  );
};

export default EmailVerificationModal;
