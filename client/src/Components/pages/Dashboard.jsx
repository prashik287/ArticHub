import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Dashboard = ({ setUserdata }) => {
  const [userdata, setUserdataLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:9000/login/success", { withCredentials: true });
        if (response.data.user) {
          setUserdataLocal(response.data.user);
          setUserdata(response.data.user); // Update global userdata
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate, setUserdata]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userdata?.displayname || userdata?.email || "User"}</p>
    </div>
  );
};
