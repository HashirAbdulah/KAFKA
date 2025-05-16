"use client";

import { useState } from "react";
import { UserProfile } from "../../types";
import apiService from "../../services/apiService";

interface PrivacySettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
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
        "/api/auth/profile/privacy-settings/",
        formData
      );
      onUpdate(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Privacy Settings
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-900 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_email_publicly"
                name="show_email_publicly"
                checked={formData.show_email_publicly}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="show_email_publicly"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Show email address publicly
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_phone_publicly"
                name="show_phone_publicly"
                checked={formData.show_phone_publicly}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="show_phone_publicly"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Show phone number publicly
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  show_email_publicly: profile.show_email_publicly,
                  show_phone_publicly: profile.show_phone_publicly,
                });
              }}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Email Visibility
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {profile.show_email_publicly
                ? "Your email is visible to other users"
                : "Your email is private"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Phone Visibility
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {profile.show_phone_publicly
                ? "Your phone number is visible to other users"
                : "Your phone number is private"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
