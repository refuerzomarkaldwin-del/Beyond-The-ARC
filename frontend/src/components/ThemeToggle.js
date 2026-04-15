import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isLight = savedTheme === 'light';
    setIsLightMode(isLight);
    document.body.classList.toggle('light-mode', isLight);
  }, []);

  const toggleTheme = () => {
    const newIsLightMode = !isLightMode;
    setIsLightMode(newIsLightMode);
    document.body.classList.toggle('light-mode', newIsLightMode);
    localStorage.setItem('theme', newIsLightMode ? 'light' : 'dark');
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isLightMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggle;