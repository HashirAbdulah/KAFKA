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
// import { User, Sparkles } from "lucide-react";

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
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-slate-50/50">
//         <div className="relative">
//           <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-spin">
//             <User className="w-6 h-6 text-white" />
//           </div>
//           <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg">
//             <Sparkles className="w-2 h-2 text-white m-0.5" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-slate-50/50">
//         <div className="group/display p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
//           <div className="flex items-center space-x-4">
//             <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20">
//               <Sparkles className="w-5 h-5 text-white" />
//             </div>
//             <p className="text-red-600 text-sm font-medium">{error}</p>
//           </div>
//         </div>
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
//         <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5 rounded-3xl p-6 border border-slate-200/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 ease-out">
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 via-purple-500/3 to-pink-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
//           <nav className="relative -mb-px flex space-x-8 overflow-x-auto">
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
//                   group/tab relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
//                   ${
//                     activeTab === tab.id
//                       ? "border-indigo-500 text-indigo-600"
//                       : "border-transparent text-slate-500 hover:text-slate-700 hover:border-indigo-200"
//                   }
//                   transition-all duration-300
//                 `}
//               >
//                 <span className="relative z-10">{tab.label}</span>
//                 {activeTab === tab.id && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-t-xl"></div>
//                 )}
//                 <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover/tab:opacity-100 transition-opacity duration-300"></div>
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
import { User, Sparkles, Shield, Settings, Award, Eye, Info, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTabChanging, setIsTabChanging] = useState(false);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Info },
    { id: "security", label: "Security", icon: Shield },
    { id: "details", label: "Details", icon: Settings },
    { id: "verification", label: "Verification", icon: Award },
    { id: "privacy", label: "Privacy", icon: Eye },
  ];

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

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setTimeout(() => setIsTabChanging(false), 150);
    }, 150);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>

          {/* Main loading circle */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-spin">
            <User className="w-8 h-8 text-white" />
          </div>

          {/* Floating sparkle */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-3 border-white shadow-xl animate-bounce delay-300">
            <Sparkles className="w-3 h-3 text-white m-1.5" />
          </div>

          {/* Loading text */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <p className="text-slate-600 text-sm font-medium animate-pulse">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
        <div className="group/error relative p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-rose-200/60 hover:border-rose-300 hover:bg-white/90 transition-all duration-500 shadow-2xl shadow-rose-500/10 hover:shadow-2xl hover:shadow-rose-500/15 max-w-md">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover/error:opacity-100 transition-opacity duration-500"></div>

          <div className="relative flex items-center space-x-6">
            {/* Error icon */}
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover/error:scale-105 transition-transform duration-300">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>

            {/* Error message */}
            <div className="flex-1">
              <h3 className="text-rose-700 font-semibold text-lg mb-1">Oops! Something went wrong</h3>
              <p className="text-rose-600 text-sm leading-relaxed">{error}</p>
            </div>
          </div>

          {/* Retry button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header with enhanced animation */}
        <div className="animate-fade-in-up">
          <ProfileHeader profile={profile} onUpdate={setProfile} />
        </div>

        <div className="mt-8 animate-fade-in-up delay-200">
          {/* Enhanced Tab Navigation */}
          <div className="group/tabs relative bg-gradient-to-br from-white via-white to-slate-50/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/8 rounded-3xl p-1 border border-slate-200/60 hover:shadow-3xl hover:shadow-indigo-500/12 transition-all duration-700 ease-out overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 via-purple-500/3 to-pink-500/3 rounded-3xl opacity-0 group-hover/tabs:opacity-100 transition-opacity duration-700"></div>

            {/* Moving background indicator */}
            <div
              className="absolute top-1 bottom-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl transition-all duration-500 ease-out border border-indigo-200/50"
              style={{
                left: `${tabs.findIndex(tab => tab.id === activeTab) * (100 / tabs.length)}%`,
                width: `${100 / tabs.length}%`
              }}
            />

            <nav className="relative flex">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      group/tab relative flex-1 flex items-center justify-center space-x-3 py-4 px-6 font-medium text-sm rounded-2xl
                      transition-all duration-300 ease-out
                      ${isActive
                        ? "text-indigo-700 bg-white/60 shadow-lg shadow-indigo-500/10"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                      }
                    `}
                  >
                    {/* Icon with enhanced animation */}
                    <div className={`
                      flex items-center justify-center w-5 h-5 transition-all duration-300
                      ${isActive ? "scale-110" : "group-hover/tab:scale-105"}
                    `}>
                      <IconComponent className="w-full h-full" />
                    </div>

                    {/* Label */}
                    <span className="relative whitespace-nowrap">
                      {tab.label}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                      )}
                    </span>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover/tab:opacity-100 transition-opacity duration-300"></div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="mt-8 relative">
            <div className={`
              transition-all duration-300 ease-out
              ${isTabChanging ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
            `}>
              {/* Content wrapper with enhanced styling */}
              <div className="bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden">
                {activeTab === "basic" && (
                  <div className="animate-slide-in-right">
                    <BasicInfo profile={profile} onUpdate={setProfile} />
                  </div>
                )}
                {activeTab === "security" && (
                  <div className="animate-slide-in-right">
                    <AccountSecurity profile={profile} onUpdate={setProfile} />
                  </div>
                )}
                {activeTab === "details" && (
                  <div className="animate-slide-in-right">
                    <ProfileDetails
                      profile={{
                        bio: profile.bio || '',
                        location: profile.location || '',
                        occupation: profile.occupation || '',
                        interests: profile.interests || ''
                      }}
                      onUpdate={setProfile}
                    />
                  </div>
                )}
                {activeTab === "verification" && (
                  <div className="animate-slide-in-right">
                    <TrustVerification profile={profile} onUpdate={setProfile} />
                  </div>
                )}
                {activeTab === "privacy" && (
                  <div className="animate-slide-in-right">
                    <PrivacySettings profile={profile} onUpdate={setProfile} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
