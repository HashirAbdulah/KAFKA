"use client";
import Modal from "./Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthModals from "@/app/hooks/useAuthModals";
import CustomButton from "../forms/CustomButton";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/action";
import {
  useFormValidation,
  commonValidationRules,
} from "@/app/hooks/useFormValidation";
import { useNotification } from "../ui/Notification";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import EmailVerificationModal from "./EmailVerificationModal";
import ProfileCompletionModal from "./ProfileCompletionModal";
import PasswordInput from "../ui/PasswordInput";

const SignupModal = () => {
  const router = useRouter();
  const { isSignupModalOpen, closeSignupModal, switchToLogin } =
    useAuthModals();
  const showNotification = useNotification((state) => state.showNotification);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for verification flow
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] =
    useState(false);

  const {
    errors,
    validateForm,
    validateFieldOnChange,
    setFieldTouched,
    clearErrors,
  } = useFormValidation({
    name: [{ required: true, message: "Name is required" }],
    email: commonValidationRules.email,
    password1: commonValidationRules.password,
    password2: [{ required: true, message: "Please confirm your password" }],
  });

  const submitSignup = async () => {
    const formData = {
      name,
      email,
      password1,
      password2,
    };

    const isValid = validateForm(formData);
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.postWithoutToken(
        "/api/auth/register/",
        formData
      );

      if (response.requires_verification) {
        setShowVerificationModal(true);
        showNotification(
          "Please check your email for verification code",
          "info"
        );
      } else if (response.access) {
        handleLogin(response.user.pk, response.access, response.refresh);
        showNotification("Successfully signed up!", "success");
        closeSignupModal();
        setShowProfileCompletionModal(true);
      } else {
        const tmpErrors: string[] = [];
        if (response.name) tmpErrors.push(...response.name);
        if (response.email) tmpErrors.push(...response.email);
        if (response.password1) tmpErrors.push(...response.password1);
        if (response.password2) tmpErrors.push(...response.password2);
        if (tmpErrors.length === 0)
          tmpErrors.push("An unexpected error occurred.");
        setError(tmpErrors.join(", "));
      }
    } catch (error: any) {
      const errorMessage =
        error.message.includes("400") && error.message.includes("email")
          ? "This email is already registered."
          : "An error occurred during signup. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    closeSignupModal();
    setShowProfileCompletionModal(true);
  };

  const content = (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSignup();
        }}
        className="space-y-4"
      >
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => setError(null)}
            className="mb-6"
          />
        )}

        <div className="space-y-2">
          <input
            onChange={(e) => {
              setName(e.target.value);
              validateFieldOnChange("name", e.target.value);
            }}
            onBlur={() => setFieldTouched("name")}
            value={name}
            placeholder="Your name"
            type="text"
            className={`w-full h-[54px] px-4 border ${
              errors.name ? "border-red-500" : "border-purple-300"
            } rounded-xl focus:ring-2 focus:ring-purple-500`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
              validateFieldOnChange("email", e.target.value);
            }}
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
            value={password1}
              onChange={(e) => {
                setPassword1(e.target.value);
                validateFieldOnChange("password1", e.target.value);
              }}
              onBlur={() => setFieldTouched("password1")}
              placeholder="Your password"
            error={!!errors.password1}
            required
          />
          {errors.password1 && (
            <p className="text-red-500 text-sm">{errors.password1[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
                validateFieldOnChange("password2", e.target.value);
              }}
              onBlur={() => setFieldTouched("password2")}
              placeholder="Repeat password"
            error={!!errors.password2}
            required
          />
          {errors.password2 && (
            <p className="text-red-500 text-sm">{errors.password2[0]}</p>
          )}
        </div>

        <CustomButton
          label={loading ? <LoadingSpinner /> : "Sign up"}
          onClick={submitSignup}
          disabled={loading}
        />

        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner size="small" />
          </div>
        )}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
          </span>
          <button
            type="button"
            className="text-sm text-indigo-600 hover:underline"
            onClick={() => {
              switchToLogin();
            }}
          >
            Login
          </button>
        </div>
      </form>

      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <ProfileCompletionModal
        isOpen={showProfileCompletionModal}
        onClose={() => setShowProfileCompletionModal(false)}
      />
    </>
  );

  return (
    <Modal
      isOpen={isSignupModalOpen}
      close={closeSignupModal}
      title="Sign up"
      content={content}
      label={""}
    />
  );
};

export default SignupModal;
