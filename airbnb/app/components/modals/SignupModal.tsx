// // "use client";
// // import Modal from "./Modal";
// // import { useState } from "react";
// // import { useRouter } from "next/navigation";
// // import useAuthModals from "@/app/hooks/useAuthModals";
// // import CustomButton from "../forms/CustomButton";
// // import apiService from "@/app/services/apiService";
// // import { handleLogin } from "@/app/lib/action";
// // import {
// //   useFormValidation,
// //   commonValidationRules,
// // } from "@/app/hooks/useFormValidation";
// // import { useNotification } from "../ui/Notification";
// // import LoadingSpinner from "../ui/LoadingSpinner";
// // import ErrorMessage from "../ui/ErrorMessage";
// // import EmailVerificationModal from "./EmailVerificationModal";
// // import ProfileCompletionModal from "./ProfileCompletionModal";
// // import PasswordInput from "../ui/PasswordInput";

// // const SignupModal = () => {
// //   const router = useRouter();
// //   const { isSignupModalOpen, closeSignupModal, switchToLogin } =
// //     useAuthModals();
// //   const showNotification = useNotification((state) => state.showNotification);

// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password1, setPassword1] = useState("");
// //   const [password2, setPassword2] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // New state for verification flow
// //   const [showVerificationModal, setShowVerificationModal] = useState(false);
// //   const [showProfileCompletionModal, setShowProfileCompletionModal] =
// //     useState(false);

// //   const {
// //     errors,
// //     validateForm,
// //     validateFieldOnChange,
// //     setFieldTouched,
// //     clearErrors,
// //   } = useFormValidation({
// //     name: [{ required: true, message: "Name is required" }],
// //     email: commonValidationRules.email,
// //     password1: commonValidationRules.password,
// //     password2: [{ required: true, message: "Please confirm your password" }],
// //   });

// //   const submitSignup = async () => {
// //     const formData = {
// //       name,
// //       email,
// //       password1,
// //       password2,
// //     };

