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
    <div className="p-6">
      <form onSubmit={handleVerifyCode} className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-sm">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We've sent a verification code to
            </p>
            <p className="text-purple-600 font-medium text-sm truncate max-w-xs mx-auto">
              {email}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
              className="!mb-0 !bg-transparent !border-0 !p-0"
            />
          </div>
        )}

        {/* Verification Code Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="relative w-12 h-14 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-200"
              >
                <input
                  type="text"
                  value={verificationCode[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
                      const newCode = verificationCode.split('');
                      newCode[index] = value;
                      setVerificationCode(newCode.join(''));

                      // Auto-focus next input
                      if (value && index < 5) {
                        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
                        if (nextInput) nextInput.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace
                    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
                      if (prevInput) prevInput.focus();
                    }
                    // Handle paste
                    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      navigator.clipboard.readText().then(text => {
                        const digits = text.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(digits);
                      });
                    }
                  }}
                  data-index={index}
                  className="w-full h-full bg-transparent border-0 rounded-xl text-center text-lg font-mono focus:ring-0 focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                {/* Active indicator */}
                <div
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-purple-500 rounded-full transition-opacity duration-200"
                  style={{
                    opacity: verificationCode[index] ? '1' : '0'
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            Enter the 6-digit code from your email
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading || !verificationCode}
            className="group relative w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:from-purple-600 disabled:hover:to-purple-700 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center justify-center">
              {loading ? <LoadingSpinner /> : "Verify Email"}
            </span>
          </button>

          {/* Resend Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendDisabled || loading}
              className="inline-flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              {resendDisabled ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/>
                  </svg>
                  <span>Resend in {resendCountdown}s</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Resend code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            For security reasons, this code will expire in 10 minutes.
            <br />
            Check your spam folder if you don't see the email.
          </p>
        </div>
      </form>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      title=""
      content={content}
      label={""}
    />
  );
};

export default EmailVerificationModal;
