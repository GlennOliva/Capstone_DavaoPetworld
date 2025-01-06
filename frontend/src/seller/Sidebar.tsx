
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
            to="/seller/dashboard"
            className={location.pathname === '/seller/dashboard' ? 'active' : ''}
          >
            <i className='bx bxs-dashboard icon'></i> Dashboard
          </Link>
        </li>


        <li>
          <Link
            to="/seller/manage_product"
            className={location.pathname === '/seller/manage_product' ? 'active' : ''}
          >
            <i className='bx bxs-box icon'></i> Manage Products
          </Link>
        </li>

        <li>
          <Link
            to="/seller/manage_category"
            className={location.pathname === '/seller/manage_category' ? 'active' : ''}
          >
            <i className='bx bxs-category icon'></i> Manage Category
          </Link>
        </li>

        <li>
          <Link
            to="/seller/manage_order"
            className={location.pathname === '/seller/manage_order' ? 'active' : ''}
          >
            <i className='bx bxs-cart icon'></i> Manage Orders
          </Link>
        </li>

        <li>
          <Link
            to="/seller/manage_chat"
            className={location.pathname === '/seller/manage_chat' ? 'active' : ''}
          >
            <i className='bx bxs-message icon'></i> Manage Chats
          </Link>
        </li>


        <li>
          <Link
            to="/seller/manage_income"
            className={location.pathname === '/seller/manage_income' ? 'active' : ''}
          >
            <i className='bx bxs-credit-card icon'></i> Income Analytics
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
