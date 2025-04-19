"use client";
import Modal from "./Modal";
import useSearchModal, { SearchQuery } from "@/app/hooks/useSearchModal";
import { useState } from "react";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";
import CustomButton from "../forms/CustomButton";
import { Range } from "react-date-range";
import DatePicker from "../forms/Calender";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const SearchModal = () => {
  let content = <></>;
  const searchModal = useSearchModal();
  const [numGuests, setnumGuests] = useState<string>("1");
  const [numBedrooms, setnumBedrooms] = useState<string>("1");
  const [country, setCountry] = useState<SelectCountryValue>();
  const [numBathrooms, setnumBathrooms] = useState<string>("1");
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const closeAndSearch = () => {
    const newSearchQuery: SearchQuery = {
      country: country?.label,
      checkIn: dateRange.startDate,
      checkOut: dateRange.endDate,
      guests: parseInt(numGuests),
      bedrooms: parseInt(numBedrooms),
      bathrooms: parseInt(numBathrooms),
      // category: "",
      category: searchModal.query.category, // Preserve existing category
    };
    searchModal.setQuery(newSearchQuery);
    searchModal.close();
  };

  const _setDateRange = (selection: Range) => {
    if (searchModal.step == "checkin") {
      searchModal.open("checkout");
    } else if (searchModal.step === "checkout") {
      searchModal.open("details");
    }
    setDateRange(selection);
  };

  const contentLocation = (
    <>
      <h2 className="mb-6 text-2xl">Choose Location</h2>
      <SelectCountry
        value={country}
        onChange={(value) => setCountry(value as SelectCountryValue)}
      />

      <div className="mt-6 flex flex-row gap-4">
        <CustomButton
          label="Check In Date"
          onClick={() => searchModal.open("checkin")}
        />
      </div>
    </>
  );

  const contentCheckin = (
    <>
      <h2 className="mb-6 text-2xl">Checkin</h2>
      <DatePicker
        value={dateRange}
        onChange={(value) => _setDateRange(value.selection)}
      />
      <div className="mt-6 flex flex-row gap-4">
        <CustomButton
          label="Previous(Location)"
          onClick={() => searchModal.open("location")}
        />
        <CustomButton
          label="Check Out Date(Next)"
          onClick={() => searchModal.open("checkout")}
        />
      </div>
    </>
  );

  const contentCheckout = (
    <>
      <h2 className="mb-6 text-2xl">Checkout</h2>
      <DatePicker
        value={dateRange}
        onChange={(value) => _setDateRange(value.selection)}
      />
      <div className="mt-6 flex flex-row gap-4">
        <CustomButton
          label="Previous(Checkin Date)"
          onClick={() => searchModal.open("checkin")}
        />
        <CustomButton
          label="Details(Next)"
          onClick={() => searchModal.open("details")}
        />
      </div>
    </>
  );

  const contentDetails = (
    <>
      <h2 className="mb-6 text-2xl">Details</h2>
      <div className="space-y-4">
        <div className="space-y-4">
          <label htmlFor="">Numbers of Guests:</label>
          <input
            type="number"
            min="1"
            value={numGuests}
            placeholder="Numbers of Guests:"
            className="w-full h-14 px-4 border border-gray-300 rounded-xl"
            onChange={(e) => setnumGuests(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="">Numbers of BedRooms:</label>
          <input
            type="number"
            min="1"
            value={numBedrooms}
            placeholder="Numbers of Bedrooms"
            className="w-full h-14 px-4 border border-gray-300 rounded-xl"
            onChange={(e) => setnumBedrooms(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="">Numbers of BathRooms</label>
          <input
            type="number"
            min="1"
            value={numBathrooms}
            placeholder="Numbers of Bathrooms"
            className="w-full h-14 px-4 border border-gray-300 rounded-xl"
            onChange={(e) => setnumBathrooms(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-row gap-4">
        <CustomButton
          label="Previous(CheckOut Date)"
          onClick={() => searchModal.open("checkout")}
        />
        <CustomButton label="Search" onClick={closeAndSearch} />
      </div>
    </>
  );

  if (searchModal.step == "location") {
    content = contentLocation;
  } else if (searchModal.step == "checkin") {
    content = contentCheckin;
  } else if (searchModal.step == "checkout") {
    content = contentCheckout;
  } else if (searchModal.step == "details") {
    content = contentDetails;
  }

  return (
    <>
      <Modal
        label="Search"
        content={content}
        close={searchModal.close}
        isOpen={searchModal.isOpen}
      />
    </>
  );
};

export default SearchModal;
