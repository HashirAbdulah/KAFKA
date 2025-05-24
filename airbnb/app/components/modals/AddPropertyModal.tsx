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

const imageGridStyles =
  "grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl";
const imageContainerStyles =
  "relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-200";
const imageStyles = "object-cover w-full h-full";
const removeButtonStyles =
  "absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600";
const uploadSectionStyles =
  "p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors duration-200";

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
  const [dataImages, setDataImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);

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
    setDataImages([]);
    setImagePreviews([]);
    setImageErrors([]);
    resetApiState();
  };

  const validateStep = (step: number): boolean => {
    resetApiState();
    switch (step) {
      case 1:
        return !!dataCategory;
      case 2:
        return !!dataTitle && !!dataDescription;
      case 3:
        return !!dataPrice && !!dataBedrooms && !!dataBathrooms && !!dataGuests;
      case 4:
        return (
          !!dataCountry &&
          !!dataStateProvince &&
          !!dataCity &&
          !!dataStreetAddress &&
          !!dataPostalCode
        );
      case 5:
        return (
          dataImages.length > 0 &&
          dataImages.length <= 5 &&
          imageErrors.length === 0
        );
      default:
        return true;
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageErrors([]);

    // Validate number of images
    if (dataImages.length + files.length > 5) {
      setImageErrors(["You can upload a maximum of 5 images"]);
      return;
    }

    // Validate file types and create previews
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setImageErrors((prev) => [
          ...prev,
          `${file.name} is not a valid image file`,
        ]);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setImageErrors((prev) => [
          ...prev,
          `${file.name} is too large (max 5MB)`,
        ]);
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setDataImages((prev) => [...prev, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setDataImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Clean up the object URL
      return newPreviews.filter((_, i) => i !== index);
    });
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

    // Append each image
    dataImages.forEach((image, index) => {
      formData.append(`images`, image);
    });

    await submitProperty(formData);
  };

  const inputStyles =
    "w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200";
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
              <h2 className="text-2xl font-semibold text-gray-900">
                Choose Category
              </h2>
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
              <h2 className="text-2xl font-semibold text-gray-900">
                Describe Your Place
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className={labelStyles}>
                    Title
                  </label>
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
                  <label htmlFor="description" className={labelStyles}>
                    Description
                  </label>
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
              <h2 className="text-2xl font-semibold text-gray-900">
                Property Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className={labelStyles}>
                    Price Per Night
                  </label>
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
                  <label htmlFor="bedrooms" className={labelStyles}>
                    Bedrooms
                  </label>
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
                  <label htmlFor="bathrooms" className={labelStyles}>
                    Bathrooms
                  </label>
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
                  <label htmlFor="guests" className={labelStyles}>
                    Guests
                  </label>
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Add Photos
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Upload Property Images
                    </h3>
                    <span className="text-sm text-gray-500">
                      {dataImages.length} images selected (max 5)
                    </span>
                  </div>
                  <div className={uploadSectionStyles}>
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="flex flex-col items-center justify-center cursor-pointer p-6 text-center"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Click to upload property images
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPG, JPEG, PNG, AVIF and HEIC (max 5MB each)
                      </span>
                    </label>
                  </div>
                  {imageErrors.length > 0 && (
                    <div className="text-red-500 text-sm space-y-1 bg-red-50 p-3 rounded-lg">
                      {imageErrors.map((error, index) => (
                        <p key={index} className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {imagePreviews.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Image Previews
                    </h3>
                    <div className={imageGridStyles}>
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={`preview-${index}`}
                          className={imageContainerStyles}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={preview}
                              alt={`Property Image ${index + 1}`}
                              fill
                              className={imageStyles}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className={removeButtonStyles}
                            aria-label="Remove image"
                            title="Remove image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
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
                  label={loading ? "Creating..." : "Create Property"}
                  onClick={handleSubmit}
                  disabled={loading || imageErrors.length > 0}
                  className={`px-6 py-2 bg-purple-600 text-white rounded-full transition-all duration-300 ${
                    loading || imageErrors.length > 0
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
