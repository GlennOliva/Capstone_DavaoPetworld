import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // Get current location


  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    
    // Redirect to the login page or another account page
    window.location.href = '/login'; // Adjust this path as necessary
  };

 

  return (
    <div>
      
      <ul className="side-menu">
        <li>
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            <i className='bx bxs-dashboard icon'></i> Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/manage_admin"
            className={location.pathname === '/manage_admin' ? 'active' : ''}
          >
            <i className='bx bxs-user icon'></i> Manage Admin
          </Link>
        </li>

        <li>
          <Link
            to="/manage_user"
            className={location.pathname === '/manage_user' ? 'active' : ''}
          >
            <i className='bx bxs-user-plus icon'></i> Manage User
          </Link>
        </li>

        <li>
          <Link
            to="/manage_post"
            className={location.pathname === '/manage_post' ? 'active' : ''}
          >
            <i className='bx bxs-note icon'></i> Manage Post
          </Link>
        </li>

        <li>
          <Link
            to="/manage_product"
            className={location.pathname === '/manage_product' ? 'active' : ''}
          >
            <i className='bx bxs-box icon'></i> Manage Products
          </Link>
        </li>

        <li>
          <Link
            to="/manage_category"
            className={location.pathname === '/manage_category' ? 'active' : ''}
          >
            <i className='bx bxs-category icon'></i> Manage Category
          </Link>
        </li>

        <li>
          <Link
            to="/manage_order"
            className={location.pathname === '/manage_order' ? 'active' : ''}
          >
            <i className='bx bxs-cart icon'></i> Manage Orders
          </Link>
        </li>

        {/* Logout Link */}
        <li>
          <Link
            to="/login" // Change this to your desired login page path
            onClick={handleLogout} // Call logout function on click
          >
            <i className='bx bxs-log-out icon'></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
