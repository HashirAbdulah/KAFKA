"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Camera, MapPin, Check, X, Sparkles } from "lucide-react";
import { UserProfile } from "../../types";
import apiService from "../../services/apiService";

interface ProfileHeaderProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

export default function ProfileHeader({
  profile,
  onUpdate,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile.profile_image
      ? `${process.env.NEXT_PUBLIC_API_HOST}${profile.profile_image}`
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!profileImage) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("profile_image", profileImage);

      const updatedProfile = await apiService.put(
        "/api/auth/profile/update/",
        formData
      );
      onUpdate(updatedProfile);
      setIsEditing(false);
      setPreviewUrl(
        `${process.env.NEXT_PUBLIC_API_HOST}${updatedProfile.profile_image}`
      );
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    setPreviewUrl(
      profile.profile_image
        ? `${process.env.NEXT_PUBLIC_API_HOST}${profile.profile_image}`
        : null
    );
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5 rounded-3xl p-8 border border-slate-200/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 ease-out">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 via-purple-500/3 to-pink-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg shadow-indigo-500/25 transform group-hover:scale-105 transition-transform duration-500">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={profile.name}
                width={128}
                height={128}
                className="object-cover"
                unoptimized={previewUrl.startsWith("blob:")}
                priority={!previewUrl.startsWith("blob:")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-slate-400" />
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="absolute bottom-0 right-0">
              <label
                htmlFor="profile-image"
                className="cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-3 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-110 transition-all duration-300"
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-3 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-110 transition-all duration-300"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg">
            <Sparkles className="w-2 h-2 text-white m-0.5" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {profile.name}
          </h1>
          <p className="text-slate-500 mt-1">{profile.email}</p>
          {profile.location && (
            <p className="text-slate-500 mt-2 flex items-center justify-center md:justify-start">
              <MapPin className="w-4 h-4 mr-1 text-slate-500" />
              {profile.location}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
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
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !profileImage}
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
        )}
      </div>
    </div>
  );
}
