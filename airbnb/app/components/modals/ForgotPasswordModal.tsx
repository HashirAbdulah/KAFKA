"use client";
import { useState } from "react";
import Modal from "./Modal";
import apiService from "@/app/services/apiService";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import PasswordInput from "../ui/PasswordInput";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiService.postWithoutToken(
        "/api/auth/forgot-password/send-code/",
        { email }
      );
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiService.postWithoutToken(
        "/api/auth/forgot-password/verify-code/",
        { email, code }
      );
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiService.postWithoutToken("/api/auth/forgot-password/reset/", {
        email,
        code,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess("Password reset successful. You may now log in.");
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  let content = <div></div>;
  if (step === 1) {
    content = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendCode();
        }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Enter Your Email to Forget Password</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your verified email"
          className="w-full h-[54px] px-4 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          required
        />
        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white rounded-xl py-3 hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Send Code"}
        </button>
      </form>
    );
  } else if (step === 2) {
    content = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyCode();
        }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Enter Verification Code</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code sent to your email"
          className="w-full h-[54px] px-4 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          required
        />
        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white rounded-xl py-3"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Verify Code"}
        </button>
      </form>
    );
  } else if (step === 3) {
    content = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword();
        }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Reset Password</h2>
        <PasswordInput
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          required
        />
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 transition"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Reset Password"}
        </button>
        {success && (
          <p className="text-green-600 text-center mt-2">{success}</p>
        )}
      </form>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      label="Forgot Password"
      title="Forgot Password"
      content={content}
    />
  );
};

export default ForgotPasswordModal;