// //     const isValid = validateForm(formData);
// //     if (!isValid) return;

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const response = await apiService.postWithoutToken(
// //         "/api/auth/register/",
// //         formData
// //       );

// //       if (response.requires_verification) {
// //         setShowVerificationModal(true);
// //         showNotification(
// //           "Please check your email for verification code",
// //           "info"
// //         );
// //       } else if (response.access) {
// //         handleLogin(response.user.pk, response.access, response.refresh);
// //         showNotification("Successfully signed up!", "success");
// //         closeSignupModal();
// //         setShowProfileCompletionModal(true);
// //       } else {
// //         const tmpErrors: string[] = [];
// //         if (response.name) tmpErrors.push(...response.name);
// //         if (response.email) tmpErrors.push(...response.email);
// //         if (response.password1) tmpErrors.push(...response.password1);
// //         if (response.password2) tmpErrors.push(...response.password2);
// //         if (tmpErrors.length === 0)
// //           tmpErrors.push("An unexpected error occurred.");
// //         setError(tmpErrors.join(", "));
// //       }
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.message.includes("400") && error.message.includes("email")
// //           ? "This email is already registered."
// //           : "An error occurred during signup. Please try again.";
// //       setError(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerificationSuccess = () => {
// //     setShowVerificationModal(false);
// //     closeSignupModal();
// //     setShowProfileCompletionModal(true);
// //   };

// //   const content = (
// //     <>
// //       <form
// //         onSubmit={(e) => {
// //           e.preventDefault();
// //           submitSignup();
// //         }}
// //         className="space-y-4"
// //       >
// //         {error && (
// //           <ErrorMessage
// //             message={error}
// //             onRetry={() => setError(null)}
// //             className="mb-6"
// //           />
// //         )}

// //         <div className="space-y-2">
// //           <input
// //             onChange={(e) => {
// //               setName(e.target.value);
// //               validateFieldOnChange("name", e.target.value);
// //             }}
// //             onBlur={() => setFieldTouched("name")}
// //             value={name}
// //             placeholder="Your name"
// //             type="text"
// //             className={`w-full h-[54px] px-4 border ${
// //               errors.name ? "border-red-500" : "border-purple-300"
// //             } rounded-xl focus:ring-2 focus:ring-purple-500`}
// //           />
// //           {errors.name && (
// //             <p className="text-red-500 text-sm">{errors.name[0]}</p>
// //           )}
// //         </div>

// //         <div className="space-y-2">
// //           <input
// //             onChange={(e) => {
// //               setEmail(e.target.value);
// //               validateFieldOnChange("email", e.target.value);
// //             }}
// //             onBlur={() => setFieldTouched("email")}
// //             value={email}
// //             placeholder="Your e-mail address"
// //             type="email"
// //             className={`w-full h-[54px] px-4 border ${
// //               errors.email ? "border-red-500" : "border-purple-300"
// //             } rounded-xl focus:ring-2 focus:ring-purple-500`}
// //           />
// //           {errors.email && (
// //             <p className="text-red-500 text-sm">{errors.email[0]}</p>
// //           )}
// //         </div>

// //         <div className="space-y-2">
// //           <PasswordInput
// //             value={password1}
// //               onChange={(e) => {
// //                 setPassword1(e.target.value);
// //                 validateFieldOnChange("password1", e.target.value);
// //               }}
// //               onBlur={() => setFieldTouched("password1")}
// //               placeholder="Your password"
// //             error={!!errors.password1}
// //             required
// //           />
// //           {errors.password1 && (
// //             <p className="text-red-500 text-sm">{errors.password1[0]}</p>
// //           )}
// //         </div>

// //         <div className="space-y-2">
// //           <PasswordInput
// //             value={password2}
// //               onChange={(e) => {
// //                 setPassword2(e.target.value);
// //                 validateFieldOnChange("password2", e.target.value);
// //               }}
// //               onBlur={() => setFieldTouched("password2")}
// //               placeholder="Repeat password"
// //             error={!!errors.password2}
// //             required
// //           />
// //           {errors.password2 && (
// //             <p className="text-red-500 text-sm">{errors.password2[0]}</p>
// //           )}
// //         </div>

// //         <CustomButton
// //           label={loading ? <LoadingSpinner /> : "Sign up"}
// //           onClick={submitSignup}
// //           disabled={loading}
// //         />

// //         {loading && (
// //           <div className="flex justify-center">
// //             <LoadingSpinner size="small" />
// //           </div>
// //         )}
// //         <div className="mt-4 text-center">
// //           <span className="text-sm text-gray-600">
// //             Already have an account?{" "}
// //           </span>
// //           <button
// //             type="button"
// //             className="text-sm text-indigo-600 hover:underline"
// //             onClick={() => {
// //               switchToLogin();
// //             }}
// //           >
// //             Login
// //           </button>
// //         </div>
// //       </form>

// //       <EmailVerificationModal
// //         isOpen={showVerificationModal}
// //         onClose={() => setShowVerificationModal(false)}
// //         email={email}
// //         onVerificationSuccess={handleVerificationSuccess}
// //       />

// //       <ProfileCompletionModal
// //         isOpen={showProfileCompletionModal}
// //         onClose={() => setShowProfileCompletionModal(false)}
// //       />
// //     </>
// //   );

// //   return (
// //     <Modal
// //       isOpen={isSignupModalOpen}
// //       close={closeSignupModal}
// //       title="Sign up"
// //       content={content}
// //       label={""}
// //     />
// //   );
// // };

// // export default SignupModal;
// "use client";
// import Modal from "./Modal";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import useAuthModals from "@/app/hooks/useAuthModals";
// import CustomButton from "../forms/CustomButton";
// import apiService from "@/app/services/apiService";
// import { handleLogin } from "@/app/lib/action";
// import {
//   useFormValidation,
//   commonValidationRules,
// } from "@/app/hooks/useFormValidation";
// import { useNotification } from "../ui/Notification";
// import LoadingSpinner from "../ui/LoadingSpinner";
// import ErrorMessage from "../ui/ErrorMessage";
// import EmailVerificationModal from "./EmailVerificationModal";
// import ProfileCompletionModal from "./ProfileCompletionModal";
// import PasswordInput from "../ui/PasswordInput";

// const SignupModal = () => {
//   const router = useRouter();
//   const { isSignupModalOpen, closeSignupModal, switchToLogin } =
//     useAuthModals();
//   const showNotification = useNotification((state) => state.showNotification);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password1, setPassword1] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // New state for verification flow
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [showProfileCompletionModal, setShowProfileCompletionModal] =
//     useState(false);

//   const {
//     errors,
//     validateForm,
//     validateFieldOnChange,
//     setFieldTouched,
//     clearErrors,
//   } = useFormValidation({
//     name: [{ required: true, message: "Name is required" }],
//     email: commonValidationRules.email,
//     password1: commonValidationRules.password,
//     password2: [{ required: true, message: "Please confirm your password" }],
//   });

//   const submitSignup = async () => {
//     const formData = {
//       name,
//       email,
//       password1,
//       password2,
//     };

//     const isValid = validateForm(formData);
//     if (!isValid) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await apiService.postWithoutToken(
//         "/api/auth/register/",
//         formData
//       );

//       if (response.requires_verification) {
//         setShowVerificationModal(true);
//         showNotification(
//           "Please check your email for verification code",
//           "info"
//         );
//       } else if (response.access) {
//         handleLogin(response.user.pk, response.access, response.refresh);
//         showNotification("Successfully signed up!", "success");
//         closeSignupModal();
//         setShowProfileCompletionModal(true);
//       } else {
//         const tmpErrors: string[] = [];
//         if (response.name) tmpErrors.push(...response.name);
//         if (response.email) tmpErrors.push(...response.email);
//         if (response.password1) tmpErrors.push(...response.password1);
//         if (response.password2) tmpErrors.push(...response.password2);
//         if (tmpErrors.length === 0)
//           tmpErrors.push("An unexpected error occurred.");
//         setError(tmpErrors.join(", "));
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.message.includes("400") && error.message.includes("email")
//           ? "This email is already registered."
//           : "An error occurred during signup. Please try again.";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerificationSuccess = () => {
//     setShowVerificationModal(false);
//     closeSignupModal();
//     setShowProfileCompletionModal(true);
//   };

//   const content = (
//     <div className="p-6">
//       {/* Header Section */}
//       <div className="text-center space-y-3 mb-8">
//         <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-sm">
//           <svg
//             className="w-8 h-8 text-purple-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.5}
//               d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
//             />
//           </svg>
//         </div>
//         <div className="space-y-1">
//           <h3 className="text-xl font-semibold text-gray-900">Create your account</h3>
//           <p className="text-gray-500 text-sm">
//             Join us and start your journey today
//           </p>
//         </div>
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           submitSignup();
//         }}
//         className="space-y-6"
//       >
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//             <ErrorMessage
//               message={error}
//               onRetry={() => setError(null)}
//               className="!mb-0 !bg-transparent !border-0 !p-0"
//             />
//           </div>
//         )}

//         {/* Name Field */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Full Name
//           </label>
//           <div className={`relative bg-white border-2 rounded-xl shadow-sm transition-all duration-200 ${
//             errors.name
//               ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
//               : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10"
//           }`}>
//             <div className="absolute inset-y-0 left-4 flex items-center">
//               <svg className={`w-5 h-5 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <input
//               onChange={(e) => {
//                 setName(e.target.value);
//                 validateFieldOnChange("name", e.target.value);
//               }}
//               onBlur={() => setFieldTouched("name")}
//               value={name}
//               placeholder="Enter your full name"
//               type="text"
//               className="w-full h-14 pl-12 pr-4 bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none placeholder:text-gray-400"
//             />
//           </div>
//           {errors.name && (
//             <p className="text-red-500 text-sm flex items-center space-x-1">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               <span>{errors.name[0]}</span>
//             </p>
//           )}
//         </div>

//         {/* Email Field */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Email Address
//           </label>
//           <div className={`relative bg-white border-2 rounded-xl shadow-sm transition-all duration-200 ${
//             errors.email
//               ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
//               : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10"
//           }`}>
//             <div className="absolute inset-y-0 left-4 flex items-center">
//               <svg className={`w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <input
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 validateFieldOnChange("email", e.target.value);
//               }}
//               onBlur={() => setFieldTouched("email")}
//               value={email}
//               placeholder="Enter your email address"
//               type="email"
//               className="w-full h-14 pl-12 pr-4 bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none placeholder:text-gray-400"
//             />
//           </div>
//           {errors.email && (
//             <p className="text-red-500 text-sm flex items-center space-x-1">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               <span>{errors.email[0]}</span>
//             </p>
//           )}
//         </div>

//         {/* Password Field */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <div className={`relative bg-white border-2 rounded-xl shadow-sm transition-all duration-200 ${
//             errors.password1
//               ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
//               : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10"
//           }`}>
//             <PasswordInput
//               value={password1}
//               onChange={(e) => {
//                 setPassword1(e.target.value);
//                 validateFieldOnChange("password1", e.target.value);
//               }}
//               onBlur={() => setFieldTouched("password1")}
//               placeholder="Create a strong password"
//               error={!!errors.password1}
//               required
//               className="w-full h-14 pl-12 pr-12 bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none placeholder:text-gray-400"
//             />
//             <div className="absolute inset-y-0 left-4 flex items-center">
//               <svg className={`w-5 h-5 ${errors.password1 ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//           </div>
//           {errors.password1 && (
//             <p className="text-red-500 text-sm flex items-center space-x-1">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               <span>{errors.password1[0]}</span>
//             </p>
//           )}
//         </div>

//         {/* Confirm Password Field */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Confirm Password
//           </label>
//           <div className={`relative bg-white border-2 rounded-xl shadow-sm transition-all duration-200 ${
//             errors.password2
//               ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
//               : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10"
//           }`}>
//             <PasswordInput
//               value={password2}
//               onChange={(e) => {
//                 setPassword2(e.target.value);
//                 validateFieldOnChange("password2", e.target.value);
//               }}
//               onBlur={() => setFieldTouched("password2")}
//               placeholder="Confirm your password"
//               error={!!errors.password2}
//               required
//               className="w-full h-14 pl-12 pr-12 bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none placeholder:text-gray-400"
//             />
//             <div className="absolute inset-y-0 left-4 flex items-center">
//               <svg className={`w-5 h-5 ${errors.password2 ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//           {errors.password2 && (
//             <p className="text-red-500 text-sm flex items-center space-x-1">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               <span>{errors.password2[0]}</span>
//             </p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="pt-2">
//           <CustomButton
//             label={loading ? <LoadingSpinner /> : "Create Account"}
//             onClick={submitSignup}
//             disabled={loading}
//             className="group relative w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
//           />
//         </div>

//         {/* Login Link */}
//         <div className="relative pt-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200" />
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-3 bg-white text-gray-500">or</span>
//           </div>
//         </div>

//         <div className="text-center space-y-2">
//           <p className="text-sm text-gray-600">Already have an account?</p>
//           <button
//             type="button"
//             className="inline-flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200"
//             onClick={() => {
//               switchToLogin();
//             }}
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//             </svg>
//             <span>Sign in instead</span>
//           </button>
//         </div>
//       </form>

//       <EmailVerificationModal
//         isOpen={showVerificationModal}
//         onClose={() => setShowVerificationModal(false)}
//         email={email}
//         onVerificationSuccess={handleVerificationSuccess}
//       />

//       <ProfileCompletionModal
//         isOpen={showProfileCompletionModal}
//         onClose={() => setShowProfileCompletionModal(false)}
//       />
//     </div>
//   );

//   return (
//     <Modal
//       isOpen={isSignupModalOpen}
//       close={closeSignupModal}
//       title=""
//       content={content}
//       label={""}
//     />
//   );
// };

// export default SignupModal;
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Join Our Community</h3>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
              Create your account and unlock amazing features tailored just for you
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitSignup();
          }}
          className="space-y-8"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-5 shadow-sm">
              <ErrorMessage
                message={error}
                onRetry={() => setError(null)}
                className="!mb-0 !bg-transparent !border-0 !p-0"
              />
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className={`group relative bg-gradient-to-r from-white to-gray-50/30 border-2 rounded-2xl shadow-sm transition-all duration-300 ${
              errors.name
                ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-6 focus-within:ring-red-500/15 shadow-red-100"
                : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-6 focus-within:ring-purple-500/15 hover:shadow-purple-100/50"
            }`}>
              <div className="absolute inset-y-0 left-5 flex items-center">
                <svg className={`w-5 h-5 transition-colors duration-200 ${errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                onChange={(e) => {
                  setName(e.target.value);
                  validateFieldOnChange("name", e.target.value);
                }}
                onBlur={() => setFieldTouched("name")}
                value={name}
                placeholder="Enter your full name"
                type="text"
                className="w-full h-16 pl-14 pr-5 bg-transparent border-0 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center space-x-2 mt-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.name[0]}</span>
              </p>
            )}
          </div>

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
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateFieldOnChange("email", e.target.value);
                }}
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
              errors.password1
                ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-6 focus-within:ring-red-500/15 shadow-red-100"
                : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-6 focus-within:ring-purple-500/15 hover:shadow-purple-100/50"
            }`}>
              <div className="absolute inset-y-0 left-5 flex items-center z-10">
                <svg className={`w-5 h-5 transition-colors duration-200 ${errors.password1 ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <PasswordInput
                value={password1}
                onChange={(e) => {
                  setPassword1(e.target.value);
                  validateFieldOnChange("password1", e.target.value);
                }}
                onBlur={() => setFieldTouched("password1")}
                placeholder="Create a strong password"
                error={!!errors.password1}
                required
                className="w-full h-16 pl-14 pr-14 bg-transparent border-0 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              />
            </div>
            {errors.password1 && (
              <p className="text-red-500 text-sm flex items-center space-x-2 mt-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.password1[0]}</span>
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className={`group relative bg-gradient-to-r from-white to-gray-50/30 border-2 rounded-2xl shadow-sm transition-all duration-300 ${
              errors.password2
                ? "border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-6 focus-within:ring-red-500/15 shadow-red-100"
                : "border-gray-200 hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-6 focus-within:ring-purple-500/15 hover:shadow-purple-100/50"
            }`}>
              <div className="absolute inset-y-0 left-5 flex items-center z-10">
                <svg className={`w-5 h-5 transition-colors duration-200 ${errors.password2 ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <PasswordInput
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  validateFieldOnChange("password2", e.target.value);
                }}
                onBlur={() => setFieldTouched("password2")}
                placeholder="Confirm your password"
                error={!!errors.password2}
                required
                className="w-full h-16 pl-14 pr-14 bg-transparent border-0 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              />
            </div>
            {errors.password2 && (
              <p className="text-red-500 text-sm flex items-center space-x-2 mt-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.password2[0]}</span>
              </p>
            )}
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
                    <span>Create Account</span>
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

          {/* Login Link */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 font-medium">Already part of our community?</p>
            <button
              type="button"
              className="group inline-flex items-center space-x-3 px-6 py-3 text-purple-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 rounded-xl font-semibold transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105"
              onClick={() => {
                switchToLogin();
              }}
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Sign in to your account</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
              <br />
              We'll keep your information secure and never share it with third parties.
            </p>
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
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isSignupModalOpen}
      close={closeSignupModal}
      title=""
      content={content}
      label={""}
    />
  );
};

export default SignupModal;
