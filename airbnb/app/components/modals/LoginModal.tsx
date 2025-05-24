"use client";

import Modal from "./Modal";
import CustomButton from "../forms/CustomButton";
import { useState, useEffect } from "react";
import useAuthModals from "@/app/hooks/useAuthModals";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/action";
import {
  useFormValidation,
  commonValidationRules,
} from "@/app/hooks/useFormValidation";
import { useNotification } from "../ui/Notification";
import { logger } from "@/app/services/logger";
import useApiRequest from "@/app/hooks/useApiRequest";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import ForgotPasswordModal from "./ForgotPasswordModal";
import PasswordInput from "../ui/PasswordInput";

const LoginModal = () => {
  const router = useRouter();
  const { isLoginModalOpen, closeLoginModal, switchToSignup } = useAuthModals();
  const showNotification = useNotification((state) => state.showNotification);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    errors,
    validateForm,
    validateFieldOnChange,
    setFieldTouched,
    clearErrors,
  } = useFormValidation({
    email: commonValidationRules.email,
    password: [{ required: true, message: "Password is required" }],
  });

  const {
    loading,
    error,
    execute: executeLogin,
    reset: resetApiState,
  } = useApiRequest(
    async (credentials: { email: string; password: string }) => {
      const response = await apiService.postWithoutToken(
        "/api/auth/login/",
        credentials
      );

      if (response.access) {
        logger.info("Login successful", { userId: response.user.pk });
        await handleLogin(response.user.pk, response.access, response.refresh);
        showNotification("Successfully logged in!", "success");
        closeLoginModal();
        router.push("/");
        return response;
      } else {
        throw new Error(response.non_field_errors?.[0] || "Login failed");
      }
    }
  );

  useEffect(() => {
    if (isLoginModalOpen) {
      clearErrors();
      resetApiState();
      setEmail("");
      setPassword("");
    }
  }, [isLoginModalOpen, clearErrors, resetApiState]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateFieldOnChange("email", value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateFieldOnChange("password", value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm({ email, password });
    if (!isValid) return;

    try {
      await executeLogin({ email, password });
    } catch (err) {
      logger.error("Login error", err);
      showNotification("Failed to log in. Please try again.", "error");
    }
  };

  const content = (
    <div onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <ErrorMessage
            message={error}
            onRetry={resetApiState}
            className="mb-6"
          />
        )}

        <div className="space-y-2">
          <input
            onChange={handleEmailChange}
            onBlur={() => setFieldTouched("email")}
            value={email}
            placeholder="Your e-mail address"
            type="email"
            className={`w-full h-[54px] px-4 border ${
              errors.email ? "border-red-500" : "border-purple-300"
            } rounded-xl focus:ring-2 focus:ring-purple-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            value={password}
              onChange={handlePasswordChange}
              onBlur={() => setFieldTouched("password")}
              placeholder="Your password"
            error={!!errors.password}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password[0]}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:underline"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </button>
        </div>

        <CustomButton
          label={loading ? "Logging in..." : "Log in"}
          type="submit"
          disabled={loading}
        />

        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner size="small" />
          </div>
        )}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            type="button"
            className="text-sm text-indigo-600 hover:underline"
            onClick={() => switchToSignup()}
          >
            Sign Up
          </button>
        </div>
      </form>
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isLoginModalOpen}
      close={closeLoginModal}
      label="Log in"
      title="Log in"
      content={content}
      closeOnOutsideClick={false}
    />
  );
};

export default LoginModal;
