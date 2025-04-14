"use client";
import React, { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";
export type PropertyType = {
  id: string;
  title: string;
  price_per_night: number;
  image_url: string;
  is_favourite: boolean;
};

interface PropertyListProps {
  landlord_id?: string | null;
  favourites?: boolean | null;
}

const PropertyList: React.FC<PropertyListProps> = ({ landlord_id, favourites }) => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const markFavourite = (id: string, is_favourite: boolean) => {
    const tmpProperties = properties.map((property: PropertyType)=>{
      if (property.id == id){
        property.is_favourite = is_favourite
        if(is_favourite){
            console.log('Added to list of favourite Properties')
        }else{
          console.log('Removed From List')
        }
      }
      return property;

    })
    setProperties(tmpProperties);
  };
  const getProperties = async () => {
    let url = "/api/properties/";
    if (landlord_id) {
      url += `?landlord_id=${landlord_id}`;
    }else if(favourites){
      url += '?is_favourites=true';
    }
    const tmpProperties = await apiService.get(url);
    setProperties(tmpProperties.properties.map((property: PropertyType)=>{
      if(tmpProperties.favourites.includes(property.id)){
        property.is_favourite = true
      }else{
        property.is_favourite = false
      }
      return property;
    }));
  };

  useEffect(() => {
    getProperties();
  }, []);

  return (
    <>
      {properties.map((property) => (
        <PropertyListItem
        key={property.id}
        property={property}
        markFavourite = {(is_favourite: any) => markFavourite(property.id, is_favourite)}
        /> // Pass property as a prop to PropertyListItem
      ))}
    </>
  );
};

export default PropertyList;
