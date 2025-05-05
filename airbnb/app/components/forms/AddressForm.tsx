import { useState, useEffect } from "react";
import SelectCountry, { SelectCountryValue } from "./SelectCountry";
import LocationDropdowns from "./LocationDropdowns";
import { useLoadScript } from "@react-google-maps/api";

interface AddressFormProps {
  country: SelectCountryValue | null;
  onCountryChange: (value: SelectCountryValue | null) => void;
  stateProvince: string;
  onStateProvinceChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  streetAddress: string;
  onStreetAddressChange: (value: string) => void;
  postalCode: string;
  onPostalCodeChange: (value: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  country,
  onCountryChange,
  stateProvince,
  onStateProvinceChange,
  city,
  onCityChange,
  streetAddress,
  onStreetAddressChange,
  postalCode,
  onPostalCodeChange,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<HTMLInputElement | null>(null);
  const [autocompleteInstance, setAutocompleteInstance] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Update autocomplete restrictions when location changes
  useEffect(() => {
    if (autocompleteInstance && country && stateProvince && city) {
      // Create a bounds object for the selected city
      const geocoder = new google.maps.Geocoder();
      const address = `${city}, ${stateProvince}, ${country.label}`;

      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const bounds = new google.maps.LatLngBounds();
          const viewport = results[0].geometry.viewport;

          if (viewport) {
            bounds.union(viewport);
            autocompleteInstance.setBounds(bounds);
          }
        }
      });

      // Set component restrictions
      autocompleteInstance.setComponentRestrictions({
        country: country.value,
      });
    }
  }, [country, stateProvince, city, autocompleteInstance]);

  const handleStreetAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onStreetAddressChange(e.target.value);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and hyphens
    if (/^[0-9-]*$/.test(value)) {
      onPostalCodeChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <LocationDropdowns
        country={country}
        onCountryChange={onCountryChange}
        stateProvince={stateProvince}
        onStateProvinceChange={onStateProvinceChange}
        city={city}
        onCityChange={onCityChange}
      />

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Street Address</label>
        {isLoaded ? (
          <div className="relative">
            <input
              type="text"
              value={streetAddress}
              onChange={handleStreetAddressChange}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={!city ? "Select city first" : "Enter street address"}
              disabled={!city}
              ref={(input) => {
                if (input && !placeAutocomplete) {
                  setPlaceAutocomplete(input);
                  const autocomplete = new google.maps.places.Autocomplete(
                    input,
                    {
                      types: ["address"],
                      fields: [
                        "address_components",
                        "formatted_address",
                        "geometry",
                      ],
                    }
                  );
                  setAutocompleteInstance(autocomplete);

                  autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (place.formatted_address) {
                      onStreetAddressChange(place.formatted_address);

                      // Extract postal code if available
                      const postalCodeComponent =
                        place.address_components?.find((component) =>
                          component.types.includes("postal_code")
                        );
                      if (postalCodeComponent) {
                        onPostalCodeChange(postalCodeComponent.long_name);
                      }
                    }
                  });
                }
              }}
            />
            {!city && (
              <p className="text-sm text-gray-500 mt-1">
                Please select a city first to enable address suggestions
              </p>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={streetAddress}
            onChange={handleStreetAddressChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Enter street address"
          />
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Postal Code</label>
        <input
          type="text"
          value={postalCode}
          onChange={handlePostalCodeChange}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Enter postal code"
          maxLength={10}
        />
      </div>
    </div>
  );
};

export default AddressForm;
