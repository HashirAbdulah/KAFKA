"use client";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Shield,
  Edit3,
  Check,
  X,
  Lock,
} from "lucide-react";
import apiService from "../../services/apiService";
import { eventService, EventTypes } from "../../services/eventService";

// Mock types and services for demo
const UserProfile = {
  show_email_publicly: false,
  show_phone_publicly: false,
};

interface PrivacySettingsProps {
  profile: {
    show_email_publicly: boolean;
    show_phone_publicly: boolean;
  };
  onUpdate: (profile: any) => void;
}

export default function PrivacySettings({
  profile,
  onUpdate,
}: PrivacySettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    show_email_publicly: profile.show_email_publicly,
    show_phone_publicly: profile.show_phone_publicly,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
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

      // Emit settings updated event
      eventService.emit(EventTypes.SETTINGS_UPDATED, updatedProfile);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      show_email_publicly: profile.show_email_publicly,
      show_phone_publicly: profile.show_phone_publicly,
    });
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5 rounded-3xl p-8 border border-slate-200/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 ease-out">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Header */}
      <div className="relative flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 transform group-hover:scale-110 transition-transform duration-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Privacy Settings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Control your information visibility
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
        <div onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Email Privacy Setting */}
            <div className="group/item relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <label
                      htmlFor="show_email_publicly"
                      className="block text-lg font-semibold text-slate-800 cursor-pointer"
                    >
                      Email Visibility
                    </label>
                    <p className="text-sm text-slate-500 mt-1">
                      Allow others to see your email address
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="checkbox"
                    id="show_email_publicly"
                    name="show_email_publicly"
                    checked={formData.show_email_publicly}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="show_email_publicly"
                    className="relative flex items-center justify-center w-16 h-8 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300/30 rounded-full cursor-pointer transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600 shadow-inner peer-checked:shadow-lg peer-checked:shadow-indigo-500/20"
                  >
                    <div className="w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 peer-checked:translate-x-4 peer-checked:scale-110 flex items-center justify-center">
                      {formData.show_email_publicly ? (
                        <Eye className="w-3 h-3 text-indigo-600" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Phone Privacy Setting */}
            <div className="group/item relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <label
                      htmlFor="show_phone_publicly"
                      className="block text-lg font-semibold text-slate-800 cursor-pointer"
                    >
                      Phone Visibility
                    </label>
                    <p className="text-sm text-slate-500 mt-1">
                      Allow others to see your phone number
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="checkbox"
                    id="show_phone_publicly"
                    name="show_phone_publicly"
                    checked={formData.show_phone_publicly}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="show_phone_publicly"
                    className="relative flex items-center justify-center w-16 h-8 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300/30 rounded-full cursor-pointer transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600 shadow-inner peer-checked:shadow-lg peer-checked:shadow-indigo-500/20"
                  >
                    <div className="w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 peer-checked:translate-x-4 peer-checked:scale-110 flex items-center justify-center">
                      {formData.show_phone_publicly ? (
                        <Eye className="w-3 h-3 text-indigo-600" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
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
              onClick={handleSubmit}
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
        </div>
      ) : (
        <div className="space-y-6">
          {/* Email Status */}
          <div className="group/status p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Email Visibility
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {profile.show_email_publicly
                      ? "Your email is visible to other users"
                      : "Your email is private"}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  profile.show_email_publicly
                    ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200"
                }`}
              >
                {profile.show_email_publicly ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {profile.show_email_publicly ? "Public" : "Private"}
                </span>
              </div>
            </div>
          </div>

          {/* Phone Status */}
          <div className="group/status p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-white/90 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Phone Visibility
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {profile.show_phone_publicly
                      ? "Your phone number is visible to other users"
                      : "Your phone number is private"}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  profile.show_phone_publicly
                    ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200"
                }`}
              >
                {profile.show_phone_publicly ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {profile.show_phone_publicly ? "Public" : "Private"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
