import { useState, useEffect } from "react";
import SelectCountry, { SelectCountryValue } from "./SelectCountry";

interface LocationDropdownsProps {
  country: SelectCountryValue | null;
  onCountryChange: (value: SelectCountryValue | null) => void;
  stateProvince: string;
  onStateProvinceChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
}

interface StateProvince {
  name: string;
  code: string;
}

interface City {
  name: string;
  stateCode: string;
}

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({
  country,
  onCountryChange,
  stateProvince,
  onStateProvinceChange,
  city,
  onCityChange,
}) => {
  const [states, setStates] = useState<StateProvince[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!country) {
        setStates([]);
        setCities([]);
        return;
      }

      setLoadingStates(true);
      try {
        const response = await fetch(
          `https://countriesnow.space/api/v0.1/countries/states`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              country: country.label,
            }),
          }
        );
        const data = await response.json();
        if (data.data?.states) {
          setStates(
            data.data.states.map((state: any) => ({
              name: state.name,
              code: state.state_code,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [country]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!country || !stateProvince) {
        setCities([]);
        return;
      }

      setLoadingCities(true);
      try {
        const response = await fetch(
          `https://countriesnow.space/api/v0.1/countries/state/cities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              country: country.label,
              state: stateProvince,
            }),
          }
        );
        const data = await response.json();
        if (data.data) {
          setCities(
            data.data.map((cityName: string) => ({
              name: cityName,
              stateCode: stateProvince,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [country, stateProvince]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Country</label>
        <SelectCountry value={country} onChange={onCountryChange} />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">State/Province</label>
        <select
          value={stateProvince}
          onChange={(e) => onStateProvinceChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          disabled={!country || loadingStates}
        >
          <option value="">Select State/Province</option>
          {states.map((state) => (
            <option key={state.code} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
        {loadingStates && (
          <p className="text-sm text-gray-500">Loading states...</p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">City</label>
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          disabled={!stateProvince || loadingCities}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {loadingCities && (
          <p className="text-sm text-gray-500">Loading cities...</p>
        )}
      </div>
    </div>
  );
};

export default LocationDropdowns;
