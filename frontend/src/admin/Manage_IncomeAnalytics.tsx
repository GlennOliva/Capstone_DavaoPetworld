import React, { useState, useEffect } from 'react';
import logo from '../images/davao-petworld-logo.png';
import '../css/manage_admin.css';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Manage_IncomeAnalytics: React.FC = () => {
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
  const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
  const [adminProfile, setAdminProfile] = useState<{ image: string; first_name: string; last_name: string } | null>(null);
  const [data, setData] = useState<Order[]>([]); // Use Order interface here
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Set how many items per page you want
  const apiUrl = import.meta.env.VITE_API_URL;
  // Fetch admin profile data
  useEffect(() => {
    const adminId = localStorage.getItem('admin_id'); // Retrieve the admin ID from local storage

    if (adminId) {
      fetch(`${apiUrl}admin/${adminId}`) // Adjusted endpoint to fetch by ID
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => setAdminProfile(data[0] || null)) // Assuming the response is an array
        .catch(err => console.log(err));
    } else {
      console.log("Admin ID not found in local storage");
    }
  }, []);

  // Fetch order data
  useEffect(() => {
    fetch(`${apiUrl}manage_income`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched data:', data); // Check the data structure
        setData(data); // Set the data with user information
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(data.length / itemsPerPage); // Calculate total pages
  const indexOfLastOrder = currentPage * itemsPerPage; // Last order index for current page
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage; // First order index for current page
  const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder); // Current orders to display

  // Handle page click
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (profileDropdownVisible && !target.closest('.profile')) {
        setProfileDropdownVisible(false);
      }
      Object.keys(menuDropdownVisible).forEach(key => {
        if (menuDropdownVisible[key] && !target.closest(`.menu[data-key="${key}"]`)) {
          setMenuDropdownVisible(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdownVisible, menuDropdownVisible]);

  interface Order {
    id: number;
    first_name: string;
    last_name: string;
    product_name: string;
    product_quantity: number; // Assuming product quantity is a number
    payment_method: string;
    total_price: number; // Assuming total price is a number
    address: string;
    shipping_fee: number; // Assuming shipping fee is a number
    status: string;
  }

  return (
    <div>
      <section id="sidebar" className={sidebarHidden ? 'hide' : ''}>
        <img 
          src={logo} 
          alt="Logo" 
          className="logo" 
          style={{
            height: 'auto',
            width: '90%',
            verticalAlign: 'middle',
            margin: '0 auto',
            display: 'flex'
          }} 
        />
        <Sidebar />
      </section>

      <section id="content">
        <nav>
          <i
            className='bx bx-menu toggle-sidebar'
            onClick={() => setSidebarHidden(prev => !prev)}
          ></i>
          <span className="divider"></span>
          <div className="profile" style={{ marginLeft: '94%', position: 'absolute' }}>
            {adminProfile && ( // Ensure adminProfile is not null
              <>
                <img
                  src={`${apiUrl}uploads/${adminProfile.image}`} // Use dynamic image
                  alt="Profile"
                  onClick={() => setProfileDropdownVisible(prev => !prev)}
                />
                <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                  <li style={{ marginBottom: '5px', marginLeft: '15px', marginTop: '20px' }}>
                    <h1 style={{ fontSize: '12px', margin: 0 }}>Welcome: {adminProfile.first_name}</h1>
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    <Link to={`/admin_profile/${localStorage.getItem('admin_id')}`} style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}>
                      <i className='bx bxs-user-circle' style={{ marginRight: '5px' }}></i> Profile
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}
                      onClick={() => {
                        // Clear local storage
                        localStorage.clear();
                        
                        // Redirect to the login page or another account page
                        window.location.href = '/login'; // Adjust this path as necessary
                      }}
                    >
                      <i className='bx bxs-log-out-circle' style={{ marginRight: '5px' }}></i> Logout
                    </a>
                  </li>
                </ul>
              </>
            )}
          </div>
        </nav>

        <main>
          <h1 className="title1" style={{ marginBottom: '20px' }}>Manage Income Analytics</h1>
          <div className="container1" style={{ marginBottom: '20px' }}></div>
          <table className="admin-table">
  <thead>
    <tr>
      <th>Id</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Product Name</th>
      <th>Product Quantity</th>
      <th>Payment Method</th>
      <th>Total Price</th>
      <th>Address</th>
      <th>Shipping Fee</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {currentOrders.length > 0 ? (
      currentOrders.map((order) => (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.first_name}</td>
          <td>{order.last_name}</td>
          <td>{order.product_name}</td>
          <td>{order.product_quantity}</td>
          <td>{order.payment_method}</td>
          <td>{order.total_price}</td>
          <td>{order.address}</td>
          <td>{order.shipping_fee}</td>
          <td data-label="Status">
            {order.status === 'Delivered' ? (
              <span className="status-delivered">{order.status}</span>
            ) : order.status === 'Cancelled' ? (
              <span className="status-cancelled">{order.status}</span>
            ) : order.status === 'On delivery' ? (
              <span className="status-ondelivery">{order.status}</span> // Correct class usage
            ) : (
              <span className="status-pending">{order.status}</span>
            )}
          </td>
          <td style={{ width: '20%' }}>
            <Link to={`/order_receipt/${order.id}`} className="view-btn" style={{ textDecoration: 'none' }}>
              <i className="fas fa-eye"></i>View Orders Receipt
            </Link>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={11} style={{ textAlign: 'center' }}>No orders found</td>
      </tr>
    )}
  </tbody>
</table>

{/* Calculate and display the total revenue */}
{currentOrders.length > 0 && (
  <div className="revenue-summary">
    <strong>Revenue Income Sales:</strong> ₱
    {new Intl.NumberFormat('en-PH', { 
      style: 'decimal', 
      maximumFractionDigits: 2 
    }).format(
      currentOrders.reduce((total, order) => total + order.total_price, 0)
    )}
  </div>
)}




       {/* Pagination Section */}
      <section className="pagination">
        <div className="container1">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              style={{
                cursor: 'pointer',
                margin: '0 5px',
                fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                textDecoration: currentPage === index + 1 ? 'underline' : 'none',
              }}
            >
              {index + 1}
            </span>
          ))}
          {currentPage < totalPages && (
            <span onClick={() => setCurrentPage(currentPage + 1)} style={{ cursor: 'pointer' }}>
              <i className="bx bx-right-arrow-alt"></i>
            </span>
          )}
        </div>
      </section>
          
        </main>
      </section>
    </div>
  );
}

export default Manage_IncomeAnalytics;
