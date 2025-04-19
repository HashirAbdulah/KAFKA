"use client";
import React, { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";
import useSearchModal from "@/app/hooks/useSearchModal";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
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

const PropertyList: React.FC<PropertyListProps> = ({
  landlord_id,
  favourites,
}) => {
  const searchModal = useSearchModal();
  const searchParams = useSearchParams();
  const country = searchModal.query.country;
  const numGuests = searchModal.query.guests;
  const numBathrooms = searchModal.query.bathrooms;
  const numBedrooms = searchModal.query.bedrooms;
  const checkinDate = searchModal.query.checkIn;
  const checkoutDate = searchModal.query.checkOut;
  const category = searchModal.query.category;

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const markFavourite = (id: string, is_favourite: boolean) => {
    const tmpProperties = properties.map((property: PropertyType) => {
      if (property.id == id) {
        property.is_favourite = is_favourite;
        if (is_favourite) {
          console.log("Added to list of favourite Properties");
        } else {
          console.log("Removed From List");
        }
      }
      return property;
    });
    setProperties(tmpProperties);
  };
  const getProperties = async () => {
    let url = "/api/properties/";
    if (landlord_id) {
      url += `?landlord_id=${landlord_id}`;
    } else if (favourites) {
      url += "?is_favourites=true";
    } else {
      let urlQuery = "";
      if (country) {
        urlQuery += "&country=" + country;
      }
      if (numGuests) {
        urlQuery += "&numGuests=" + numGuests;
      }
      if (numBathrooms) {
        urlQuery += "&numBathrooms=" + numBathrooms;
      }
      if (numBedrooms) {
        urlQuery += "&numBedrooms=" + numBedrooms;
      }
      if (category) {
        urlQuery += "&category=" + category;
      }

      if (checkinDate) {
        urlQuery += "&checkin=" + format(checkinDate, "yyyy-MM-dd");
      }
      if (checkoutDate) {
        urlQuery += "&checkout=" + format(checkoutDate, "yyyy-MM-dd");
      }
      if (urlQuery.length) {
        // console.log("Query:", urlQuery);
        urlQuery = "?" + urlQuery.substring(1);
        url += urlQuery;
      }
    }

    const tmpProperties = await apiService.get(url);
    setProperties(
      tmpProperties.properties.map((property: PropertyType) => {
        if (tmpProperties.favourites.includes(property.id)) {
          property.is_favourite = true;
        } else {
          property.is_favourite = false;
        }
        return property;
      })
    );
  };

  useEffect(() => {
    getProperties();
  }, [category, searchModal.query, searchParams]);

  return (
    <>
      {properties.map((property) => (
        <PropertyListItem
          key={property.id}
          property={property}
          markFavourite={(is_favourite: any) =>
            markFavourite(property.id, is_favourite)
          }
        /> // Pass property as a prop to PropertyListItem
      ))}
    </>
  );
};

export default PropertyList;
