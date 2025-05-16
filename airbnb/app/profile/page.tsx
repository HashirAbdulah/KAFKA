"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "./components/ProfileHeader";
import BasicInfo from "./components/BasicInfo";
import AccountSecurity from "./components/AccountSecurity";
import ProfileDetails from "./components/ProfileDetails";
import TrustVerification from "./components/TrustVerification";
import PrivacySettings from "./components/PrivacySettings";
import { UserProfile } from "../types";
import apiService from "../services/apiService";
import useLoginModal from "../hooks/useLoginModal";
import { getAccessToken } from "../lib/action";

export default function ProfilePage() {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = await getAccessToken();

        if (!token) {
          loginModal.open();
          return;
        }

        const data = await apiService.get("/api/auth/profile/");
        setProfile(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error instanceof Error) {
          if (error.message.includes("401")) {
            loginModal.open();
          } else {
            setError("Failed to load profile. Please try again.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [loginModal]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader profile={profile} onUpdate={setProfile} />

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: "basic", label: "Basic Info" },
              { id: "security", label: "Security" },
              { id: "details", label: "Details" },
              { id: "verification", label: "Verification" },
              { id: "privacy", label: "Privacy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === "basic" && (
            <BasicInfo profile={profile} onUpdate={setProfile} />
          )}
          {activeTab === "security" && (
            <AccountSecurity profile={profile} onUpdate={setProfile} />
          )}
          {activeTab === "details" && (
            <ProfileDetails profile={profile} onUpdate={setProfile} />
          )}
          {activeTab === "verification" && (
            <TrustVerification profile={profile} onUpdate={setProfile} />
          )}
          {activeTab === "privacy" && (
            <PrivacySettings profile={profile} onUpdate={setProfile} />
          )}
        </div>
      </div>
    </div>
  );
}
