import React, { useState, useEffect } from 'react';

export const Home = ({ selectedCurrency }) => {
  const [prices, setPrices] = useState({
    USD: 1,
    INR: 75,
    EUR: 0.85,
    GBP: 0.72,
    JPY: 110,
    AUD: 1.3
  });

  const [convertedPrice, setConvertedPrice] = useState(prices[selectedCurrency]);

  useEffect(() => {
    setConvertedPrice(prices[selectedCurrency]);
  }, [selectedCurrency]);

  return (
    <div>
      <h1>Welcome to ArtisticHub</h1>
      <p>Selected Currency: {selectedCurrency}</p>
      <p>Price: {convertedPrice} {selectedCurrency}</p>
    </div>
  );
};

export default Home;
