"use client";
import { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";
export type PropertyType = {
  id: string;
  title: string;
  price_per_night: number;
  image_url: string;
};
const PropertyList = () => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const getProperties = async () => {
    const tmpProperties = await apiService.get("/api/properties/");
    setProperties(tmpProperties.properties);
  };

  useEffect(() => {
    getProperties();
  }, []);


  return (
    <>
      {properties.map((property) => (
        <PropertyListItem key={property.id} property={property}/> // Pass property as a prop to PropertyListItem
      ))}
    </>
  );
};

export default PropertyList;
