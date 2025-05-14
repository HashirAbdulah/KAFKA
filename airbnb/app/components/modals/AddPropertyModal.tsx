// "use client";
// import Image from "next/image";
// import Modal from "./Modal";
// import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
// import CustomButton from "../forms/CustomButton";
// import Categories from "../addProperty/Categories";
// import { ChangeEvent, useState } from "react";
// import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";
// import { useRouter } from "next/navigation";
// import useApiRequest from "@/app/hooks/useApiRequest";
// import apiService from "@/app/services/apiService";
// import LoadingSpinner from "../ui/LoadingSpinner";
// import ErrorMessage from "../ui/ErrorMessage";
// import AddressForm from "../forms/AddressForm";

// const AddPropertyModal = () => {
//   const router = useRouter();
//   const addPropertyModal = useAddPropertyModal();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [dataCategory, setDataCategory] = useState("");
//   const [dataTitle, setDataTitle] = useState("");
//   const [dataDescription, setDataDescription] = useState("");
//   const [dataPrice, setDataPrice] = useState("");
//   const [dataBedrooms, setDataBedrooms] = useState("");
//   const [dataBathrooms, setDataBathrooms] = useState("");
//   const [dataGuests, setDataGuests] = useState("");
//   const [dataCountry, setDataCountry] = useState<SelectCountryValue | null>(
//     null
//   );
//   const [dataStateProvince, setDataStateProvince] = useState("");
//   const [dataCity, setDataCity] = useState("");
//   const [dataStreetAddress, setDataStreetAddress] = useState("");
//   const [dataPostalCode, setDataPostalCode] = useState("");
//   const [dataImage, setDataImage] = useState<File | null>(null);

//   const {
//     loading,
//     error,
//     execute: submitProperty,
//     reset: resetApiState,
//   } = useApiRequest(async (formData: FormData) => {
//     const response = await apiService.post("/api/properties/create/", formData);
//     if (response.success) {
//       router.push(`/properties/${response.id}`);
//       addPropertyModal.close();
//       resetForm();
//     }
//     return response;
//   });

//   const resetForm = () => {
//     setCurrentStep(1);
//     setDataCategory("");
//     setDataTitle("");
//     setDataDescription("");
//     setDataPrice("");
//     setDataBedrooms("");
//     setDataBathrooms("");
//     setDataGuests("");
//     setDataCountry(null);
//     setDataStateProvince("");
//     setDataCity("");
//     setDataStreetAddress("");
//     setDataPostalCode("");
//     setDataImage(null);
//     resetApiState();
//   };

//   const validateStep = (step: number): boolean => {
//     resetApiState();

//     switch (step) {
//       case 1:
//         if (!dataCategory) {
//           return false;
//         }
//         return true;
//       case 2:
//         if (!dataTitle || !dataDescription) {
//           return false;
//         }
//         return true;
//       case 3:
//         if (!dataPrice || !dataBedrooms || !dataBathrooms || !dataGuests) {
//           return false;
//         }
//         return true;
//       case 4:
//         if (
//           !dataCountry ||
//           !dataStateProvince ||
//           !dataCity ||
//           !dataStreetAddress ||
//           !dataPostalCode
//         ) {
//           return false;
//         }
//         return true;
//       case 5:
//         if (!dataImage) {
//           return false;
//         }
//         return true;
//       default:
//         return true;
//     }
//   };

//   const goToNextStep = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const goToPreviousStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(currentStep)) return;

//     const formData = new FormData();
//     formData.append("category", dataCategory);
//     formData.append("title", dataTitle);
//     formData.append("description", dataDescription);
//     formData.append("price_per_night", dataPrice);
//     formData.append("bedrooms", dataBedrooms);
//     formData.append("bathrooms", dataBathrooms);
//     formData.append("guests", dataGuests);
//     formData.append("country", dataCountry!.label);
//     formData.append("country_code", dataCountry!.value);
//     formData.append("state_province", dataStateProvince);
//     formData.append("city", dataCity);
//     formData.append("street_address", dataStreetAddress);
//     formData.append("postal_code", dataPostalCode);
//     formData.append("image", dataImage!);

//     await submitProperty(formData);
//   };

//   const content = (
//     <>
//       {error && (
//         <ErrorMessage
//           message={error}
//           onRetry={resetApiState}
//           className="mb-6"
//         />
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center min-h-[300px]">
//           <LoadingSpinner size="large" />
//         </div>
//       ) : (
//         <>
//           {currentStep === 1 && (
//             <>
//               <h2 className="mb-6 text-2xl font-semibold">Choose Category</h2>
//               <Categories
//                 dataCategory={dataCategory}
//                 setCategory={(category) => setDataCategory(category)}
//               />
//               <div className="flex justify-end mt-4">
//                 <CustomButton
//                   label="Next"
//                   onClick={goToNextStep}
//                   className="cursor-pointer px-8 py-3 bg-purple-600 rounded-full text-white transition duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105"
//                 />
//               </div>
//             </>
//           )}

