"use client";
import Modal from "./Modal";
import CustomButton from "../forms/CustomButton";
import { useState } from "react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/action";

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const submitLogin = async () => {
    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await apiService.postWithoutToken(
        "/api/auth/login/",
        JSON.stringify(formData)
      );

      if (response.access) {
        console.log("Login Success:", {
          userId: response.user.pk,
          access: response.access,
          refresh: response.refresh,
        });
        // await handleLogin(response.user.pk, response.access, response.refresh);
        // localStorage.setItem("session_access_token", response.access);
        // localStorage.setItem("session_refresh_token", response.refresh);
        // localStorage.setItem("session_userid", response.user.pk);
        // console.log("Tokens stored in localStorage:", {
        //   access: localStorage.getItem("session_access_token"),
        //   refresh: localStorage.getItem("session_refresh_token"),
        //   userId: localStorage.getItem("session_userid"),
        // });
        loginModal.close();
        router.push("/");
      } else {
        const tmpErrors: string[] = [];
        if (response.non_field_errors) tmpErrors.push(...response.non_field_errors);
        if (response.email) tmpErrors.push("The email address is not registered.");
        if (response.password) tmpErrors.push("Incorrect password. Please try again.");
        if (tmpErrors.length === 0) tmpErrors.push("Unable to login. Please check your credentials.");
        setErrors(tmpErrors);
      }
    } catch (error: any) {
      const errorMessage =
        error.message.includes("400") && error.message.includes("email")
          ? "Incorrect email or password."
          : "An error occurred during login. Please try again later.";
      setErrors([errorMessage]);
    }
  };

  const content = (
    <form onSubmit={(e) => { e.preventDefault(); submitLogin(); }} className="space-y-4">
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Your e-mail address"
        type="email"
        className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
      />
      <div className="relative">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Your password"
          type={showPassword ? "text" : "password"}
          className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
        />
        {password && (
          <svg
            onClick={() => setShowPassword((prev) => !prev)}
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
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
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
      <CustomButton label="Submit" type="submit" />
    </form>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      close={loginModal.close}
      label="Log in"
      content={content}
      closeOnOutsideClick={false} // Explicitly disable outside click closing
    />
  );
};

export default LoginModal;
