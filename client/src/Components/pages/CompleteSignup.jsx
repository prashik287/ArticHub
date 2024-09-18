import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CompleteSignup = () => {
    const [selectedAccountType, setSelectedAccountType] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/complete-signup', {
                accountType: selectedAccountType
            }, { withCredentials: true });

            console.log(response.data);
            navigate('/'); // Redirect to the home page

        } catch (error) {
            console.error("Error updating account type:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-gray-800">Sign in as :</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <select 
                            onChange={(e) => setSelectedAccountType(e.target.value)} 
                            value={selectedAccountType}
                            className="block px-4 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">Select Account Type</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    <button 
                        type="submit"
                        className="px-4 py-2 w-full font-bold text-white bg-pink-500 rounded-md shadow-md transition-colors duration-300 hover:bg-pink-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteSignup;
