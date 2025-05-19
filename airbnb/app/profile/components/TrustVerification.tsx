"use client";

import { useState } from "react";
import { UserProfile } from "../../types";
import apiService from "../../services/apiService";

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
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        {/* Email Verification Status */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Verify your email address to increase trust and security
          </p>
          <div className="mt-4">
            {profile.is_email_verified ? (
              <div className="p-4 bg-green-50 rounded-md flex items-center">
                <svg
                  className="h-5 w-5 text-green-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Email verified
                </span>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-md flex items-center">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414-1.414M12 8v4l3 3"
                  />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  Email not verified
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Phone Verification Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Phone Verification
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Verify your phone number to increase trust and security
          </p>

          {!profile.is_phone_verified ? (
            <div className="mt-4">
              <form onSubmit={handlePhoneVerification} className="space-y-4">
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="block text-sm font-medium text-gray-700"
                        >
                          Verification Code
                        </label>
                        <input
                          type="text"
                          name="verification_code"
                          id="verification_code"
                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Verifying..." : "Verify Code"}
                      </button>
                    </form>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Phone number verified
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Your phone number has been verified successfully
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
