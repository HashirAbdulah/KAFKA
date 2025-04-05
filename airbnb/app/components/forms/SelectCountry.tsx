"use client";
import Select from "react-select";
import useCountries from "@/app/hooks/useCountries";
import React from "react";

export type SelectCountryValue = {
  label: string;
  value: string;
};

interface SelectCountryProps {
  value?: SelectCountryValue | null;
  onChange: (value: SelectCountryValue) => void;
}

const SelectCountry: React.FC<SelectCountryProps> = ({ value, onChange }) => {
  const { getAll } = useCountries();
  return (
    <>
      <Select
        isClearable
        placeholder="Anywhere"
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as SelectCountryValue)}
      ></Select>
    </>
  );
};

export default SelectCountry;
