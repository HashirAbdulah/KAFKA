"use client";

import { useState, useEffect } from "react";
import PropertyList from "../components/properties/PropertyList";
import { getUserId } from "@/app/lib/action";
import apiService from "@/app/services/apiService";

const MyFavouritesPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favourites, setFavourites] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentUserId = await getUserId();
        setUserId(currentUserId);

        if (currentUserId) {
          const response = await apiService.get(
            "/api/properties/?is_favourites=true"
          );
          setFavourites(response.properties || []);
        }
      } catch (err) {
        console.error("Error fetching favourites:", err);
        setError("Error loading favourites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const PageTitle = () => (
    <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-10">
      My Favourites
    </h1>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <PageTitle />
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-gray-500 text-base animate-bounce">
              Loading your favourites...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <PageTitle />
          <div className="text-center py-16">
            <div className="bg-red-100 border border-red-300 rounded-xl p-8 inline-block shadow-md">
              <p className="text-base text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <PageTitle />
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow border border-gray-100 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Authentication Required
              </p>
              <p className="text-gray-500">
                Please log in to view your favourites.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <PageTitle />

        <div className="space-y-6">
          {favourites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PropertyList favourites={true} />
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow border border-gray-100 max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No favourites yet
                </p>
                <p className="text-gray-500">
                  Start exploring properties and add them to your favourites!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyFavouritesPage;
