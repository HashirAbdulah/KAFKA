"use client";
import Image from "next/image";
import Modal from "./Modal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import CustomButton from "../forms/CustomButton";
import Categories from "../addProperty/Categories";
import { ChangeEvent, useState } from "react";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";

const AddPropertyModal = () => {
  const router = useRouter();
  const addPropertyModal = useAddPropertyModal();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [dataCategory, setDataCategory] = useState("");
  const [dataTitle, setDataTitle] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataPrice, setDataPrice] = useState("");
  const [dataBedrooms, setDataBedrooms] = useState("");
  const [dataBathrooms, setDataBathrooms] = useState("");
  const [dataGuests, setDataGuests] = useState("");
  const [dataCountry, setDataCountry] = useState<SelectCountryValue | null>(null);
  const [dataImage, setDataImage] = useState<File | null>(null);

  const setCategory = (category: string) => {
    setDataCategory(category);
  };

  const setImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const tmpImage = event.target.files[0];
      setDataImage(tmpImage);
    }
  };

  const submitForm = async () => {
    console.log("submitted");
    const token = localStorage.getItem("session_access_token");
    console.log("Token in AddPropertyModal:", token); // Debug log
    if (!token) {
      setErrors(["You must be logged in to add a property. Please log in first."]);
      router.push("/"); // Redirect to login page
      return;
    }

    if (
      dataCategory &&
      dataTitle &&
      dataDescription &&
      dataPrice &&
      dataBedrooms &&
      dataBathrooms &&
      dataGuests &&
      dataCountry &&
      dataImage
    ) {
      const formData = new FormData();
      formData.append("category", dataCategory);
      formData.append("title", dataTitle);
      formData.append("description", dataDescription);
      formData.append("price_per_night", dataPrice);
      formData.append("bedrooms", dataBedrooms);
      formData.append("bathrooms", dataBathrooms);
      formData.append("guests", dataGuests);
      formData.append("country", dataCountry.label);
      formData.append("country_code", dataCountry.value);
      formData.append("image", dataImage);

      try {
        const response = await apiService.post("/api/properties/create/", formData);
        if (response.success) {
          console.log("SUCCESS");
          router.push(`/properties/${response.id}`);
          addPropertyModal.close();
        } else {
          const tmpErrors: string[] = response.errors
            ? Object.values(response.errors).flatMap((err: any) => err)
            : ["An unexpected error occurred"];
          setErrors(tmpErrors);
        }
      } catch (error: any) {
        console.error("API Error:", error.message);
        setErrors([error.message || "Something went wrong while submitting the property."]);
      }
    } else {
      setErrors(["Please fill in all required fields."]);
    }
  };

  const content = (
    <>
      {currentStep === 1 ? (
        <>
          <h2 className="mb-6 text-2xl font-semibold">Choose Category</h2>
          <Categories dataCategory={dataCategory} setCategory={setCategory} />
          <div className="flex justify-end mt-4">
            <CustomButton label="Next" onClick={() => setCurrentStep(2)} />
          </div>
        </>
      ) : currentStep === 2 ? (
        <>
          <h2 className="text-2xl mb-6 font-semibold">Describe Your Place</h2>
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter title for the Property"
                value={dataTitle}
                onChange={(e) => setDataTitle(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter Description for the Property"
                value={dataDescription}
                onChange={(e) => setDataDescription(e.target.value)}
                className="w-full h-[150px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-between mt-6 gap-5">
            <CustomButton
              label="Previous"
              onClick={() => setCurrentStep(1)}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            />
            <CustomButton label="Next" onClick={() => setCurrentStep(3)} />
          </div>
        </>
      ) : currentStep === 3 ? (
        <>
          <h2 className="text-2xl mb-6 font-semibold">Details of Your Place</h2>
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
          <div className="flex justify-between mt-6 gap-5">
            <CustomButton
              label="Previous"
              onClick={() => setCurrentStep(2)}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            />
            <CustomButton label="Next" onClick={() => setCurrentStep(4)} />
          </div>
        </>
      ) : currentStep === 4 ? (
        <>
          <h2 className="text-2xl mb-6 font-semibold">Location</h2>
          <div className="space-y-4 pb-6 pt-3">
            <SelectCountry
              value={dataCountry}
              onChange={(value) => setDataCountry(value as SelectCountryValue | null)}
            />
          </div>
          <div className="flex justify-between mt-6 gap-5">
            <CustomButton
              label="Previous"
              onClick={() => setCurrentStep(3)}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            />
            <CustomButton label="Next" onClick={() => setCurrentStep(5)} />
          </div>
        </>
      ) : currentStep === 5 ? (
        <>
          <h2 className="text-2xl mb-6 font-semibold">Upload an Image</h2>
          <div className="pt-3 pb-6 space-y-4">
            <div className="py-4 px-6 bg-gray-600 text-white rounded-xl">
              <input type="file" accept="image/*" onChange={setImage} />
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
          <div className="flex justify-between mt-6 gap-5">
            <CustomButton
              label="Previous"
              onClick={() => setCurrentStep(4)}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            />
            <CustomButton label="Next" onClick={() => setCurrentStep(6)} />
          </div>
        </>
      ) : currentStep === 6 ? (
        <>
          <h2 className="text-2xl mb-6 font-semibold">Review and Submit</h2>
          <div className="space-y-6">
            <p>Category: {dataCategory}</p>
            <p>Title: {dataTitle}</p>
            <p>Description: {dataDescription}</p>
            <p>Price: {dataPrice}</p>
            <p>Bedrooms: {dataBedrooms}</p>
            <p>Bathrooms: {dataBathrooms}</p>
            <p>Guests: {dataGuests}</p>
            <p>Country: {dataCountry?.label || "Not selected"}</p>
            {errors.length > 0 && (
              <div className="p-4 bg-red-100 text-red-700 rounded-xl">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between mt-6 gap-5">
            <CustomButton
              label="Previous"
              onClick={() => setCurrentStep(5)}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            />
            <CustomButton
              label="Submit"
              onClick={submitForm}
              className="bg-green-600 hover:bg-green-700 text-white"
            />
          </div>
        </>
      ) : null}
    </>
  );

  return (
    <Modal
      isOpen={addPropertyModal.isOpen}
      close={addPropertyModal.close}
      label="Add Property"
      content={content}
    />
  );
};

export default AddPropertyModal;
