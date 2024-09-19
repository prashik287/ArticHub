import React, { useEffect, useState } from 'react';
import { FaArtstation, FaCartArrowDown } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";
import axios from 'axios';
import { HiMenu } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import defaultacc from '../pages/images/default-acc.png';

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
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:9000/login/success", { withCredentials: true });
      if (response.data.user) {
        setUserdata(response.data.user);
        setShowDropdown(false);
      } else {
        setUserdata(null);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error(error);
      setUserdata(null);
      setShowDropdown(false);
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown(prev => !prev);
  };

  const handleSignout = async () => {
    try {
      setMenuOpen(false);
      const response = await axios.get("http://localhost:9000/logout", { withCredentials: true });
      if (response.status === 200) {
        setUserdata(null);
        setShowDropdown(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error signing out:', error.response ? error.response.data : error.message);
      setShowDropdown(false);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Desktop Menu */}
      <div className='hidden sticky top-0 z-50 justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg md:flex'>
        <Link to="/">
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <FaArtstation className='text-6xl text-blue-400' style={{ position: 'absolute', top: 0, left: 0 }} />
              <FaArtstation className='text-6xl text-yellow-400' style={{ clipPath: 'inset(0 50% 0 0)' }} />
            </div>
            <p className='text-4xl font-extrabold tracking-wide text-white'>ArticHub</p>
          </div>
        </Link>

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
          {userData ? (
            <div className='relative dropdown-container'>
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
          )}
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
            <div className='flex '>
              <div className='p-3'>
                <FaArtstation className='text-3xl text-blue-400' style={{ position: 'relative', zIndex: 1 }} />
              </div>
            </div>
            <h4 className='text-xl font-bold text-white mt-4'>ARTICHUB</h4>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className='fixed inset-0 z-50 flex flex-col p-6 space-y-4 bg-white shadow-lg md:hidden'>
          <div className='flex justify-between items-center'>
            <div className='text-2xl font-bold'>                <FaArtstation className='text-3xl text-blue-400' style={{ position: 'relative', zIndex: 1 }} onClick={e =>{
              navigate('/')
              setMenuOpen(false)
            }} />
            </div>
            <IoIosClose className='text-4xl cursor-pointer' onClick={() => setMenuOpen(false)} />
          </div>

          {/* Search bar in mobile */}
          <div className='flex overflow-hidden w-full bg-white rounded-full shadow-lg'>
 
            <input
              type="text"
              className="px-4 py-2 w-full font-medium placeholder-gray-400 text-gray-800 outline-none"
              placeholder="Search for art, designs, and more..."
            />
            <button className="px-6 py-2 font-medium text-white bg-green-500 rounded-r-full transition-colors hover:bg-green-600">
              <CiSearch className='text-2xl' />
            </button>
          </div>

          {/* Currency selector inside mobile menu */}
          <div className='relative'>
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

          {/* Additional menu items */}
          {userData ? (
            <div className='relative dropdown-container'>
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
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
