"use client";
import { useState } from "react";
import {
  User,
  MapPin,
  Briefcase,
  Heart,
  Edit3,
  Check,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import apiService from "../../services/apiService";
import { eventService, EventTypes } from "../../services/eventService";

// Mock types and services for demo
const UserProfile = {
  bio: "Passionate developer with a love for creating beautiful user experiences. Always learning and exploring new technologies.",
  location: "San Francisco, CA",
  occupation: "Senior Frontend Developer",
  interests: "React, TypeScript, Design Systems, Photography",
};

interface ProfileDetailsProps {
  profile: {
    bio: string | null;
    location: string | null;
    occupation: string | null;
    interests: string | null;
  };
  onUpdate: (profile: any) => void;
}

export default function ProfileDetails({
  profile,
  onUpdate,
}: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    location: profile.location || "",
    occupation: profile.occupation || "",
    interests: profile.interests || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedProfile = await apiService.put(
        "/api/auth/profile/update/",
        formData
      );
      onUpdate(updatedProfile);
      setIsEditing(false);

      // Emit profile updated event
      eventService.emit(EventTypes.PROFILE_UPDATED, updatedProfile);
    } catch (error) {
      console.error("Error updating profile details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      bio: profile.bio || "",
      location: profile.location || "",
      occupation: profile.occupation || "",
      interests: profile.interests || "",
    });
  };

  type FormField = "bio" | "location" | "occupation" | "interests";

  const fieldConfigs: Array<{
    key: FormField;
    label: string;
    icon: any;
    placeholder: string;
    type: "textarea" | "input";
    gradient: string;
    shadowColor: string;
    description: string;
  }> = [
    {
      key: "bio",
      label: "Bio",
      icon: FileText,
      placeholder: "Tell us about yourself...",
      type: "textarea",
      gradient: "from-violet-500 to-purple-600",
      shadowColor: "violet-500/20",
      description: "Share your story and what makes you unique",
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      placeholder: "Your current location",
      type: "input",
      gradient: "from-rose-500 to-pink-600",
      shadowColor: "rose-500/20",
      description: "Where are you based?",
    },
    {
      key: "occupation",
      label: "Occupation",
      icon: Briefcase,
      placeholder: "What do you do?",
      type: "input",
      gradient: "from-blue-500 to-cyan-600",
      shadowColor: "blue-500/20",
      description: "Your current role or profession",
    },
    {
      key: "interests",
      label: "Interests",
      icon: Heart,
      placeholder: "Your interests and hobbies",
      type: "input",
      gradient: "from-emerald-500 to-teal-600",
      shadowColor: "emerald-500/20",
      description: "What are you passionate about?",
    },
  ];

  return (
    <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5 rounded-3xl p-8 border border-slate-200/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 ease-out">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 via-purple-500/3 to-pink-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Header */}
      <div className="relative flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 transform group-hover:scale-110 transition-transform duration-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg">
              <Sparkles className="w-2 h-2 text-white m-0.5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Profile Details
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Share more about yourself
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="group/btn relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <Edit3 className="w-4 h-4 transform group-hover/btn:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Edit</span>
            </div>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {fieldConfigs.map((field) => {
              const IconComponent = field.icon;
              return (
                <div
                  key={field.key}
                  className="group/field relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${field.gradient} rounded-xl flex items-center justify-center shadow-md shadow-${field.shadowColor} transform group-hover/field:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor={field.key}
                        className="block text-lg font-semibold text-slate-800 mb-2"
                      >
                        {field.label}
                      </label>
                      <p className="text-sm text-slate-500 mb-4">
                        {field.description}
                      </p>

                      {field.type === "textarea" ? (
                        <textarea
                          id={field.key}
                          name={field.key}
                          rows={4}
                          value={formData[field.key]}
                          onChange={handleChange}
                          className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-inner focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 resize-none text-slate-700 placeholder-slate-400"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type="text"
                          id={field.key}
                          name={field.key}
                          value={formData[field.key]}
                          onChange={handleChange}
                          className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-inner focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-slate-700 placeholder-slate-400"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="group/cancel px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl text-slate-700 font-medium hover:bg-white hover:border-slate-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center space-x-2">
                <X className="w-4 h-4 transform group-hover/cancel:rotate-90 transition-transform duration-300" />
                <span>Cancel</span>
              </div>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="group/save relative px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover/save:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="font-medium">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 transform group-hover/save:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Save Changes</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {fieldConfigs.map((field) => {
            const IconComponent = field.icon;
            const fieldValue = profile[field.key];

            if (!fieldValue) return null;

            return (
              <div
                key={field.key}
                className="group/display p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${field.gradient} rounded-xl flex items-center justify-center shadow-md shadow-${field.shadowColor} transform group-hover/display:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {field.label}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {fieldValue}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {!profile.bio &&
            !profile.location &&
            !profile.occupation &&
            !profile.interests && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-slate-500 mb-6">
                  Add some details to help others get to know you better
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
