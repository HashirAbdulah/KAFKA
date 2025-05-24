export interface PropertyImageType {
  id: string;
  image_url: string;
  is_primary: boolean;
  order: number;
}

export interface PropertyType {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  primary_image_url: string | null;
  images: PropertyImageType[];
  category: string;
  country: string;
  country_code: string;
  state_province: string;
  city: string;
  street_address: string;
  postal_code: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  landlord_id: string;
  is_favourite?: boolean;
}

export interface PropertyDetailType extends PropertyType {
  landlord: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
}

export type PropertyListType = {
  id: number;
  title: string;
  price_per_night: number;
  landlord_id: string;
  is_favourite: boolean;
  primary_image_url?: string;
};
