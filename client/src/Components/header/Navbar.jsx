import React, { useEffect, useState } from 'react';
import { FaArtstation, FaCartArrowDown } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";
import axios from 'axios';
import { HiMenu } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import defaultacc from '../pages/images/default-acc.png'

const Navbar = ({ selectedCurrency, setSelectedCurrency, userdata: userData, setUserdata }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const currencies = [
    { code: "INR", countryCode: "IN", label: "INR" },
    { code: "USD", countryCode: "US", label: "USD" },
    { code: "EUR", countryCode: "EU", label: "EUR" },
    { code: "GBP", countryCode: "GB", label: "GBP" },
    { code: "JPY", countryCode: "JP", label: "JPY" },
    { code: "AUD", countryCode: "AU", label: "AUD" },
  ];

  useEffect(() => {
    getUser();
  }, []); // Fetch user data once on mount

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:9000/login/success", { withCredentials: true });
      if (response.data.user) {
        setUserdata(response.data.user); // Update userdata directly
      } else {
        setUserdata(null); // Clear userdata if no user found
      }
    } catch (error) {
      console.error(error);
      setUserdata(null); // Clear userdata on error
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignout = async () => {
    try {
      const response = await axios.get("http://localhost:9000/logout", { withCredentials: true });
      if (response.status === 200) {
        setUserdata(null); // Reset userdata on signout
        navigate('/login');
      }
    } catch (error) {
      console.error('Error signing out:', error.response ? error.response.data : error.message);
      navigate('/login');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const getFlagEmoji = (countryCode) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  return (
    <>
      <div className='hidden sticky top-0 z-50 justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg md:flex'>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <FaArtstation className='text-6xl text-blue-400' style={{ position: 'absolute', top: 0, left: 0 }} />
            <FaArtstation className='text-6xl text-yellow-400' style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
          <p className='text-4xl font-extrabold tracking-wide text-white'>ArticHub</p>
        </div>

        <div className='flex flex-1 justify-center items-center mx-auto max-w-4xl'>
          <div className="flex overflow-hidden w-full bg-white rounded-full shadow-lg">
            <div className="flex justify-center items-center px-4 bg-gray-100 border-r border-gray-300">
              <select
                name="categories"
                id="categories"
                className="font-medium text-gray-800 bg-transparent outline-none"
              >
                <option value="All Categories">All Categories</option>
                <option value="Art">Paintings</option>
                <option value="Photography">Photography</option>
                <option value="Sculpture">Sculpture</option>
              </select>
            </div>
            <input
              type="text"
              className="px-4 py-2 w-full font-medium placeholder-gray-400 text-gray-800 outline-none"
              placeholder="Search for art, designs, and more..."
            />
            <button className="px-6 py-2 font-medium text-white bg-green-500 rounded-r-full transition-colors hover:bg-green-600">
              <CiSearch className='text-2xl' />
            </button>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='relative p-2'>
            <select
              name="currencies"
              id="currencies"
              className="flex items-center px-3 py-2 space-x-2 font-medium text-gray-800 bg-white rounded-md border border-gray-300 outline-none"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
            >
              {currencies.map(({ code, countryCode, label }) => (
                <option key={code} value={code} className="flex items-center space-x-2">
                  {getFlagEmoji(countryCode)} {label}
                </option>
              ))}
            </select>
          </div>
          <div className='p-2'>
            <button className='px-4 py-2 text-2xl text-white bg-pink-500 rounded-full transition-colors hover:bg-pink-600'>
              <FaCartArrowDown />
            </button>
          </div>
          {
            userData ? ( // Check if userData is not null
              <div className='relative'>
                <button
                  className='flex items-center px-6 py-2 space-x-2 text-white bg-pink-500 rounded-full transition-colors hover:bg-pink-600'
                  onClick={handleDropdownToggle}
                >
                  <img 
                    src={userData?.image || defaultacc} 
                    alt="User Avatar" 
                    className="object-cover w-8 h-8 rounded-full"
                  />
                  <span>{userData?.email}</span>
                </button>
                {showDropdown && (
                  <div className='absolute right-0 py-2 mt-2 w-48 bg-white rounded-md shadow-lg'>
                    <button className='block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-200'>
                      Profile
                    </button>
                    <button
                      className='block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-200'
                      onClick={handleSignout}
                    >
                      Signout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleLoginRedirect} className='px-6 py-2 text-white bg-pink-500 rounded-full transition-colors hover:bg-pink-600'>
                Login
              </button>
            )
          }
        </div>
      </div>

      {/* Mobile Menu */}
      <div className='flex sticky p-4 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg md:hidden'>
        <div className='flex flex-1 items-center space-x-4'>
          <div className='flex flex-wrap'>
            <div className='p-4 text-xl font-bold text-white'>
              {menuOpen ? (
                <IoIosClose className='text-3xl cursor-pointer' onClick={() => setMenuOpen(false)} />
              ) : (
                <HiMenu className='text-3xl cursor-pointer' onClick={() => setMenuOpen(true)} />
              )}
            </div>
            <div className='p-3'>
              <FaArtstation className='text-3xl text-blue-400' style={{ position: 'relative', zIndex: 1 }} />
            </div>
          </div>
          <h4 className='text-xl font-bold text-white'>ARTICHUB</h4>
        </div>
        <div className='flex items-center'>
          <div className='px-3'>
            <FaCartArrowDown className='text-3xl text-white' />
          </div>
          <MdOutlineAccountCircle className='text-3xl text-white' />
        </div>
      </div>

      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className='fixed inset-0 z-40 bg-white shadow-lg'>
          <div className='p-6'>
            <div className='flex justify-end'>
              <IoIosClose className='text-3xl cursor-pointer' onClick={() => setMenuOpen(false)} />
            </div>
            <div className='mt-8'>
              <ul className='space-y-4'>
                <li>
                  <Link to="/" className='text-xl text-gray-800 hover:text-gray-600'>Home</Link>
                </li>
                <li>
                  <Link to="/about" className='text-xl text-gray-800 hover:text-gray-600'>About</Link>
                </li>
                <li>
                  <Link to="/contact" className='text-xl text-gray-800 hover:text-gray-600'>Contact</Link>
                </li>
                <li>
                  <Link to="/shop" className='text-xl text-gray-800 hover:text-gray-600'>Shop</Link>
                </li>
                <li>
                  <Link to="/cart" className='text-xl text-gray-800 hover:text-gray-600'>Cart</Link>
                </li>
                {userData ? (
                  <>
                    <li>
                      <Link to="/profile" className='text-xl text-gray-800 hover:text-gray-600'>Profile</Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignout}
                        className='text-xl text-gray-800 hover:text-gray-600'
                      >
                        Signout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      onClick={handleLoginRedirect}
                      className='text-xl text-gray-800 hover:text-gray-600'
                    >
                      Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
