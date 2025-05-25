'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import apiService from "../services/apiService";
import Link from "next/link";

const Reservations = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await apiService.get("/api/auth/reservations/");
        setReservations(data || []);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Error loading reservations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const PageTitle = () => (
    <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-10">
      My Reservations
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
            <p className="text-gray-500 text-base animate-bounce">Loading your reservations...</p>
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
          {reservations.length > 0 ? (
            reservations.map((reservation: any, index: number) => (
              <div
                key={reservation.id}
                className="bg-white p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 rounded-2xl border border-gray-200 shadow hover:shadow-md transition-all duration-300 hover:border-purple-300"
              >
                <div className="col-span-1 relative">
                  <div className="relative overflow-hidden aspect-square rounded-xl shadow">
                    {reservation.property.primary_image_url ? (
                      <Image
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={reservation.property.primary_image_url}
                        fill
                        className="object-cover transition-transform duration-300 ease-out hover:scale-105"
                        alt={reservation.property.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
                        <span className="text-gray-500 text-sm">No image available</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 space-y-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    {reservation.property.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium text-gray-700">Check in:</span>{" "}
                        {new Date(reservation.start_date).getDate()}/
                        {new Date(reservation.start_date).getMonth() + 1}/
                        {new Date(reservation.start_date).getFullYear()}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Check out:</span>{" "}
                        {new Date(reservation.end_date).getDate()}/
                        {new Date(reservation.end_date).getMonth() + 1}/
                        {new Date(reservation.end_date).getFullYear()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p>
                        <span className="font-medium text-gray-700">Nights:</span>{" "}
                        {reservation.number_of_nights}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Total Price:</span>{" "}
                        <span className="text-base font-bold text-gray-800">
                          ${reservation.total_price.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/properties/${reservation.property.id}`}
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white rounded-xl bg-purple-600 hover:bg-purple-700 transition"
                    >
                      View Property
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow border border-gray-100 max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">No reservations yet</p>
                <p className="text-gray-500">Start exploring amazing properties to book your first stay!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Reservations;
