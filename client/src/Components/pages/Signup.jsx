import { useState, useEffect } from "react";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EmailValidator from "email-validator";
import bg from "./images/signup-bg.jpg";

export const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    typeofacc: "buyer",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [resp, setResp] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("redirect")) {
      // setIsModalOpen(true);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Email validation
    if (name === "email") {
      if (EmailValidator.validate(value)) {
        setEmailError("");
      } else {
        setEmailError("Invalid email address");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError) {
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/user/register",
        formData
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setResp(error.response?.data?.message || "An error occurred");
      setIsModal1Open(true);
    }
  };

  const loginwithgoogle = (e) => {
    e.preventDefault();
    window.open("http://localhost:9000/auth/google/callback", "_self");
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden relative p-8 w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md rounded-lg border border-gray-300 shadow-lg sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Signup
        </h1>

        {/* Email Input */}
        <div className="relative mb-4">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`px-4 py-2 w-full bg-transparent rounded-md border ${
              emailError ? "border-red-500" : "border-gray-300"
            } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-black`}
            required
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        {/* First Name Input */}
        <div className="relative mb-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="px-4 py-2 w-full bg-transparent rounded-md border border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-black"
            required
          />
        </div>

        {/* Last Name Input */}
        <div className="relative mb-4">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="px-4 py-2 w-full bg-transparent rounded-md border border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-black"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-4 py-2 w-full bg-transparent rounded-md border border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-black"
            required
          />
        </div>

        {/* Account Type Select */}
        <div className="relative mb-4">
          <label htmlFor="typeofacc" className="block mb-2 font-medium text-white">
            Account Type:
          </label>
          <select
            name="typeofacc"
            id="typeofacc"
            value={formData.typeofacc}
            onChange={handleChange}
            className="block px-4 py-2 w-full bg-transparent rounded-md border shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-black"
            required
          >
            <option value="buyer">Customer</option>
            <option value="seller">Merchant</option>
          </select>
        </div>

        <button
          type="submit"
          className="py-2 w-full font-bold text-white bg-pink-500 rounded-md shadow-md transition-colors duration-300 hover:bg-pink-600"
        >
          Sign Up
        </button>

        {/* Horizontal line */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-600">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={loginwithgoogle}
            className="flex justify-center items-center py-2 font-bold text-white bg-red-500 rounded-md shadow-md transition-colors duration-300 hover:bg-red-600"
          >
            <FaGoogle className="mr-2" /> Login with Google
          </button>
        </div>

        <div className="p-4">
          <p>
            <span className="font-bold">Already Have an Account?</span>{" "}
            <span className="font-bold text-blue-500">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </form>

      {/* Modal for Invalid Email */}
      {isModalOpen && (
        <div className="flex fixed inset-0 justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-red-600">Invalid Email</h2>
            <p className="mb-4 text-gray-800">Please enter a valid email address.</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 font-bold text-white bg-pink-500 rounded-md shadow-md transition-colors duration-300 hover:bg-pink-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Error */}
      {isModal1Open && (
        <div className="flex fixed inset-0 justify-center items-center bg-gray-800 bg-opacity-70">
          <div className="p-8 bg-white rounded-lg shadow-xl transition-transform duration-300 transform scale-100 hover:scale-105">
            <h2 className="pb-4 mb-6 text-2xl font-bold text-gray-800 border-b-2 border-pink-500">
              {typeof resp === "string" ? resp : "An unexpected error occurred"}
            </h2>
            <div className="flex gap-4 justify-center items-center mb-6">
              <button
                className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="px-6 py-3 font-semibold text-white bg-red-600 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => setIsModal1Open(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
