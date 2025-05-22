// "use client";
// import React, { useEffect, useState } from "react";
// import PropertyListItem from "./PropertyListItem";
// import PropertyCardSkeleton from "./PropertyCardSkeleton";
// import apiService from "@/app/services/apiService";
// import useSearchModal from "@/app/hooks/useSearchModal";
// import { format } from "date-fns";
// import { useSearchParams } from "next/navigation";
// import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";

// export type PropertyType = {
//   id: string;
//   title: string;
//   description: string;
//   price_per_night: number;
//   image_url: string;
//   is_favourite: boolean;
//   category: string;
//   country: string;
//   country_code: string;
//   bedrooms: number;
//   bathrooms: number;
//   guests: number;
//   landlord_id: string;
// };

// interface PropertyListProps {
//   landlord_id?: string | null;
//   favourites?: boolean | null;
// }

// const ITEMS_PER_PAGE = 10;

// const PropertyList: React.FC<PropertyListProps> = ({
//   landlord_id,
//   favourites,
// }) => {
//   const searchModal = useSearchModal();
//   const searchParams = useSearchParams();
//   const country = searchModal.query.country;
//   const numGuests = searchModal.query.guests;
//   const numBathrooms = searchModal.query.bathrooms;
//   const numBedrooms = searchModal.query.bedrooms;
//   const checkinDate = searchModal.query.checkIn;
//   const checkoutDate = searchModal.query.checkOut;
//   const category = searchModal.query.category;

//   const [properties, setProperties] = useState<PropertyType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const buildUrl = (pageNum: number) => {
//     let url = `/api/properties/?page=${pageNum}&limit=${ITEMS_PER_PAGE}`;
//     if (landlord_id) {
//       url += `&landlord_id=${landlord_id}`;
//     } else if (favourites) {
//       url += "&is_favourites=true";
//     } else {
//       let urlQuery = "";
//       if (country) urlQuery += "&country=" + country;
//       if (numGuests) urlQuery += "&numGuests=" + numGuests;
//       if (numBathrooms) urlQuery += "&numBathrooms=" + numBathrooms;
//       if (numBedrooms) urlQuery += "&numBedrooms=" + numBedrooms;
//       if (category) urlQuery += "&category=" + category;
//       if (checkinDate)
//         urlQuery += "&checkin=" + format(checkinDate, "yyyy-MM-dd");
//       if (checkoutDate)
//         urlQuery += "&checkout=" + format(checkoutDate, "yyyy-MM-dd");
//       url += urlQuery;
//     }
//     return url;
//   };

//   const fetchProperties = async (pageNum: number) => {
//     try {
//       setLoading(true);
//       const response = await apiService.get(buildUrl(pageNum));
//       const newProperties = response.properties.map(
//         (property: PropertyType) => ({
//           ...property,
//           is_favourite: response.favourites.includes(property.id),
//         })
//       );

//       if (pageNum === 1) {
//         setProperties(newProperties);
//       } else {
//         setProperties((prev) => [...prev, ...newProperties]);
//       }

//       setHasMore(newProperties.length === ITEMS_PER_PAGE);
//       setError(null);
//     } catch (err) {
//       setError(err as Error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMore = () => {
//     if (!loading && hasMore) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const { lastElementRef } = useInfiniteScroll({
//     onLoadMore: loadMore,
//     hasMore,
//     loading,
//   });

//   useEffect(() => {
//     setPage(1);
//     setProperties([]);
//     setHasMore(true);
//     fetchProperties(1);
//   }, [category, searchModal.query, searchParams]);

//   useEffect(() => {
//     if (page > 1) {
//       fetchProperties(page);
//     }
//   }, [page]);

//   const markFavourite = (id: string, is_favourite: boolean) => {
//     setProperties((prev) =>
//       prev.map((property) =>
//         property.id === id ? { ...property, is_favourite } : property
//       )
//     );
//   };

//   if (error) {
//     return (
//       <div className="text-red-500 p-4 text-center">
//         Error loading properties: {error.message}
//       </div>
//     );
//   }

//   return (
//     <>
//       {properties.map((property, index) => (
//         <div
//           key={property.id}
//           ref={index === properties.length - 1 ? lastElementRef : undefined}
//         >
//           <PropertyListItem
//             property={property}
//             markFavourite={(is_favourite: boolean) =>
//               markFavourite(property.id, is_favourite)
//             }
//           />
//         </div>
//       ))}
//       {loading && (
//         <>
//           <PropertyCardSkeleton />
//           <PropertyCardSkeleton />
//           <PropertyCardSkeleton />
//         </>
//       )}
//     </>
//   );
// };

// export default PropertyList;
"use client";
import React, { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import apiService from "@/app/services/apiService";
import useSearchModal from "@/app/hooks/useSearchModal";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { PropertyType } from "@/app/types";

// Extended type for PropertyList with additional fields not in the main PropertyType
export type PropertyListType = PropertyType & {
  is_favourite: boolean;
  landlord_id: string;
};

interface PropertyListProps {
  landlord_id?: string | null;
  favourites?: boolean | null;
}

const ITEMS_PER_PAGE = 10;

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

  const [properties, setProperties] = useState<PropertyListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const buildUrl = (pageNum: number) => {
    let url = `/api/properties/?page=${pageNum}&limit=${ITEMS_PER_PAGE}`;
    if (landlord_id) {
      url += `&landlord_id=${landlord_id}`;
    } else if (favourites) {
      url += "&is_favourites=true";
    } else {
      let urlQuery = "";
      if (country) urlQuery += "&country=" + country;
      if (numGuests) urlQuery += "&numGuests=" + numGuests;
      if (numBathrooms) urlQuery += "&numBathrooms=" + numBathrooms;
      if (numBedrooms) urlQuery += "&numBedrooms=" + numBedrooms;
      if (category) urlQuery += "&category=" + category;
      if (checkinDate)
        urlQuery += "&checkin=" + format(checkinDate, "yyyy-MM-dd");
      if (checkoutDate)
        urlQuery += "&checkout=" + format(checkoutDate, "yyyy-MM-dd");
      url += urlQuery;
    }
    return url;
  };

  const fetchProperties = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await apiService.get(buildUrl(pageNum));
      const newProperties = response.properties.map(
        (property: any) => ({
          ...property,
          is_favourite: response.favourites.includes(property.id),
        })
      );

      if (pageNum === 1) {
        setProperties(newProperties);
      } else {
        setProperties((prev) => [...prev, ...newProperties]);
      }

      setHasMore(newProperties.length === ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const { lastElementRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
  });

  useEffect(() => {
    setPage(1);
    setProperties([]);
    setHasMore(true);
    fetchProperties(1);
  }, [category, searchModal.query, searchParams]);

  useEffect(() => {
    if (page > 1) {
      fetchProperties(page);
    }
  }, [page]);

  const markFavourite = (id: string, is_favourite: boolean) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id.toString() === id ? { ...property, is_favourite } : property
      )
    );
  };

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading properties: {error.message}
      </div>
    );
  }

  return (
    <>
      {properties.map((property, index) => (
        <div
          key={property.id}
          ref={index === properties.length - 1 ? lastElementRef : undefined}
        >
          <PropertyListItem
            property={property}
            markFavourite={(is_favourite: boolean) =>
              markFavourite(property.id.toString(), is_favourite)
            }
          />
        </div>
      ))}
      {loading && (
        <>
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </>
      )}
    </>
  );
};

export default PropertyList;
