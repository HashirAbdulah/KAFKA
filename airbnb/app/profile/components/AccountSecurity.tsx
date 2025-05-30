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
  const [loggingOutSessions, setLoggingOutSessions] = useState<Set<string>>(new Set());

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
    if (sessionId) {
      setLoggingOutSessions(prev => new Set(prev.add(sessionId)));
    }

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
      if (sessionId) {
        setLoggingOutSessions(prev => {
          const newSet = new Set(prev);
          newSet.delete(sessionId);
          return newSet;
        });
      }
    }
  };

  const handleLogoutAll = async () => {
    try {
      const sessions = activeSessions.filter((session) => !session.is_current);
      setLoggingOutSessions(new Set(sessions.map(s => s.id)));

      for (const session of sessions) {
        await apiService.post("/api/auth/profile/sessions/logout/", {
          session_id: session.id,
        });
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out all sessions:", error);
      setLoggingOutSessions(new Set());
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const response = await apiService.get("/api/auth/profile/sessions/");
      const { current_session_id, ...sessionsObj } = response;
      setCurrentSessionId(current_session_id || null);
      const sessions = Object.entries(sessionsObj)
        .filter(([id]) => id !== "current_session_id")
        .map(([id, data]: [string, any]) => ({
          id,
          device_info: data.device_info,
          last_activity: data.last_activity,
          is_current: id === current_session_id,
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
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 backdrop-blur-sm">
      <div className="space-y-10">
        {/* Password Change Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H7m8 0v2a2 2 0 01-2 2H9a2 2 0 01-2-2V9m8-2h2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Password Security
              </h2>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Change Password</span>
                </span>
              </button>
            )}
          </div>

          <div className={`transition-all duration-500 ease-in-out ${
            isChangingPassword
              ? 'max-h-screen opacity-100 transform translate-y-0'
              : 'max-h-0 opacity-0 transform -translate-y-4 overflow-hidden'
          }`}>
            {isChangingPassword && (
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl p-6 border border-indigo-100 animate-fadeIn">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
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
                        placeholder="Enter your current password"
                        required
                        className="transition-all duration-200 focus:ring-4 focus:ring-purple-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
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
                        placeholder="Create a strong new password"
                        required
                        className="transition-all duration-200 focus:ring-4 focus:ring-purple-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
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
                        placeholder="Confirm your new password"
                        required
                        className="transition-all duration-200 focus:ring-4 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl animate-slideDown">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-red-700">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl animate-slideDown">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-green-700">{success}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 pt-4">
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
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <span className="flex items-center space-x-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating...</span>
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Active Sessions Section */}
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Active Sessions
            </h2>
          </div>

          <div className="space-y-4">
            {(() => {
              if (!activeSessions.length)
                return (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No active sessions found</p>
                  </div>
                );

              const current = activeSessions.find((s) => s.is_current);
              const previous = activeSessions
                .filter((s) => !s.is_current)
                .sort(
                  (a, b) =>
                    new Date(b.last_activity).getTime() -
                    new Date(a.last_activity).getTime()
                )[0];

              return (
                <div className="space-y-4">
                  {current && (
                    <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-lg font-bold text-gray-900">{current.device_info}</p>
                              </div>
                              <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                                CURRENT SESSION
                              </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Last active: {new Date(current.last_activity).toLocaleString()}</span>
                              </div>
                              {current.location && (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>Location: {current.location}</span>
                                </div>
                              )}
                              {current.browser && (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3" />
                                  </svg>
                                  <span>Browser: {current.browser}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previous && (
                    <div className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                              <p className="text-lg font-bold text-gray-900">{previous.device_info}</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              Previous Session
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Last active: {new Date(previous.last_activity).toLocaleString()}</span>
                            </div>
                            {previous.location && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Location: {previous.location}</span>
                              </div>
                            )}
                            {previous.browser && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3" />
                                </svg>
                                <span>Browser: {previous.browser}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleLogout(previous.id)}
                          disabled={loggingOutSessions.has(previous.id)}
                          className="ml-4 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 hover:text-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loggingOutSessions.has(previous.id) ? (
                            <span className="flex items-center space-x-2">
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Logging out...</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span>Logout</span>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {activeSessions.length > 1 && (
                    <div className="pt-4">
                      <button
                        onClick={handleLogoutAll}
                        disabled={loggingOutSessions.size > 0}
                        className="w-full px-6 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-semibold hover:bg-red-100 hover:border-red-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loggingOutSessions.size > 0 ? (
                          <span className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Logging out all sessions...</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout All Other Sessions</span>
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
