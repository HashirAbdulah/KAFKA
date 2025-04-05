"use client";
import React from "react";
import { Range } from "react-date-range";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
// import DatePicker from "../forms/Calendar";
const ReservationSidebar = () => {
  return (
    <aside className="mt-4 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
      <h2 className="mb-5 text-2xl">$12 Per Night</h2>
      {/* guests option div */}
      <div className="mb-6 p-3 border border-gray-400 rounded-xl">
        <label htmlFor="guests" className="mb-1 block font-bold text-xs">
          Guests
        </label>
        <select className="w-full -ml-1 text-xs">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      {/* book button */}
      <div
        className="cursor-pointer w-full mb-4 py-4 text-center text-white bg-airbnb rounded-xl
        transition duration-300 ease-in-out transform hover:bg-airbnb-dark hover:scale-102">
          Book
      </div>

      {/* per night price */}
      <div className="mb-4 flex align-center justify-between ">
        <p>
          $12 * 4 nights
        </p>
        <p>$48</p>
      </div>

      {/* Cleaning fee */}
      <div className="mb-4 flex align-center justify-between ">
        <p>Cleaning Fee</p>
        {/* <p>${fee.toFixed(2)}</p> */}
        <p>$2</p>
      </div>

    {/* kafka servive fee */}
    <div className="mb-4 flex align-center justify-between ">
        <p>Airbnb service fee</p>
        <p>
          $0.5
          {/* {(
            property.price_per_night *
            nights *
            airbnbServiceFeePercentage
          ).toFixed(2)} */}
        </p>
      </div>

      <hr className="border-1 border-gray-500 my-2" />
      
      {/* total price */}
      <div className="mb-4 flex align-center justify-between font-bold">
        <p>Total</p>
        <p>$100</p>
      </div>

    </aside>
  );
};

export default ReservationSidebar;
