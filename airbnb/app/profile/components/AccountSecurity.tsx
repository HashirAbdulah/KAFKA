"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "../../types";
import apiService from "../../services/apiService";

interface AccountSecurityProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

interface Session {
  id: string;
  device_info: string;
  last_activity: string;
  is_current?: boolean;
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
      const response = await apiService.post("/api/auth/profile/change-password/", {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      });

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
      const sessions = Object.entries(response).map(([id, data]: [string, any]) => ({
        id,
        device_info: data.device_info,
        last_activity: data.last_activity,
        is_current: id === response.current_session_id,
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
                <input
                  type="password"
                  id="old_password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value,
                    })
                  }
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                <input
                  type="password"
                  id="new_password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            {activeSessions.length > 0 ? (
              activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.device_info}
                      {session.is_current && (
                        <span className="ml-2 text-xs text-indigo-600">
                          (Current Session)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last active:{" "}
                      {new Date(session.last_activity).toLocaleString()}
                    </p>
                  </div>
                  {!session.is_current && (
                    <button
                      onClick={() => handleLogout(session.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Logout
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No active sessions found.</p>
            )}
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
