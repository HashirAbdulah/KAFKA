export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  phone_number: string | null;
  gender: "M" | "F" | "O" | "P" | null;
  bio: string | null;
  location: string | null;
  interests: string | null;
  occupation: string | null;
  education: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_identity_verified: boolean;
  show_email_publicly: boolean;
  show_phone_publicly: boolean;
  active_sessions: {
    [key: string]: {
      device_info: string;
      last_activity: string;
    };
  };
  date_joined: string;
  last_login: string | null;
}

export interface ProfileUpdateData {
  name?: string;
  profile_image?: File;
  phone_number?: string;
  gender?: "M" | "F" | "O" | "P";
  bio?: string;
  location?: string;
  interests?: string;
  occupation?: string;
  education?: string;
  show_email_publicly?: boolean;
  show_phone_publicly?: boolean;
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PrivacySettingsData {
  show_email_publicly: boolean;
  show_phone_publicly: boolean;
}

export type PropertyType = {
  id: number;
  title: string;
  description: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  category: string;
  image_url: string;
  primary_image_url: string;
  is_primary?: boolean;
  country: string;
  country_code: string;
  state_province: string;
  city: string;
  street_address: string;
  postal_code: string;
  images?: { image_url: string }[];
};
