// "use client";

// import { useState } from "react";
// import { UserProfile } from "../../types";
// import apiService from "../../services/apiService";

// interface TrustVerificationProps {
//   profile: UserProfile;
//   onUpdate: (profile: UserProfile) => void;
// }

// export default function TrustVerification({
//   profile,
//   onUpdate,
// }: TrustVerificationProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");

//   const handlePhoneVerification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
//     setIsLoading(true);

//     try {
//       await apiService.post("/api/auth/profile/verify-phone/", {
//         phone_number: phoneNumber,
//       });
//       setSuccess("Verification code sent successfully");
//     } catch (error) {
//       console.error("Error sending verification code:", error);
//       setError("Failed to send verification code. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyCode = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
//     setIsLoading(true);

//     const formData = new FormData(e.target as HTMLFormElement);
//     const code = formData.get("verification_code") as string;

//     try {
//       const updatedProfile = await apiService.post(
//         "/api/auth/profile/verify-code/",
//         {
//           code,
//         }
//       );
//       onUpdate(updatedProfile);
//       setSuccess("Phone number verified successfully");
//     } catch (error) {
//       console.error("Error verifying code:", error);
//       setError("Invalid verification code. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <div className="space-y-6">
//         {/* Email Verification Status */}
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">
//             Email Verification
//           </h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Verify your email address to increase trust and security
//           </p>
//           <div className="mt-4">
//             {profile.is_email_verified ? (
//               <div className="p-4 bg-green-50 rounded-md flex items-center">
//                 <svg
//                   className="h-5 w-5 text-green-400 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//                 <span className="text-sm font-medium text-green-800">
//                   Email verified
//                 </span>
//               </div>
//             ) : (
//               <div className="p-4 bg-yellow-50 rounded-md flex items-center">
//                 <svg
//                   className="h-5 w-5 text-yellow-400 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414-1.414M12 8v4l3 3"
//                   />
//                 </svg>
//                 <span className="text-sm font-medium text-yellow-800">
//                   Email not verified
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* Phone Verification Section */}
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">
//             Phone Verification
//           </h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Verify your phone number to increase trust and security
//           </p>

//           {!profile.is_phone_verified ? (
//             <div className="mt-4">
//               <form onSubmit={handlePhoneVerification} className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="phone_number"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     id="phone_number"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     required
//                   />
//                 </div>

//                 {error && <p className="text-sm text-red-600">{error}</p>}

//                 {success && (
//                   <div className="space-y-4">
//                     <p className="text-sm text-green-600">{success}</p>
//                     <form onSubmit={handleVerifyCode} className="space-y-4">
//                       <div>
//                         <label
//                           htmlFor="verification_code"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Verification Code
//                         </label>
//                         <input
//                           type="text"
//                           name="verification_code"
//                           id="verification_code"
//                           className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                           required
//                         />
//                       </div>
//                       <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {isLoading ? "Verifying..." : "Verify Code"}
//                       </button>
//                     </form>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? "Sending..." : "Send Verification Code"}
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <div className="mt-4 p-4 bg-green-50 rounded-md">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-green-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-green-800">
//                     Phone number verified
//                   </p>
//                   <p className="text-sm text-green-700 mt-1">
//                     Your phone number has been verified successfully
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { UserProfile } from "../../types";
import apiService from "../../services/apiService";
import { CheckCircle, AlertCircle, Phone, Sparkles } from "lucide-react";

interface TrustVerificationProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export default function TrustVerification({
  profile,
  onUpdate,
}: TrustVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await apiService.post("/api/auth/profile/verify-phone/", {
        phone_number: phoneNumber,
      });
      setSuccess("Verification code sent successfully");
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get("verification_code") as string;

    try {
      const updatedProfile = await apiService.post(
        "/api/auth/profile/verify-code/",
        {
          code,
        }
      );
      onUpdate(updatedProfile);
      setSuccess("Phone number verified successfully");
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5 rounded-3xl p-8 border border-slate-200/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 ease-out">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 via-purple-500/3 to-pink-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 transform group-hover:scale-110 transition-transform duration-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg">
              <Sparkles className="w-2 h-2 text-white m-0.5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Trust Verification
            </h2>
            <p className="text-sm text-slate-500 mt-1">Enhance your account security</p>
          </div>
        </div>

        {/* Email Verification Status */}
        <div className="group/display p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 transform group-hover/display:scale-110 transition-transform duration-300">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Email Verification</h3>
              <p className="text-sm text-slate-500 mb-4">Verify your email address to increase trust and security</p>
              {profile.is_email_verified ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-green-800">Email verified</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800">Email not verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phone Verification Section */}
        <div className="group/display p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 transform group-hover/display:scale-110 transition-transform duration-300">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Phone Verification</h3>
              <p className="text-sm text-slate-500 mb-4">Verify your phone number to increase trust and security</p>

              {!profile.is_phone_verified ? (
                <div className="space-y-4">
                  <form onSubmit={handlePhoneVerification} className="space-y-4">
                    <div>
                      <label
                        htmlFor="phone_number"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1 w-full p-4 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-inner focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-slate-700 placeholder-slate-400"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {success && (
                      <div className="space-y-4">
                        <p className="text-sm text-green-600">{success}</p>
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                          <div>
                            <label
                              htmlFor="verification_code"
                              className="block text-sm font-medium text-slate-700"
                            >
                              Verification Code
                            </label>
                            <input
                              type="text"
                              name="verification_code"
                              id="verification_code"
                              className="mt-1 w-full p-4 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-inner focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-slate-700 placeholder-slate-400"
                              placeholder="Enter verification code"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="group/save relative w-full px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover/save:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                              {isLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                  <span className="font-medium">Verifying...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 transform group-hover/save:scale-110 transition-transform duration-300" />
                                  <span className="font-medium">Verify Code</span>
                                </>
                              )}
                            </div>
                          </button>
                        </form>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group/save relative w-full px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover/save:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span className="font-medium">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4 transform group-hover/save:scale-110 transition-transform duration-300" />
                            <span className="font-medium">Send Verification Code</span>
                          </>
                        )}
                      </div>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Phone number verified</p>
                    <p className="text-sm text-green-700 mt-1">Your phone number has been verified successfully</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
