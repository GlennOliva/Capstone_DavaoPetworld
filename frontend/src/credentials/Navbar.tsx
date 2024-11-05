import '../css/styles.css'; // Import your CSS for styling
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import logo from '../images/davao-petworld-logo.png'
const Navbar: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  useEffect(() => {


    // Handle hamburger menu
    const hamburger = document.querySelector(".hamburger") as HTMLDivElement | null;
    const navList = document.querySelector(".nav-list") as HTMLUListElement | null;

    if (hamburger && navList) {
      const handleHamburgerClick = () => {
        navList.classList.toggle("open");
      };
      hamburger.addEventListener("click", handleHamburgerClick);

      // Cleanup
      return () => {
        hamburger.removeEventListener("click", handleHamburgerClick);
      };
    }

    // Handle popup
    const popup = document.querySelector(".popup") as HTMLDivElement | null;
    const closePopup = document.querySelector(".popup-close") as HTMLButtonElement | null;

    if (popup && closePopup) {
      const handleClosePopupClick = () => {
        popup.classList.add("hide-popup");
      };

      closePopup.addEventListener("click", handleClosePopupClick);

      window.addEventListener("load", () => {
        setTimeout(() => {
          popup.classList.remove("hide-popup");
        }, 1000);
      });

      // Cleanup
      return () => {
        closePopup.removeEventListener("click", handleClosePopupClick);
      };
    }

  }, []);

  return (
    <header className="header" id="header">
      <div className="navigation">
        <div className="nav-center container1 d-flex">
          <img src={logo} className="logo" alt="logo" />

          <ul className="nav-list d-flex">
            <li className="nav-item">
              <a href="#home"  className="nav-link">Home</a>
            </li>
            <li className="nav-item">
            <a href="#about"  className="nav-link">About</a>
            </li>
            <li className="nav-item">
            <a href="#services"  className="nav-link">Services</a>
            </li>
            <li className="nav-item">
            <a href="#clients"  className="nav-link">Clients</a>
            </li>

            <li className="nav-item">
            <a href="#location"  className="nav-link">Location</a>
            </li>
          </ul>

          <div className="icons d-flex">
          
            <div className="icon user-icon" onClick={togglePopup}>
              <i className="bx bx-user"></i>
            </div>

  

            {isPopupVisible && (
              <div className="user-popup">
        <Link to="/login" style={{ textDecoration: 'none' }}>
  <button 
    className="login-signup-btn" 
    onClick={togglePopup} // If you still need this functionality, keep it
    style={{
      backgroundColor: 'white', 
      border: '1px solid #ccc', 
      padding: '10px 20px', 
      borderRadius: '5px', 
      cursor: 'pointer',
      color: '#000',
    }}
  >
    LOGIN / SIGNUP
  </button>
</Link>

              </div>
            )}
          </div>

          <div className="hamburger">
            <i className="bx bx-menu-alt-left"></i>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
