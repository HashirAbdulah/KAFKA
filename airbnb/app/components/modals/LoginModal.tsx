// "use client";

// import Modal from "./Modal";
// import CustomButton from "../forms/CustomButton";
// import { useState, useEffect } from "react";
// import useAuthModals from "@/app/hooks/useAuthModals";
// import { useRouter } from "next/navigation";
// import apiService from "@/app/services/apiService";
// import { handleLogin } from "@/app/lib/action";
// import {
//   useFormValidation,
//   commonValidationRules,
// } from "@/app/hooks/useFormValidation";
// import { useNotification } from "../ui/Notification";
// import { logger } from "@/app/services/logger";
// import useApiRequest from "@/app/hooks/useApiRequest";
// import LoadingSpinner from "../ui/LoadingSpinner";
// import ErrorMessage from "../ui/ErrorMessage";
// import ForgotPasswordModal from "./ForgotPasswordModal";
// import PasswordInput from "../ui/PasswordInput";

// const LoginModal = () => {
//   const router = useRouter();
//   const { isLoginModalOpen, closeLoginModal, switchToSignup } = useAuthModals();
//   const showNotification = useNotification((state) => state.showNotification);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showForgotPassword, setShowForgotPassword] = useState(false);

//   const {
//     errors,
//     validateForm,
//     validateFieldOnChange,
//     setFieldTouched,
//     clearErrors,
//   } = useFormValidation({
//     email: commonValidationRules.email,
//     password: [{ required: true, message: "Password is required" }],
//   });

//   const {
//     loading,
//     error,
//     execute: executeLogin,
//     reset: resetApiState,
//   } = useApiRequest(
//     async (credentials: { email: string; password: string }) => {
//       const response = await apiService.postWithoutToken(
//         "/api/auth/login/",
//         credentials
//       );

//       if (response.access) {
//         logger.info("Login successful", { userId: response.user.pk });
//         await handleLogin(response.user.pk, response.access, response.refresh);
//         showNotification("Successfully logged in!", "success");
//         closeLoginModal();
//         router.push("/");
//         return response;
//       } else {
//         throw new Error(response.non_field_errors?.[0] || "Login failed");
//       }
//     }
//   );

//   useEffect(() => {
//     if (isLoginModalOpen) {
//       clearErrors();
//       resetApiState();
//       setEmail("");
//       setPassword("");
//     }
//   }, [isLoginModalOpen, clearErrors, resetApiState]);

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setEmail(value);
//     validateFieldOnChange("email", value);
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setPassword(value);
//     validateFieldOnChange("password", value);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const isValid = validateForm({ email, password });
//     if (!isValid) return;

//     try {
//       await executeLogin({ email, password });
//     } catch (err) {
//       logger.error("Login error", err);
//       showNotification("Failed to log in. Please try again.", "error");
//     }
//   };

//   const content = (
//     <div onClick={(e) => e.stopPropagation()}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {error && (
//           <ErrorMessage
//             message={error}
//             onRetry={resetApiState}
//             className="mb-6"
//           />
//         )}

//         <div className="space-y-2">
//           <input
//             onChange={handleEmailChange}
//             onBlur={() => setFieldTouched("email")}
//             value={email}
//             placeholder="Your e-mail address"
//             type="email"
//             className={`w-full h-[54px] px-4 border ${
//               errors.email ? "border-red-500" : "border-purple-300"
//             } rounded-xl focus:ring-2 focus:ring-purple-500`}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm">{errors.email[0]}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <PasswordInput
//             value={password}
//               onChange={handlePasswordChange}
//               onBlur={() => setFieldTouched("password")}
//               placeholder="Your password"
//             error={!!errors.password}
//             required
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm">{errors.password[0]}</p>
//           )}
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="button"
//             className="text-sm text-indigo-600 hover:underline"
//             onClick={() => setShowForgotPassword(true)}
//           >
//             Forgot Password?
//           </button>
//         </div>

//         <CustomButton
//           label={loading ? "Logging in..." : "Log in"}
//           type="submit"
//           disabled={loading}
//         />

//         {loading && (
//           <div className="flex justify-center">
//             <LoadingSpinner size="small" />
//           </div>
//         )}
//         <div className="mt-4 text-center">
//           <span className="text-sm text-gray-600">Don't have an account? </span>
//           <button
//             type="button"
//             className="text-sm text-indigo-600 hover:underline"
//             onClick={() => switchToSignup()}
//           >
//             Sign Up
//           </button>
//         </div>
//       </form>
//       <ForgotPasswordModal
//         isOpen={showForgotPassword}
//         onClose={() => setShowForgotPassword(false)}
//       />
//     </div>
//   );

//   return (
//     <Modal
//       isOpen={isLoginModalOpen}
//       close={closeLoginModal}
//       label="Log in"
//       title="Log in"
//       content={content}
//       closeOnOutsideClick={false}
//     />
//   );
// };

// export default LoginModal;
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
    <div className="max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 hover:scrollbar-thumb-purple-400 pr-2">
      <div className="px-6 py-8">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 rounded-3xl flex items-center justify-center shadow-lg ring-1 ring-purple-200/50">
            <svg
              className="w-10 h-10 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
              Sign in to your account and continue your journey with us
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-5 shadow-sm">
              <ErrorMessage
                message={error}
                onRetry={resetApiState}
                className="!mb-0 !bg-transparent !border-0 !p-0"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className={`group relative bg-gradient-to-r from-white to-gray-50/30 border-2 rounded-2xl shadow-sm transition-all duration-300 ${
              errors.email
                ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-6 focus-within:ring-red-500/15 shadow-red-100"
                : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-6 focus-within:ring-purple-500/15 hover:shadow-purple-100/50"
            }`}>
              <div className="absolute inset-y-0 left-5 flex items-center">
                <svg className={`w-5 h-5 transition-colors duration-200 ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                onChange={handleEmailChange}
                onBlur={() => setFieldTouched("email")}
                value={email}
                placeholder="Enter your email address"
                type="email"
                className="w-full h-16 pl-14 pr-5 bg-transparent border-0 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center space-x-2 mt-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.email[0]}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className={`group relative bg-gradient-to-r from-white to-gray-50/30 border-2 rounded-2xl shadow-sm transition-all duration-300 ${
              errors.password
                ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-6 focus-within:ring-red-500/15 shadow-red-100"
                : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-6 focus-within:ring-purple-500/15 hover:shadow-purple-100/50"
            }`}>
              <div className="absolute inset-y-0 left-5 flex items-center z-10">
                <svg className={`w-5 h-5 transition-colors duration-200 ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <PasswordInput
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setFieldTouched("password")}
                placeholder="Enter your password"
                error={!!errors.password}
                required
                className="w-full h-16 pl-14 pr-14 bg-transparent border-0 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center space-x-2 mt-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.password[0]}</span>
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              className="group inline-flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              onClick={() => setShowForgotPassword(true)}
            >
              <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Forgot Password?</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-16 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 focus:ring-6 focus:ring-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center space-x-3">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or</span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 font-medium">New to our community?</p>
            <button
              type="button"
              className="group inline-flex items-center space-x-3 px-6 py-3 text-purple-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 rounded-xl font-semibold transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105"
              onClick={() => {
                switchToSignup();
              }}
            >
              <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Create your account</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Secure login protected by advanced encryption.
              <br />
              Your privacy and security are our top priorities.
            </p>
          </div>
        </form>

        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isLoginModalOpen}
      close={closeLoginModal}
      title=""
      content={content}
      label={""}
      closeOnOutsideClick={false}
    />
  );
};

export default LoginModal;
