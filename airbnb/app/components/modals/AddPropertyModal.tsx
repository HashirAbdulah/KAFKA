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
  const [dataCountry, setDataCountry] = useState<SelectCountryValue | null>(null);
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
      case 1: return !!dataCategory;
      case 2: return !!dataTitle && !!dataDescription;
      case 3: return !!dataPrice && !!dataBedrooms && !!dataBathrooms && !!dataGuests;
      case 4: return !!dataCountry && !!dataStateProvince && !!dataCity && !!dataStreetAddress && !!dataPostalCode;
      case 5: return !!dataImage;
      default: return true;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  const inputStyles = "w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200";
  const labelStyles = "text-sm font-medium text-gray-700";
  const sectionStyles = "space-y-6 max-w-2xl mx-auto";
  const buttonContainerStyles = "flex justify-between mt-8 gap-4";
  const modalContentStyles = "p-6 sm:p-8 max-h-[80vh] overflow-y-auto";

  const content = (
    <div className={modalContentStyles}>
      {error && (
        <ErrorMessage
          message={error}
          onRetry={resetApiState}
          className="mb-6"
        />
      )}

      {loading ? (
  <div className="flex justify-center items-center min-h-[300px]">
    <LoadingSpinner size="large" className="text-purple-600" />
  </div>
      ) : (
        <>
          {currentStep === 1 && (
            <div className={sectionStyles}>
              <h2 className="text-2xl font-semibold text-gray-900">Choose Category</h2>
              <Categories
                dataCategory={dataCategory}
                setCategory={setDataCategory}
              />
              <div className="flex justify-end mt-4">
                <CustomButton
                  label="Next"
                  onClick={goToNextStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={sectionStyles}>
              <h2 className="text-2xl font-semibold text-gray-900">Describe Your Place</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className={labelStyles}>Title</label>
                  <input
                    type="text"
                    id="title"
                    value={dataTitle}
                    onChange={(e) => setDataTitle(e.target.value)}
                    className={inputStyles}
                    placeholder="Enter property title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className={labelStyles}>Description</label>
                  <textarea
                    id="description"
                    value={dataDescription}
                    onChange={(e) => setDataDescription(e.target.value)}
                    className={`${inputStyles} h-32 resize-none`}
                    placeholder="Describe your property"
                  />
                </div>
              </div>
              <div className={buttonContainerStyles}>
                <CustomButton
                  label="Previous"
                  onClick={goToPreviousStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
                <CustomButton
                  label="Next"
                  onClick={goToNextStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={sectionStyles}>
              <h2 className="text-2xl font-semibold text-gray-900">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className={labelStyles}>Price Per Night</label>
                  <input
                    type="number"
                    id="price"
                    placeholder="Enter price"
                    value={dataPrice}
                    onChange={(e) => setDataPrice(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bedrooms" className={labelStyles}>Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    placeholder="Enter number"
                    value={dataBedrooms}
                    onChange={(e) => setDataBedrooms(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bathrooms" className={labelStyles}>Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    placeholder="Enter number"
                    value={dataBathrooms}
                    onChange={(e) => setDataBathrooms(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="guests" className={labelStyles}>Guests</label>
                  <input
                    type="number"
                    id="guests"
                    placeholder="Enter number"
                    value={dataGuests}
                    onChange={(e) => setDataGuests(e.target.value)}
                    className={inputStyles}
                  />
                </div>
              </div>
              <div className={buttonContainerStyles}>
              <CustomButton
                  label="Previous"
                  onClick={goToPreviousStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
                <CustomButton
                  label="Next"
                  onClick={goToNextStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className={sectionStyles}>
              <h2 className="text-2xl font-semibold text-gray-900">Location</h2>
              <AddressForm
                country={dataCountry}
                onCountryChange={setDataCountry}
                stateProvince={dataStateProvince}
                onStateProvinceChange={setDataStateProvince}
                city={dataCity}
                onCityChange={setDataCity}
                streetAddress={dataStreetAddress}
                onStreetAddressChange={setDataStreetAddress}
                postalCode={dataPostalCode}
                onPostalCodeChange={setDataPostalCode}
              />
              <div className={buttonContainerStyles}>
              <CustomButton
                  label="Previous"
                  onClick={goToPreviousStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
                <CustomButton
                  label="Next"
                  onClick={goToNextStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className={sectionStyles}>
              <h2 className="text-2xl font-semibold text-gray-900">Add Photos</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="image" className={labelStyles}>Property Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setDataImage(file);
                    }}
                    className={inputStyles}
                  />
                </div>
                {dataImage && (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <Image
                      src={URL.createObjectURL(dataImage)}
                      alt="Property Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className={buttonContainerStyles}>
              <CustomButton
                  label="Previous"
                  onClick={goToPreviousStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                />
                <CustomButton
                  label="Submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2 bg-purple-600 text-white rounded-full transition-all duration-300 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-purple-700"
                  }`}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={addPropertyModal.isOpen}
      close={() => {
        addPropertyModal.close();
        resetForm();
      }}
      label="Add Property"
      title="Add Property"
      content={content}
      className="max-w-3xl"
    />
  );
};

export default AddPropertyModal;
