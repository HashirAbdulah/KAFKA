"use client";
import Image from "next/image";
import Modal from "./Modal";
import useEditPropertyModal from "@/app/hooks/useEditPropertyModal";
import CustomButton from "../forms/CustomButton";
import Categories from "../addProperty/Categories";
import { ChangeEvent, useEffect, useState } from "react";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";
import AddressForm from "../forms/AddressForm";
import ErrorMessage from "../ui/ErrorMessage";
import LoadingSpinner from "../ui/LoadingSpinner";

const EditPropertyModal = () => {
  const router = useRouter();
  const editPropertyModal = useEditPropertyModal();
  const property = editPropertyModal.property;

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [dataImages, setDataImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [dataStateProvince, setDataStateProvince] = useState("");
  const [dataCity, setDataCity] = useState("");
  const [dataStreetAddress, setDataStreetAddress] = useState("");
  const [dataPostalCode, setDataPostalCode] = useState("");

  // Add consistent style constants
  const inputStyles =
    "w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200";
  const labelStyles = "text-sm font-medium text-gray-700";
  const sectionStyles = "space-y-6 max-w-2xl mx-auto";
  const buttonContainerStyles = "flex justify-between mt-8 gap-4";
  const modalContentStyles = "p-6 sm:p-8 max-h-[80vh] overflow-y-auto";

  // Add these style constants near the top with other style constants
  const imageGridStyles =
    "grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl";
  const imageContainerStyles =
    "relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-200";
  const imageStyles = "object-cover w-full h-full";
  const removeButtonStyles =
    "absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600";
  const uploadSectionStyles =
    "p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors duration-200";

  // Load property data when modal opens
  useEffect(() => {
    if (property) {
      setDataCategory(property.category || "");
      setDataTitle(property.title || "");
      setDataDescription(property.description || "");
      setDataPrice(property.price_per_night?.toString() || "");
      setDataBedrooms(property.bedrooms?.toString() || "");
      setDataBathrooms(property.bathrooms?.toString() || "");
      setDataGuests(property.guests?.toString() || "");
      if (property.country && property.country_code) {
        setDataCountry({
          label: property.country,
          value: property.country_code,
        });
      }
      setDataStateProvince(property.state_province || "");
      setDataCity(property.city || "");
      setDataStreetAddress(property.street_address || "");
      setDataPostalCode(property.postal_code || "");

      // Load existing images
      if (property.images && Array.isArray(property.images)) {
        const imageUrls = property.images.map((img: any) => img.image_url);
        setCurrentImages(imageUrls);
      }
    }
  }, [property]);

  const setCategory = (category: string) => {
    setDataCategory(category);
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

  const removeImage = (index: number, isNewImage: boolean) => {
    if (isNewImage) {
      setDataImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => {
        const newPreviews = [...prev];
        URL.revokeObjectURL(newPreviews[index]); // Clean up the object URL
        return newPreviews.filter((_, i) => i !== index);
      });
    } else {
      setCurrentImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateStep = (step: number): boolean => {
    setErrors([]);
    setImageErrors([]);

    switch (step) {
      case 1:
        if (!dataCategory) {
          setErrors(["Please select a category"]);
          return false;
        }
        return true;
      case 2:
        if (!dataTitle) {
          setErrors(["Please enter a title"]);
          return false;
        }
        if (!dataDescription) {
          setErrors(["Please enter a description"]);
          return false;
        }
        return true;
      case 3:
        if (!dataPrice || parseInt(dataPrice) <= 0) {
          setErrors(["Please enter a valid price"]);
          return false;
        }
        if (!dataBedrooms || parseInt(dataBedrooms) <= 0) {
          setErrors(["Please enter a valid number of bedrooms"]);
          return false;
        }
        if (!dataBathrooms || parseInt(dataBathrooms) <= 0) {
          setErrors(["Please enter a valid number of bathrooms"]);
          return false;
        }
        if (!dataGuests || parseInt(dataGuests) <= 0) {
          setErrors(["Please enter a valid number of guests"]);
          return false;
        }
        return true;
      case 4:
        if (!dataCountry) {
          setErrors(["Please select a country"]);
          return false;
        }
        return true;
      case 5:
        if (currentImages.length + dataImages.length === 0) {
          setErrors(["Please upload at least one image"]);
          return false;
        }
        if (currentImages.length + dataImages.length > 5) {
          setErrors(["You can have a maximum of 5 images"]);
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

  const submitForm = async () => {
    if (!property?.id) return;

    try {
      setIsSubmitting(true);
      setErrors([]);
      setImageErrors([]);

      // Validate all required fields
      if (
        !dataCategory ||
        !dataTitle ||
        !dataDescription ||
        !dataPrice ||
        !dataBedrooms ||
        !dataBathrooms ||
        !dataGuests ||
        !dataCountry ||
        !dataStateProvince ||
        !dataCity ||
        !dataStreetAddress ||
        !dataPostalCode
      ) {
        setErrors(["Please fill in all required fields."]);
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Add basic property information
      formData.append("title", dataTitle);
      formData.append("description", dataDescription);
      formData.append("price_per_night", dataPrice);
      formData.append("bedrooms", dataBedrooms);
      formData.append("bathrooms", dataBathrooms);
      formData.append("guests", dataGuests);
      formData.append("country", dataCountry.label);
      formData.append("country_code", dataCountry.value);
      formData.append("state_province", dataStateProvince);
      formData.append("city", dataCity);
      formData.append("street_address", dataStreetAddress);
      formData.append("postal_code", dataPostalCode);
      formData.append("category", dataCategory);

      // Handle images properly
      // First, append current images that should be kept
      if (currentImages.length > 0) {
        currentImages.forEach((imageUrl) => {
          // Extract just the filename from the URL
          const imagePath = imageUrl.split("/").pop();
          if (imagePath) {
            formData.append("current_images", imagePath);
          }
        });
      }

      // Then append new images if any
      if (dataImages.length > 0) {
        dataImages.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Validate total number of images
      const totalImages = currentImages.length + dataImages.length;
      if (totalImages === 0) {
        setErrors(["Please keep at least one image or upload new ones."]);
        setIsSubmitting(false);
        return;
      }
      if (totalImages > 5) {
        setErrors(["You can have a maximum of 5 images in total."]);
        setIsSubmitting(false);
        return;
      }

      try {
      const response = await apiService.put(
        `/api/properties/${property.id}/update/`,
        formData
      );

      if (response.success) {
          // Call onSuccess callback if it exists
          if (editPropertyModal.onSuccess) {
            editPropertyModal.onSuccess();
          }

        router.refresh();
        editPropertyModal.close();

        // Reset form
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
          setCurrentImages([]);
          setImageErrors([]);
      } else {
        const tmpErrors: string[] = response.errors
          ? Object.values(response.errors).flatMap((err: any) => err)
            : ["An unexpected error occurred while updating the property"];
        setErrors(tmpErrors);
        }
      } catch (error: any) {
        console.error("Property update error:", error);
        // Try to get more detailed error information
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred while updating the property";
        setErrors([errorMessage]);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setErrors([
        error.message ||
          "An unexpected error occurred while preparing the form data",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={modalContentStyles}>
      {errors.length > 0 && (
        <ErrorMessage
          message={errors.join(", ")}
          onRetry={() => setErrors([])}
          className="mb-6"
        />
      )}

      {isSubmitting ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="large" className="text-purple-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className={sectionStyles}>
              <h2 className="text-2xl font-semibold text-gray-900">
                Choose Category
              </h2>
              <Categories
                dataCategory={dataCategory}
                setCategory={setCategory}
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
              onClick={() => setCurrentStep(1)}
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
                value={dataPrice}
                onChange={(e) => setDataPrice(e.target.value)}
                    className={inputStyles}
                    placeholder="Enter price"
              />
            </div>
                <div className="space-y-2">
                  <label htmlFor="bedrooms" className={labelStyles}>
                    Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                value={dataBedrooms}
                onChange={(e) => setDataBedrooms(e.target.value)}
                    className={inputStyles}
                    placeholder="Enter number"
              />
            </div>
                <div className="space-y-2">
                  <label htmlFor="bathrooms" className={labelStyles}>
                    Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                value={dataBathrooms}
                onChange={(e) => setDataBathrooms(e.target.value)}
                    className={inputStyles}
                    placeholder="Enter number"
              />
            </div>
                <div className="space-y-2">
                  <label htmlFor="guests" className={labelStyles}>
                    Guests
              </label>
              <input
                type="number"
                id="guests"
                value={dataGuests}
                onChange={(e) => setDataGuests(e.target.value)}
                    className={inputStyles}
                    placeholder="Enter number"
              />
            </div>
          </div>
              <div className={buttonContainerStyles}>
            <CustomButton
              label="Previous"
              onClick={() => setCurrentStep(2)}
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
              <div className={buttonContainerStyles}>
                <CustomButton
                  label="Previous"
                  onClick={() => setCurrentStep(3)}
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
                Update Images
              </h2>
              <div className="space-y-6">
                {/* Current Images Section */}
                {currentImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Current Images ({currentImages.length})
                      </h3>
                      <span className="text-sm text-gray-500">
                        {5 - currentImages.length - dataImages.length} slots
                        remaining
                      </span>
          </div>
                    <div className={imageGridStyles}>
                      {currentImages.map((imageUrl, index) => (
                        <div
                          key={`current-${index}`}
                          className={imageContainerStyles}
                        >
                          <div className="relative w-full h-full">
                  <Image
                              src={imageUrl}
                              alt={`Current Image ${index + 1}`}
                              fill
                              className={imageStyles}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index, false)}
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

                {/* New Images Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Add New Images
                    </h3>
                    <span className="text-sm text-gray-500">
                      {dataImages.length} new images selected
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
                        Click to upload new images
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

                  {/* New Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        New Image Previews
                      </h3>
                      <div className={imageGridStyles}>
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={`new-${index}`}
                            className={imageContainerStyles}
                          >
                            <div className="relative w-full h-full">
                  <Image
                                src={preview}
                                alt={`New Image ${index + 1}`}
                                fill
                                className={imageStyles}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index, true)}
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
              </div>
              <div className={buttonContainerStyles}>
            <CustomButton
              label="Previous"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
            />
            <CustomButton
              label={isSubmitting ? "Updating..." : "Update Property"}
              onClick={submitForm}
                  disabled={isSubmitting || imageErrors.length > 0}
                  className={`px-6 py-2 bg-purple-600 text-white rounded-full transition-all duration-300 ${
                    isSubmitting || imageErrors.length > 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-purple-700"
                  }`}
            />
          </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={editPropertyModal.isOpen}
      close={editPropertyModal.close}
      title="Edit Property"
      label="Edit Property Modal"
      content={content}
      className="max-w-3xl"
    />
  );
};

export default EditPropertyModal;