//           {currentStep === 2 && (
//             <>
//               <h2 className="text-2xl mb-6 font-semibold">
//                 Describe Your Place
//               </h2>
//               <div className="space-y-6">
//                 <div className="flex flex-col space-y-2">
//                   <label htmlFor="title" className="text-sm font-medium">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     id="title"
//                     value={dataTitle}
//                     onChange={(e) => setDataTitle(e.target.value)}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter title for the Property"
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <label htmlFor="description" className="text-sm font-medium">
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     value={dataDescription}
//                     onChange={(e) => setDataDescription(e.target.value)}
//                     className="w-full h-[150px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter Description for the Property"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-between mt-6">
//                 <CustomButton
//                   label="Previous"
//                   onClick={goToPreviousStep}
//                   className="cursor-pointer px-8 py-3 bg-gray-300 rounded-full text-gray-700 transition duration-300 ease-in-out transform hover:bg-gray-400 hover:scale-105"
//                 />
//                 <CustomButton
//                   label="Next"
//                   onClick={goToNextStep}
//                   className="cursor-pointer px-8 py-3 bg-purple-600 rounded-full text-white transition duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105"
//                 />
//               </div>
//             </>
//           )}

//           {currentStep === 3 && (
//             <>
//               <h2 className="text-2xl mb-6 font-semibold">
//                 Details of Your Place
//               </h2>
//               <div className="space-y-6">
//                 <div className="flex flex-col space-y-2">
//                   <label htmlFor="price" className="text-sm font-medium">
//                     Price Per Night
//                   </label>
//                   <input
//                     type="number"
//                     id="price"
//                     placeholder="Enter Price for the Property"
//                     value={dataPrice}
//                     onChange={(e) => setDataPrice(e.target.value)}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <label htmlFor="bedrooms" className="text-sm font-medium">
//                     No of Bedrooms
//                   </label>
//                   <input
//                     type="number"
//                     id="bedrooms"
//                     placeholder="Enter No of Bedrooms"
//                     value={dataBedrooms}
//                     onChange={(e) => setDataBedrooms(e.target.value)}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <label htmlFor="bathrooms" className="text-sm font-medium">
//                     No of Bathrooms
//                   </label>
//                   <input
//                     type="number"
//                     id="bathrooms"
//                     placeholder="Enter No of Bathrooms"
//                     value={dataBathrooms}
//                     onChange={(e) => setDataBathrooms(e.target.value)}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <label htmlFor="guests" className="text-sm font-medium">
//                     No of Guests
//                   </label>
//                   <input
//                     type="number"
//                     id="guests"
//                     placeholder="Enter No of Guests"
//                     value={dataGuests}
//                     onChange={(e) => setDataGuests(e.target.value)}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-between mt-6">
//                 <CustomButton
//                   label="Previous"
//                   onClick={goToPreviousStep}
//                   className="cursor-pointer px-8 py-3 bg-gray-300 rounded-full text-gray-700 transition duration-300 ease-in-out transform hover:bg-gray-400 hover:scale-105"
//                 />
//                 <CustomButton
//                   label="Next"
//                   onClick={goToNextStep}
//                   className="cursor-pointer px-8 py-3 bg-purple-600 rounded-full text-white transition duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105"
//                 />
//               </div>
//             </>
//           )}

//           {currentStep === 4 && (
//             <>
//               <h2 className="text-2xl mb-6 font-semibold">Location</h2>
//               <AddressForm
//                 country={dataCountry}
//                 onCountryChange={setDataCountry}
//                 stateProvince={dataStateProvince}
//                 onStateProvinceChange={setDataStateProvince}
//                 city={dataCity}
//                 onCityChange={setDataCity}
//                 streetAddress={dataStreetAddress}
//                 onStreetAddressChange={setDataStreetAddress}
//                 postalCode={dataPostalCode}
//                 onPostalCodeChange={setDataPostalCode}
//               />
//               <div className="flex justify-between mt-6">
//                 <CustomButton
//                   label="Previous"
//                   onClick={goToPreviousStep}
//                   className="cursor-pointer px-8 py-3 bg-gray-300 rounded-full text-gray-700 transition duration-300 ease-in-out transform hover:bg-gray-400 hover:scale-105"
//                 />
//                 <CustomButton
//                   label="Next"
//                   onClick={goToNextStep}
//                   className="cursor-pointer px-8 py-3 bg-purple-600 rounded-full text-white transition duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105"
//                 />
//               </div>
//             </>
//           )}

//           {currentStep === 5 && (
//             <>
//               <h2 className="text-2xl mb-6 font-semibold">Add Photos</h2>
//               <div className="space-y-6">
//                 <div className="flex flex-col space-y-2">
//                   <label htmlFor="image" className="text-sm font-medium">
//                     Property Image
//                   </label>
//                   <input
//                     type="file"
//                     id="image"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         setDataImage(file);
//                       }
//                     }}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 {dataImage && (
//                   <div className="relative w-full h-[200px]">
//                     <Image
//                       src={URL.createObjectURL(dataImage)}
//                       alt="Property Preview"
//                       fill
//                       className="object-cover rounded-xl"
//                     />
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-between mt-6">
//                 <CustomButton
//                   label="Previous"
//                   onClick={goToPreviousStep}
//                   className="cursor-pointer px-8 py-3 bg-gray-300 rounded-full text-gray-700 transition duration-300 ease-in-out transform hover:bg-gray-400 hover:scale-105"
//                 />
//                 <CustomButton
//                   label="Submit"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="cursor-pointer px-8 py-3 bg-purple-600 rounded-full text-white transition duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                 />
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </>
//   );

//   return (
//     <Modal
//       isOpen={addPropertyModal.isOpen}
//       close={() => {
//         addPropertyModal.close();
//         resetForm();
//       }}
//       label="Add Property"
//       content={content}
//     />
//   );
// };

// export default AddPropertyModal;
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
      content={content}
      className="max-w-3xl"
    />
  );
};

export default AddPropertyModal;
