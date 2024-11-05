import '../css/styles.css'; // Import your CSS for styling
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/davao-petworld-logo.png';
import axios from 'axios';

const Navbar: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0); // State to hold cart count
  const [userProfile, setUserProfile] = useState<{ image: string; first_name: string; last_name: string; id: number; } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu visibility

  // Toggle popup visibility
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetch(`http://localhost:8081/user/${userId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => setUserProfile(data[0] || null)) // Assuming the response is an array
        .catch(err => console.log(err));
    } else {
      console.log("User ID not found in local storage");
    }
  }, []);

  const fetchCartCount = async () => {
    const userId = localStorage.getItem('user_id'); 
    try {
      if (!userId) {
        console.error('No user_id found in localStorage');
        return;
      }
  
      const response = await axios.get(`http://localhost:8081/cart_count`, {
        params: { user_id: userId },
      });
  
      const data = response.data;
      console.log('Response from cart_count:', data); 
  
      if (typeof data.count === 'number') {
        setCartCount(data.count);
      } else {
        console.error('Expected a count number but got:', data);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };
  
  // Call fetchCartCount when the component mounts
  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <header className="header" id="header">
      <div className="navigation">
        <div className="nav-center container1 d-flex">
          <img src={logo} className="logo" alt="logo" />
          
          <div className={`nav-list d-flex ${isMenuOpen ? 'open' : ''}`}> {/* Add a class for open menu */}
            <li className="nav-item">
              <Link to={`/ecommerce/${userProfile?.id}`} className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/product" className="nav-link">Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/home" className="nav-link">Social</Link>
            </li>
            <li className="nav-item">
              <Link to="/fish_identify" className="nav-link">Fish Identification</Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="nav-link">Orders</Link>
            </li>
          </div>

          <div className="icons d-flex">
            <Link to="/cart" className="icon">
              <i className="bx bx-cart"></i>
              <span className="d-flex">{cartCount}</span> {/* Display cart count */}
            </Link>
            <div className="icon user-icon" onClick={togglePopup}>
              <i className="bx bx-user"></i>
            </div>

            {isPopupVisible && (
              <div className="user-popup">
                <p>Welcome, {userProfile?.first_name}</p>
                <Link to="/profile" className="popup-link">Profile</Link>
                <Link to="/login" className="popup-link">Logout</Link>
              </div>
            )}
          </div>

          <div className="hamburger" onClick={toggleMenu}> {/* Call toggleMenu on click */}
            <i className="bx bx-menu-alt-left"></i>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
