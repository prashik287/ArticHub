import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import bgImage from './images/bg-login.jpg';

export const Login = ({ setUserdata }) => { // Destructure setUserdata from props
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acctype: 'buyer',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:9000/login', formData, { withCredentials: true });
      if (response.status === 200 && response.data.user) {
        alert("Login Successful");
        setUserdata(response.data.user); // Update userdata here
        navigate('/dashboard');
      } else {
        console.error('Login failed:', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  const loginWithGoogle = (e) => {
    e.preventDefault();
    window.open('http://localhost:9000/auth/google', '_self');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden relative p-8 w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md rounded-lg border border-gray-300 shadow-lg sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <h1 className="mb-6 text-2xl font-bold text-center text-black">Login</h1>

        {['email', 'password'].map((field) => (
          <div key={field} className="relative mb-4">
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="px-4 py-2 w-full bg-transparent rounded-md border border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black placeholder-black"
              required
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 opacity-30 pointer-events-none"></div>
          </div>
        ))}

        <div className="relative mb-4">
          <select
            name="acctype"
            onChange={handleChange}
            value={formData.acctype}
            className="px-4 py-2 w-full bg-transparent bg-opacity-30 rounded-md border border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="buyer">Customer</option>
            <option value="seller">Merchant</option>
          </select>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 opacity-30 pointer-events-none"></div>
        </div>

        <button
          type="submit"
          className="py-2 w-full font-bold text-white bg-pink-500 rounded-md shadow-md transition-colors duration-300 hover:bg-pink-600"
        >
          Login
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-600">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={loginWithGoogle}
            className="flex justify-center items-center py-2 font-bold text-white bg-red-500 rounded-md shadow-md transition-colors duration-300 hover:bg-red-600"
          >
            <FaGoogle className="mr-2" /> Login with Google
          </button>
        </div>

        <div className="p-4">
          <p>
            <span className="font-bold">Don't Have an Account?</span>
            <span className="p-4 font-bold text-blue-500">
              <Link to="/signup">Signup</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
