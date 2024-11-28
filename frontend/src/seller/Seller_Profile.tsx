import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '../images/davao-petworld-logo.png';
import '../css/admin_profile.css';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

import { Alert, AlertColor, Snackbar } from '@mui/material';



const Seller_Profile: React.FC = () =>{
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
  const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
  const [sellerProfile, setSellerProfile] = useState<{
    valid_id: string; image: string; first_name: string; last_name: string; email: string; store_name: string; status: string; 
} | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const navigate = useNavigate();
  const [, setSnackbarOpen] = useState(false);
  
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

  useEffect(() => {
    const sellerId = localStorage.getItem('seller_id'); // Retrieve the admin ID from local storage

    if (sellerId) {
      fetch(`${apiUrl}seller/${sellerId}`) // Adjusted endpoint to fetch by ID
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => setSellerProfile(data[0] || null)) // Assuming the response is an array
        .catch(err => console.log(err));
    } else {
      console.log("Admin ID not found in local storage");
    }
  }, []);

  const initialValues = {
    first_name: sellerProfile?.first_name || '',
    last_name: sellerProfile?.last_name || '',
    email: sellerProfile?.email || '',
    store_name: sellerProfile?.store_name || '',
    password: '',
    image: null,
    valid_id: null,
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    store_name: Yup.string().required('Store name is required'),
    password: Yup.string().required('Password is required'),
    image: Yup.mixed().nullable()
  });

  const handleFormSubmit = (values: any, { setSubmitting }: any) => {
    const formData = new FormData();
    formData.append('first_name', values.first_name);
    formData.append('last_name', values.last_name);
    formData.append('email', values.email);
    formData.append('store_name', values.store_name);
    formData.append('password', values.password);
    
    // Append profile image and valid ID if available
    if (values.image) {
      formData.append('image', values.image);
    }
    if (values.valid_id) {
      formData.append('valid_id', values.valid_id);
    }

    const sellerId = localStorage.getItem('seller_id');
    fetch(`${apiUrl}edit_sellerprofile/${sellerId}`, {
      method: 'PUT',
      body: formData
    })
      .then(res => res.json())
      .then(_data => {
        // Success logic
        setSnackbarMessage('Seller Successfully Updated!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        setSubmitting(false);
      })
      .catch(_error => {
        // Error handling
        setSnackbarMessage('Failed to update seller');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setSubmitting(false);
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
            style={{
              height: 'auto',
              width: '90%',
              verticalAlign: 'middle',
              margin: '0 auto',
              display: 'flex'
            }} 
          />
      <Sidebar/>
        </section>
  
        <section id="content">
          <nav>
            <i
              className='bx bx-menu toggle-sidebar'
              onClick={() => setSidebarHidden(prev => !prev)}
            ></i>
            <span className="divider"></span>
            <div className="profile" style={{ marginLeft: '94%', position: 'absolute' }}>
            {sellerProfile && ( // Ensure adminProfile is not null
              <>
                <img
                  src={`${apiUrl}uploads/${sellerProfile.image}`} // Use dynamic image
                  alt="Profile"
                  onClick={() => setProfileDropdownVisible(prev => !prev)}
                />
                <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                  <li style={{ marginBottom: '5px', marginLeft: '15px', marginTop: '20px' }}>
                    <h1 style={{ fontSize: '12px', margin: 0 }}>Welcome: {sellerProfile.first_name}</h1>
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

          <Snackbar 
    open={openSnackbar} 
    autoHideDuration={2000}
    onClose={() => setOpenSnackbar(false)}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning
>
<Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant='filled'>
                    {snackbarMessage}
                </Alert>
</Snackbar>
  
  <h1>Update Profile</h1>
  <div className="container2">
  <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleFormSubmit}
  enableReinitialize
>
  {({ setFieldValue, isSubmitting }) => (
    <Form className="profile-form">
      <div className="row">
        <div className="column left">
          <div className="image-section">
     

            <div className="image-placeholder1">
              {sellerProfile && (
                <img
                  src={`${apiUrl}uploads/${sellerProfile.valid_id}`}
                  alt="Current"
                  className="profile-image"
                />
              )}
            </div>
            <label htmlFor="current-image" className="image-label">
             Valid Id
            </label>
          </div>

          <label htmlFor="first_name" className="form-label">
            First Name:
          </label>
          <Field
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter First Name"
            className="text-input1"
          />
          <ErrorMessage name="first_name" component="div" className="error-message" />

          <label htmlFor="last_name" className="form-label">
            Last Name:
          </label>
          <Field
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Enter Last Name"
            className="text-input1"
          />
          <ErrorMessage name="last_name" component="div" className="error-message" />
        </div>

        <div className="column right">
          <label htmlFor="email" className="form-label">
            Email Address:
          </label>
          <Field
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email Address"
            className="email-input1"
          />
          <ErrorMessage name="email" component="div" className="error-message" />

          <label htmlFor="store_name" className="form-label">
            Store Name:
          </label>
          <Field
            type="text"
            id="store_name"
            name="store_name"
            placeholder="Enter Store Name"
            className="email-input1"
          />
          <ErrorMessage name="store_name" component="div" className="error-message" />

          <label htmlFor="valid_id" className="form-label">
            Valid ID:
          </label>
          <input
            type="file"
            id="valid_id"
            name="valid_id"
            className="file-input1"
            onChange={(event) => {
              setFieldValue('valid_id', event.currentTarget.files ? event.currentTarget.files[0] : null);
            }}
          />

          {/* Profile Image */}
          <label htmlFor="image" className="form-label">Profile Image:</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        className="file-input1"
                        onChange={(event) => {
                          setFieldValue('image', event.currentTarget.files ? event.currentTarget.files[0] : null);
                        }}
                      />
                

          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <Field
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password"
            className="password-input1"
          />
          <ErrorMessage name="password" component="div" className="error-message" />
        </div>
      </div>
      <button
        type="submit"
        className="update-profile-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </button>
    </Form>
  )}
</Formik>
  </div>
</main>

        </section>
      </div>
    );
}

export default Seller_Profile