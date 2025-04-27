"use client";

import Modal from "./Modal";
import CustomButton from "../forms/CustomButton";
import { useState, useEffect } from "react";
import useLoginModal from "@/app/hooks/useLoginModal";
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

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const showNotification = useNotification((state) => state.showNotification);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        JSON.stringify(credentials)
      );

      if (response.access) {
        logger.info("Login successful", { userId: response.user.pk });
        await handleLogin(response.user.pk, response.access, response.refresh);
        showNotification("Successfully logged in!", "success");
        loginModal.close();
        router.push("/");
        return response;
      } else {
        throw new Error(response.non_field_errors?.[0] || "Login failed");
      }
    }
  );

  useEffect(() => {
    if (loginModal.isOpen) {
      clearErrors();
      resetApiState();
      setEmail("");
      setPassword("");
    }
  }, [loginModal.isOpen, clearErrors, resetApiState]);

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
          <div className="relative">
            <input
              onChange={handlePasswordChange}
              onBlur={() => setFieldTouched("password")}
              value={password}
              placeholder="Your password"
              type={showPassword ? "text" : "password"}
              className={`w-full h-[54px] px-4 border ${
                errors.password ? "border-red-500" : "border-purple-300"
              } rounded-xl focus:ring-2 focus:ring-purple-500`}
            />
            {password && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPassword((prev) => !prev);
                }}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M1 12s3.5-8 11-8 11 8 11 8-3.5 8-11 8-11-8-11-8z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            )}
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password[0]}</p>
          )}
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
      </form>
    </div>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      close={loginModal.close}
      label="Log in"
      content={content}
      closeOnOutsideClick={false}
    />
  );
};

export default LoginModal;
