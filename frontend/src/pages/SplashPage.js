import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const SplashPage = () => {
  const [dotCount, setDotCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    const redirectTimeout = setTimeout(() => {
      const loaderContainer = document.querySelector('.loader-container');
      if (loaderContainer) {
        loaderContainer.classList.add('fade-out');
      }
      setTimeout(() => {
        navigate('/home');
      }, 500);
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="loader-container">
      <img className="logo" src={logo} alt="Beyond The ARC logo" />
      <h1>Beyond The ARC</h1>
      <div className="spinner"></div>
      <div className="loading-text">
        Loading<span className="dots">{'.'.repeat(dotCount)}</span>
      </div>
    </div>
  );
};

export default SplashPage;