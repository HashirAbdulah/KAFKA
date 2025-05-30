// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ProfileHeader from "./components/ProfileHeader";
// import BasicInfo from "./components/BasicInfo";
// import AccountSecurity from "./components/AccountSecurity";
// import ProfileDetails from "./components/ProfileDetails";
// import TrustVerification from "./components/TrustVerification";
// import PrivacySettings from "./components/PrivacySettings";
// import { UserProfile } from "../types";
// import apiService from "../services/apiService";
// import useLoginModal from "../hooks/useLoginModal";
// import { getAccessToken } from "../lib/action";

// export default function ProfilePage() {
//   const router = useRouter();
//   const loginModal = useLoginModal();
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [activeTab, setActiveTab] = useState("basic");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const token = await getAccessToken();

//         if (!token) {
//           loginModal.open();
//           return;
//         }

//         const data = await apiService.get("/api/auth/profile/");
//         setProfile(data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         if (error instanceof Error) {
//           if (error.message.includes("401")) {
//             loginModal.open();
//           } else {
//             setError("Failed to load profile. Please try again.");
//           }
//         } else {
//           setError("An unexpected error occurred.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [loginModal]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-red-500">{error}</div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return null;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <ProfileHeader profile={profile} onUpdate={setProfile} />

//       <div className="mt-8">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8 overflow-x-auto">
//             {[
//               { id: "basic", label: "Basic Info" },
//               { id: "security", label: "Security" },
//               { id: "details", label: "Details" },
//               { id: "verification", label: "Verification" },
//               { id: "privacy", label: "Privacy" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`
//                   whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
//                   ${
//                     activeTab === tab.id
//                       ? "border-indigo-500 text-indigo-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }
//                 `}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="mt-8">
//           {activeTab === "basic" && (
//             <BasicInfo profile={profile} onUpdate={setProfile} />
//           )}
//           {activeTab === "security" && (
//             <AccountSecurity profile={profile} onUpdate={setProfile} />
//           )}
//           {activeTab === "details" && (
//             <ProfileDetails
//               profile={{
//                 bio: profile.bio || '',
//                 location: profile.location || '',
//                 occupation: profile.occupation || '',
//                 interests: profile.interests || ''
//               }}
//               onUpdate={setProfile}
//             />
//           )}
//           {activeTab === "verification" && (
//             <TrustVerification profile={profile} onUpdate={setProfile} />
//           )}
//           {activeTab === "privacy" && (
//             <PrivacySettings profile={profile} onUpdate={setProfile} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
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
import { User, Sparkles } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-slate-50/50">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-spin">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg">
            <Sparkles className="w-2 h-2 text-white m-0.5" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-slate-50/50">
        <div className="group/display p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        </div>
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
        <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5 rounded-3xl p-6 border border-slate-200/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 via-purple-500/3 to-pink-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <nav className="relative -mb-px flex space-x-8 overflow-x-auto">
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
                  group/tab relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-indigo-200"
                  }
                  transition-all duration-300
                `}
              >
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-t-xl"></div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover/tab:opacity-100 transition-opacity duration-300"></div>
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
            <ProfileDetails
              profile={{
                bio: profile.bio || '',
                location: profile.location || '',
                occupation: profile.occupation || '',
                interests: profile.interests || ''
              }}
              onUpdate={setProfile}
            />
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
