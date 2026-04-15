import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Beyond The ARC" />
          </Link>
          <Link to="/" className="logo-text">Beyond The ARC</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          
          {/* Game - Only show for regular users (members), NOT for admin */}
          {user && user.role !== 'admin' && <Link to="/game">Game</Link>}
          
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/create-post">Write Post</Link>
              <Link to="/profile">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin">Admin</Link>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;