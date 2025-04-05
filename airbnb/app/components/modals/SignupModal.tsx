"use client";

import Modal from "./Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSignupModal from "@/app/hooks/useSignupModal";
import CustomButton from "../forms/CustomButton";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/action";

const SignupModal = () => {
  const router = useRouter();
  const signupModal = useSignupModal();
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const submitSignup = async () => {
    const formData = {
      email: email,
      password1: password1,
      password2: password2,
    };

    try {
      const response = await apiService.postWithoutToken(
        "/api/auth/register/",
        JSON.stringify(formData)
      );

      if (response.access) {
        handleLogin(response.user.pk, response.access, response.refresh);
        signupModal.close();
        router.push("/");
      } else {
        const tmpErrors: string[] = [];
        if (response.email) tmpErrors.push(...response.email);
        if (response.password1) tmpErrors.push(...response.password1);
        if (response.password2) tmpErrors.push(...response.password2);
        if (tmpErrors.length === 0) tmpErrors.push("An unexpected error occurred.");
        setErrors(tmpErrors);
      }
    } catch (error: any) {
      const errorMessage =
        error.message.includes("400") && error.message.includes("email")
          ? "This email is already registered."
          : "An error occurred during signup. Please try again.";
      setErrors([errorMessage]);
    }
  };

  const content = (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSignup();
        }}
        className="space-y-4"
      >
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your e-mail address"
          type="email"
          className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
        />

        <div className="relative">
          <input
            onChange={(e) => setPassword1(e.target.value)}
            placeholder="Your password"
            type={showPassword1 ? "text" : "password"}
            className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
          />
          {password1 && (
           <svg
           onClick={() => setShowPassword1((prev) => !prev)}
           xmlns="http://www.w3.org/2000/svg"
           width="24"
           height="24"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
           strokeWidth="2"
           className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer w-6 h-6 text-gray-600 hover:text-blue-500 transition duration-200"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             d="M1 12s3.5-8 11-8 11 8 11 8-3.5 8-11 8-11-8-11-8z"
           />
           <circle
             cx="12"
             cy="12"
             r="3"
             stroke="currentColor"
             strokeWidth="2"
           />
         </svg>
          )}
        </div>

        <div className="relative">
          <input
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Repeat password"
            type={showPassword2 ? "text" : "password"}
            className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
          />
          {password2 && (
            <svg
            onClick={() => setShowPassword2((prev) => !prev)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer w-6 h-6 text-gray-600 hover:text-blue-500 transition duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M1 12s3.5-8 11-8 11 8 11 8-3.5 8-11 8-11-8-11-8z"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          )}
        </div>

        {errors.map((error, index) => (
          <div
            key={`error_${index}`}
            className="p-5 bg-airbnb text-white rounded-xl opacity-80"
          >
            {error}
          </div>
        ))}
        <CustomButton label="Submit" onClick={submitSignup} />
      </form>
    </>
  );

  return (
    <Modal
      isOpen={signupModal.isOpen}
      close={signupModal.close}
      label="Sign up"
      content={content}
    />
  );
};

export default SignupModal;
