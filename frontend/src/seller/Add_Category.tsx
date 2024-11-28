import React, { useState, useEffect } from 'react';
import logo from '../images/davao-petworld-logo.png';
import '../css/add_category.css'
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Alert, AlertColor, Snackbar } from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const Add_Category: React.FC = () => {
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
  const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
  const [sellerId, setSellerId] = useState<number | null>(null); 
  const [image, setImage] = useState<File | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
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
   
    const fetchSellerId = () => {
      
      const storedSellerId = localStorage.getItem('seller_id'); 
      if (storedSellerId) {
        setSellerId(Number(storedSellerId)); 
      }
    };
    fetchSellerId();
  }, []);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const navigate = useNavigate();
  // const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      categoryName: '',
      image: null // Set initial value to null
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required('Category Name is required'),
      image: Yup.mixed().required('Category Image is required.') // Use Yup.mixed for file uploads
    }),
    onSubmit: (values) => {
      if (!sellerId) {
        setSnackbarMessage('Admin ID is missing');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
  
      // Create FormData
      const formData = new FormData();
      formData.append('category_name', values.categoryName);
  
      // Ensure the image is not null before appending
      if (image) {
        formData.append('image', image); // Append the file (image) to the FormData
      } else {
        setSnackbarMessage('Image is required'); // Handle case when image is null
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
  
      formData.append('seller_id', sellerId.toString());
  
      // Send FormData to the server
      fetch(`${apiUrl}add_category`, {
        method: 'POST',
        body: formData, // Use FormData directly
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        setSnackbarMessage('Category Successfully Created!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/seller/manage_category');
        }, 2000);
      })
      .catch((error) => {
        setSnackbarMessage('Failed to create category');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        console.error(error);
      });
    }
  });
  
  
  

  const handleSnackbarClose = () => {
      setOpenSnackbar(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Set the selected file as image
      formik.setFieldValue('image', e.target.files[0]); // Set the file in formik values
    }
  };
  

  const [adminProfile, setAdminProfile] = useState<{ image: string; first_name: string; last_name: string } | null>(null);


  useEffect(() => {
      const sellerId = localStorage.getItem('seller_id'); // Retrieve the admin ID from local storage
  
      if (sellerId) {
          // Fetch admin profile data using the updated endpoint
          fetch(`${apiUrl}seller/${sellerId}`) // Adjusted endpoint to fetch by ID
              .then(res => {
                  if (!res.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return res.json();
              })
              .then(data => setAdminProfile(data[0] || null)) // Assuming the response is an array
              .catch(err => console.log(err));
      } else {
          console.log("Seller ID not found in local storage");
      }
  }, []);

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
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant='filled'>
              {snackbarMessage}
            </Alert>
          </Snackbar>
  
          <h1 className="title1" style={{marginBottom: '20px',}}>Add Category</h1>

          <div className="form-container1">
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryName">Category Name</label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"  
                  placeholder="Enter Category Name"
                  className="text-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.categoryName}  
                />
                {formik.touched.categoryName && formik.errors.categoryName ? (
                  <div className="error-message" style={{color: 'red', fontSize: '12px'}}>{formik.errors.categoryName}</div>
                ) : null}
              </div>

              <div className="form-group">
  <label htmlFor="image">Image</label>
  <input
    type="file"
    id="image"
    name="image"
    className="file-input"
    onChange={handleImageChange} // Handle image selection
  />
  {formik.touched.image && formik.errors.image ? (
    <div className="error-message" style={{color: 'red', fontSize: '12px'}}>{formik.errors.image}</div>
  ) : null}
</div>

              </div>

              <div className="form-group">
                <button type="submit" className="create-btn">Create</button>
              </div>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Add_Category;
