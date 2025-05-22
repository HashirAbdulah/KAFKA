"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "../../types";
import apiService from "../../services/apiService";
import PasswordInput from "../../components/ui/PasswordInput";

interface AccountSecurityProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

interface Session {
  id: string;
  device_info: string;
  last_activity: string;
  is_current?: boolean;
  location?: string;
  browser?: string;
}

export default function AccountSecurity({
  profile,
  onUpdate,
}: AccountSecurityProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.post(
        "/api/auth/profile/change-password/",
        {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }
      );

      if (response.message) {
        setSuccess(response.message);
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
        setIsChangingPassword(false);
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.response?.data?.old_password) {
        setError(error.response.data.old_password);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (sessionId?: string) => {
    try {
      if (sessionId) {
        await apiService.post("/api/auth/profile/sessions/logout/", {
          session_id: sessionId,
        });
      } else {
        await apiService.post("/api/auth/logout/", {});
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogoutAll = async () => {
    try {
      // Logout from all sessions except current
      const sessions = activeSessions.filter((session) => !session.is_current);
      for (const session of sessions) {
        await apiService.post("/api/auth/profile/sessions/logout/", {
          session_id: session.id,
        });
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out all sessions:", error);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const response = await apiService.get("/api/auth/profile/sessions/");
      // response is a dict of session_id: { device_info, last_activity, ... }, and possibly current_session_id
      const { current_session_id, ...sessionsObj } = response;
      setCurrentSessionId(current_session_id || null);
      const sessions = Object.entries(sessionsObj)
        .filter(([id]) => id !== "current_session_id")
        .map(([id, data]: [string, any]) => ({
          id,
          device_info: data.device_info,
          last_activity: data.last_activity,
          is_current: id === current_session_id,
          // Add more fields if available (location, browser, etc)
          ...data,
        }));
      setActiveSessions(sessions);
    } catch (error) {
      console.error("Error fetching active sessions:", error);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Change Password
          </h2>
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="mt-2 text-indigo-600 hover:text-indigo-900 transition-colors"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="old_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <PasswordInput
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value,
                    })
                  }
                  placeholder="Current Password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <PasswordInput
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  placeholder="New Password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <PasswordInput
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                  placeholder="Confirm New Password"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {success && <p className="text-sm text-green-600">{success}</p>}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      old_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Active Sessions
          </h2>
          <div className="mt-4 space-y-4">
            {(() => {
              if (!activeSessions.length)
                return (
                  <p className="text-sm text-gray-500">
                    No active sessions found.
                  </p>
                );
              // Find current session
              const current = activeSessions.find((s) => s.is_current);
              // Find most recent previous session (not current), sorted by last_activity desc
              const previous = activeSessions
                .filter((s) => !s.is_current)
                .sort(
                  (a, b) =>
                    new Date(b.last_activity).getTime() -
                    new Date(a.last_activity).getTime()
                )[0];
              return (
                <>
                  {current && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-indigo-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {current.device_info}
                          <span className="ml-2 text-xs text-indigo-600">
                            (Current Session)
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Last active:{" "}
                          {new Date(current.last_activity).toLocaleString()}
                        </p>
                        {current.location && (
                          <p className="text-sm text-gray-500">
                            Location: {current.location}
                          </p>
                        )}
                        {current.browser && (
                          <p className="text-sm text-gray-500">
                            Browser: {current.browser}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {previous && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {previous.device_info}
                          <span className="ml-2 text-xs text-gray-400">
                            (Previous Session)
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Last active:{" "}
                          {new Date(previous.last_activity).toLocaleString()}
                        </p>
                        {previous.location && (
                          <p className="text-sm text-gray-500">
                            Location: {previous.location}
                          </p>
                        )}
                        {previous.browser && (
                          <p className="text-sm text-gray-500">
                            Browser: {previous.browser}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleLogout(previous.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
            {/* Optionally, keep the logout all button if more than 1 session */}
            {activeSessions.length > 1 && (
              <button
                onClick={handleLogoutAll}
                className="text-sm text-red-600 hover:text-red-900"
              >
                Logout All Other Sessions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
