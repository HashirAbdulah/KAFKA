"use client";
import Image from "next/image";
import Modal from "./Modal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import CustomButton from "../forms/CustomButton";
import Categories from "../addProperty/Categories";
import { ChangeEvent, useState } from "react";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";
import { useRouter } from "next/navigation";
import useApiRequest from "@/app/hooks/useApiRequest";
import apiService from "@/app/services/apiService";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import AddressForm from "../forms/AddressForm";

const AddPropertyModal = () => {
  const router = useRouter();
  const addPropertyModal = useAddPropertyModal();

  const [currentStep, setCurrentStep] = useState(1);
  const [dataCategory, setDataCategory] = useState("");
  const [dataTitle, setDataTitle] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataPrice, setDataPrice] = useState("");
  const [dataBedrooms, setDataBedrooms] = useState("");
  const [dataBathrooms, setDataBathrooms] = useState("");
  const [dataGuests, setDataGuests] = useState("");
  const [dataCountry, setDataCountry] = useState<SelectCountryValue | null>(
    null
  );
  const [dataStateProvince, setDataStateProvince] = useState("");
  const [dataCity, setDataCity] = useState("");
  const [dataStreetAddress, setDataStreetAddress] = useState("");
  const [dataPostalCode, setDataPostalCode] = useState("");
  const [dataImage, setDataImage] = useState<File | null>(null);

  const {
    loading,
    error,
    execute: submitProperty,
    reset: resetApiState,
  } = useApiRequest(async (formData: FormData) => {
    const response = await apiService.post("/api/properties/create/", formData);
    if (response.success) {
      router.push(`/properties/${response.id}`);
      addPropertyModal.close();
      resetForm();
    }
    return response;
  });

  const resetForm = () => {
    setCurrentStep(1);
    setDataCategory("");
    setDataTitle("");
    setDataDescription("");
    setDataPrice("");
    setDataBedrooms("");
    setDataBathrooms("");
    setDataGuests("");
    setDataCountry(null);
    setDataStateProvince("");
    setDataCity("");
    setDataStreetAddress("");
    setDataPostalCode("");
    setDataImage(null);
    resetApiState();
  };

  const validateStep = (step: number): boolean => {
    resetApiState();

    switch (step) {
      case 1:
        if (!dataCategory) {
          return false;
        }
        return true;
      case 2:
        if (!dataTitle || !dataDescription) {
          return false;
        }
        return true;
      case 3:
        if (!dataPrice || !dataBedrooms || !dataBathrooms || !dataGuests) {
          return false;
        }
        return true;
      case 4:
        if (
          !dataCountry ||
          !dataStateProvince ||
          !dataCity ||
          !dataStreetAddress ||
          !dataPostalCode
        ) {
          return false;
        }
        return true;
      case 5:
        if (!dataImage) {
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    const formData = new FormData();
    formData.append("category", dataCategory);
    formData.append("title", dataTitle);
    formData.append("description", dataDescription);
    formData.append("price_per_night", dataPrice);
    formData.append("bedrooms", dataBedrooms);
    formData.append("bathrooms", dataBathrooms);
    formData.append("guests", dataGuests);
    formData.append("country", dataCountry!.label);
    formData.append("country_code", dataCountry!.value);
    formData.append("state_province", dataStateProvince);
    formData.append("city", dataCity);
    formData.append("street_address", dataStreetAddress);
    formData.append("postal_code", dataPostalCode);
    formData.append("image", dataImage!);

    await submitProperty(formData);
  };

  const content = (
    <>
      {error && (
        <ErrorMessage
          message={error}
          onRetry={resetApiState}
          className="mb-6"
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {currentStep === 1 && (
            <>
              <h2 className="mb-6 text-2xl font-semibold">Choose Category</h2>
              <Categories
                dataCategory={dataCategory}
                setCategory={(category) => setDataCategory(category)}
              />
              <div className="flex justify-end mt-4">
                <CustomButton label="Next" onClick={goToNextStep} />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-2xl mb-6 font-semibold">
                Describe Your Place
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={dataTitle}
                    onChange={(e) => setDataTitle(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title for the Property"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={dataDescription}
                    onChange={(e) => setDataDescription(e.target.value)}
                    className="w-full h-[150px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Description for the Property"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <CustomButton label="Next" onClick={goToNextStep} />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 className="text-2xl mb-6 font-semibold">
                Details of Your Place
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price Per Night
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="Enter Price for the Property"
                    value={dataPrice}
                    onChange={(e) => setDataPrice(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="bedrooms" className="text-sm font-medium">
                    No of Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    placeholder="Enter No of Bedrooms"
                    value={dataBedrooms}
                    onChange={(e) => setDataBedrooms(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="bathrooms" className="text-sm font-medium">
                    No of Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    placeholder="Enter No of Bathrooms"
                    value={dataBathrooms}
                    onChange={(e) => setDataBathrooms(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="guests" className="text-sm font-medium">
                    No of Guests
                  </label>
                  <input
                    type="number"
                    id="guests"
                    placeholder="Enter No of Guests"
                    value={dataGuests}
                    onChange={(e) => setDataGuests(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <CustomButton label="Next" onClick={goToNextStep} />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2 className="text-2xl mb-6 font-semibold">Location</h2>
              <div className="space-y-4 pb-6 pt-3">
                <AddressForm
                  country={dataCountry}
                  onCountryChange={(value) => setDataCountry(value)}
                  stateProvince={dataStateProvince}
                  onStateProvinceChange={setDataStateProvince}
                  city={dataCity}
                  onCityChange={setDataCity}
                  streetAddress={dataStreetAddress}
                  onStreetAddressChange={setDataStreetAddress}
                  postalCode={dataPostalCode}
                  onPostalCodeChange={setDataPostalCode}
                />
              </div>
              <div className="flex justify-end mt-4">
                <CustomButton label="Next" onClick={goToNextStep} />
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <h2 className="text-2xl mb-6 font-semibold">Upload an Image</h2>
              <div className="pt-3 pb-6 space-y-4">
                <div className="py-4 px-6 bg-gray-600 text-white rounded-xl">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const tmpImage = e.target.files[0];
                        setDataImage(tmpImage);
                      }
                    }}
                  />
                </div>
                {dataImage && (
                  <div className="w-[200px] h-[150px] relative">
                    <Image
                      fill
                      alt="uploaded Image"
                      src={URL.createObjectURL(dataImage)}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <CustomButton
                  label={loading ? "Submitting..." : "Submit Property"}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <Modal
      isOpen={addPropertyModal.isOpen}
      close={() => {
        addPropertyModal.close();
        resetForm();
      }}
      label="Add Property"
      content={content}
    />
  );
};

export default AddPropertyModal;
