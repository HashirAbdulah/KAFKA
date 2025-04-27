"use client";
import { useState, useEffect } from "react";
import { Range } from "react-date-range";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import apiService from "@/app/services/apiService";
import useLoginModal from "@/app/hooks/useLoginModal";
import DatePicker from "../forms/Calender";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

export type Property = {
  id: string;
  price_per_night: number;
  guests: number;
};

interface ReservationSidebarProps {
  userId: string | null;
  property: Property;
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
  property,
  userId,
}) => {
  const loginModal = useLoginModal();
  const [fee, setFee] = useState<number>(0);
  const [nights, setNights] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [guests, setGuests] = useState<string>("1");
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const guestsRange = Array.from(
    { length: property.guests },
    (_, index) => index + 1
  );

  const getReservations = async () => {
    try {
      const response = await apiService.get(
        `/api/properties/${property.id}/reservations/`
      );

      // Ensure the response is an array
      const reservations = response.data; // Assuming response.data is an array

      let dates: Date[] = [];
      if (Array.isArray(reservations)) {
        reservations.forEach((reservation: any) => {
          const range = eachDayOfInterval({
            start: new Date(reservation.start_date),
            end: new Date(reservation.end_date),
          });
          dates = [...dates, ...range];
        });
        setBookedDates(dates);
      } else {
        console.error(
          "Expected an array of reservations, but got:",
          reservations
        );
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // Load reservations when component mounts
  useEffect(() => {
    getReservations();
  }, [property.id]);

  const performBooking = async () => {
    if (userId) {
      if (dateRange.startDate && dateRange.endDate) {
        setIsBooking(true);

        // Debug logs
        console.log("Booking details:", {
          pricePerNight: property.price_per_night,
          nights,
          fee,
          serviceFee:
            property.price_per_night * nights * kafkaServiceFeePercentage,
          totalPrice,
        });

        const requestData = {
          guests: parseInt(guests),
          start_date: format(dateRange.startDate, "yyyy-MM-dd"),
          end_date: format(dateRange.endDate, "yyyy-MM-dd"),
          number_of_nights: nights,
          total_price: totalPrice,
          guest_id: userId,
        };

        console.log("Sending booking data:", requestData);

        try {
          const response = await apiService.post(
            `/api/properties/${property.id}/book/`,
            requestData
          );

          setIsBooking(false);

          if (response.success) {
            console.log("Booking successful");
            // You could add a success notification here
            // Reset calendar or show success message

            // Refresh booked dates
            getReservations();
          } else {
            console.log("Something went wrong...", response.error);
            // You could add an error notification here
          }
        } catch (error) {
          setIsBooking(false);
          console.error("Booking error:", error);
        }
      }
    } else {
      loginModal.open();
    }
  };

  // Component to set calendar Dates
  const _setDateRange = (selection: any) => {
    const newStartDate = new Date(selection.startDate);
    const newEndDate = new Date(selection.endDate);
    if (newEndDate <= newStartDate) {
      newEndDate.setDate(newStartDate.getDate() + 1);
    }
    setDateRange({
      ...dateRange,
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  const kafkaServiceFeePercentage = 0.05;

  // Calculate total price when nights or fee change
  useEffect(() => {
    // Calculate the base price (price per night * number of nights)
    const basePrice = property.price_per_night * nights;

    // Calculate the Kafka service fee (5% of the base price)
    const serviceFee = basePrice * kafkaServiceFeePercentage;

    // Calculate the total price including the service fee
    const total = basePrice + serviceFee + fee; // Add any other fees, like cleaning fee

    console.log("Price calculation:", {
      basePrice,
      serviceFee,
      cleaningFee: fee,
      total,
    });
    setTotalPrice(total);
  }, [nights, fee, property.price_per_night]);

  // Calculate nights and fee when date range changes
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

      if (dayCount > 0) {
        // Calculate cleaning fee (5% of total night cost)
        const _fee = ((dayCount * property.price_per_night) / 100) * 5;

        // Update the fee and nights states
        setFee(_fee);
        setNights(dayCount);

        console.log("Date range calculation:", {
          dayCount,
          pricePerNight: property.price_per_night,
          cleaningFee: _fee,
        });
      } else {
        // Handle same day booking (1 night minimum)
        const _fee = ((1 * property.price_per_night) / 100) * 5;
        setFee(_fee);
        setNights(1);
      }
    }
  }, [dateRange, property.price_per_night]);

  return (
    <aside className="mt-4 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
      <h2 className="mb-5 text-2xl">${property.price_per_night} Per Night</h2>
      <div className="w-full mb-6">
        <DatePicker
          value={dateRange}
          bookedDates={bookedDates}
          onChange={(value) => _setDateRange(value.selection)}
        />
      </div>

      {/* guests option div */}
      <div className="mb-6 p-3 border border-gray-400 rounded-xl">
        <label htmlFor="guests" className="mb-1 block font-bold text-xs">
          Guests
        </label>
        <select
          className="w-full -ml-1 text-xs"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          id="guests"
        >
          {guestsRange.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>

      {/* book button */}
      <div
        onClick={!isBooking ? performBooking : undefined}
        className={`cursor-pointer w-full mb-4 py-4 text-center text-white bg-airbnb rounded-xl
        transition duration-300 ease-in-out transform hover:bg-airbnb-dark hover:scale-102
        ${isBooking ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isBooking ? "Booking..." : "Book"}
      </div>

      {/* per night price */}
      <div className="mb-4 flex align-center justify-between">
        <p>
          ${property.price_per_night} * {nights} nights
        </p>
        <p>${property.price_per_night * nights}</p>
      </div>

      {/* Cleaning fee */}
      <div className="mb-4 flex align-center justify-between">
        <p>Cleaning Fee</p>
        <p>${fee.toFixed(2)}</p>
      </div>

      {/* kafka service fee */}
      <div className="mb-4 flex align-center justify-between">
        <p>Kafka service fee</p>
        <p>
          $
          {(
            property.price_per_night *
            nights *
            kafkaServiceFeePercentage
          ).toFixed(2)}
        </p>
      </div>

      <hr className="border-1 border-gray-500 my-2" />

      {/* total price */}
      <div className="mb-4 flex align-center justify-between font-bold">
        <p>Total</p>
        <p>${totalPrice.toFixed(2)}</p>
      </div>
    </aside>
  );
};

export default ReservationSidebar;
