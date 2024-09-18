import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="relative text-center text-white">
        <h1 className="text-9xl font-extrabold">404</h1>
        <p className="mt-4 text-2xl">Oops! Page Not Found</p>
        <p className="mt-2 text-lg">The page you’re looking for doesn’t exist.</p>

        <Link
          to="/"
          className="inline-block relative z-10 px-6 py-3 mt-8 font-semibold text-white bg-pink-500 rounded-full shadow-lg transition-colors hover:bg-pink-600"
        >
          Go Back Home
        </Link>

        <div className="absolute -left-16 -top-20 w-72 h-72 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -right-16 -top-20 w-72 h-72 bg-green-400 rounded-full opacity-30 delay-200 animate-pulse"></div>
        <div className="absolute -left-16 -bottom-20 w-72 h-72 bg-pink-400 rounded-full opacity-30 animate-pulse delay-400"></div>
        <div className="absolute -right-16 -bottom-20 w-72 h-72 bg-blue-400 rounded-full opacity-30 animate-pulse delay-600"></div>
      </div>
    </div>
  );
};

export default NotFound;
