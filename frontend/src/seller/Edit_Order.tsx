import React, { useState, useEffect } from 'react';
import logo from '../images/davao-petworld-logo.png';
import '../css/edit_admin.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

import { Alert, AlertColor, Snackbar } from '@mui/material';

const Edit_Order: React.FC = () => {
    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
    const [adminProfile, setAdminProfile] = useState<{ image: string; first_name: string; last_name: string } | null>(null);
    const [orderDetails, setOrderDetails] = useState<any>(null); // To hold fetched order details
    const [orderStatus, setOrderStatus] = useState<string>(''); // To hold selected order status
    const { id } = useParams(); // Get order ID from URL params
    const apiUrl = import.meta.env.VITE_API_URL;
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
    const navigate = useNavigate();
    const [, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const sellerId = localStorage.getItem('seller_id');

        if (sellerId) {
            fetch(`${apiUrl}seller/${sellerId}`)
                .then(res => res.json())
                .then(data => setAdminProfile(data[0] || null))
                .catch(err => console.log(err));
        } else {
            console.log("Admin ID not found in local storage");
        }
    }, []);

    useEffect(() => {
        // Fetch order details when component mounts
        if (id) {
            fetch(`${apiUrl}manage_order/${id}`)
                .then(res => res.json())
                .then(data => {
                    setOrderDetails(data);
                    setOrderStatus(data.status); // Set initial order status
                })
                .catch(err => console.log(err));
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Update the order status
        fetch(`${apiUrl}edit_order/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: orderStatus }),
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to update order');
            return res.json();
        })
        .then(data => {
          console.log(data);
          setSnackbarMessage('Order Status Successfully Update!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
  
          // Delay navigation to allow Snackbar to show
          setTimeout(() => {
              navigate('/seller/manage_order');
          }, 2000); // Delay in milliseconds (2000ms = 2 seconds)
        })
        .catch(err => {
            console.log(err);
            setSnackbarMessage('Failed to update order status');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);

        // Delay navigation in case of error too, if needed
        setTimeout(() => {
            navigate(`/edit_order/:${id}`);
        }, 2000);
        });
    };

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
          return;
      }
      setSnackbarOpen(false);
    };
    

    return (
        <div>
            <section id="sidebar" className={sidebarHidden ? 'hide' : ''}>
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="logo" 
                    style={{ height: 'auto', width: '90%', verticalAlign: 'middle', margin: '0 auto', display: 'flex' }} 
                />
                <Sidebar />
            </section>

  

            <section id="content">
                <nav>
                    <i className='bx bx-menu toggle-sidebar' onClick={() => setSidebarHidden(prev => !prev)}></i>
                    <span className="divider"></span>
                    <div className="profile" style={{ marginLeft: '94%', position: 'absolute' }}>
                        {adminProfile && (
                            <>
                                <img
                                    src={`${apiUrl}uploads/${adminProfile.image}`} 
                                    alt="Profile"
                                    onClick={() => setProfileDropdownVisible(prev => !prev)}
                                />
                                <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                                    <li style={{ marginBottom: '5px', marginLeft: '15px', marginTop: '20px' }}>
                                        <h1 style={{ fontSize: '12px', margin: 0 }}>Welcome: {adminProfile.first_name}</h1>
                                    </li>
                                    <li style={{ marginBottom: '5px' }}>
                                        <Link to={`/seller_profile/${localStorage.getItem('seller_id')}`} style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}>
                                            <i className='bx bxs-user-circle' style={{ marginRight: '5px' }}></i> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}
                                            onClick={() => {
                                                localStorage.clear();
                                                window.location.href = '/login';
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

                <Snackbar 
                open={openSnackbar} // Use openSnackbar here
                autoHideDuration={3000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Adjust position as needed
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant='filled'>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
                    <h1 className="title1" style={{ marginBottom: '20px' }}>Edit Order</h1>

                    {orderDetails ? ( // Render form only if orderDetails is available
                        <div className="form-container1"> 
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="first_name">First Name</label>
                                        <input type="text" id="first_name" name="first_name" value={orderDetails.first_name} className="input-field" readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last_name">Last Name</label>
                                        <input type="text" id="last_name" name="last_name" value={orderDetails.last_name} className="input-field" readOnly />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="product_name">Product Name</label>
                                        <input type="text" id="product_name" name="product_name" value={orderDetails.product_name} className="input-field" readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" id="address" name="address" value={orderDetails.address} className="input-field" readOnly />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="product_quantity">Product Quantity</label>
                                        <input type="text" id="product_quantity" name="product_quantity" value={orderDetails.product_quantity} className="input-field" readOnly />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="payment_method">Payment Method</label>
                                        <input type="text" id="payment_method" name="payment_method" value={orderDetails.payment_method} className="input-field" readOnly />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="total_price">Total Price</label>
                                        <input type="text" id="total_price" name="total_price" value={orderDetails.total_price} className="input-field" readOnly />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category">Order Status</label>
                                        <select id="category" name="category" className="input-field" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                            <option value="">Select Order Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="On delivery">On delivery</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Delivered">Delivered</option>
                                            {/* Add more categories as needed */}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="create-btn">Edit</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <p>Loading order details...</p>
                    )}
                </main>
            </section>
        </div>
    );
};

export default Edit_Order;
