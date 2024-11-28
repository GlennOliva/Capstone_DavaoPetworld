import React, { useState, useEffect } from 'react';
import logo from '../images/davao-petworld-logo.png';
import '../css/add_admin.css';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import Sidebar from './Sidebar';
import { Formik, Form, Field,} from 'formik';
import * as Yup from 'yup';

const Add_Product: React.FC = () => {
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}category`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const navigate = useNavigate();
  // const [snackbarOpen, setSnackbarOpen] = useState(false);


  // Validation schema with Yup
  const validationSchema = Yup.object({
    product_name: Yup.string().required('Product Name is required'),
    product_description: Yup.string().required('Product Description is required'),
    product_quantity: Yup.number().required('Product Quantity is required').positive().integer(),
    product_price: Yup.number().required('Product Price is required').positive(),
    category_id: Yup.string().required('Category is required'),
    image: Yup.mixed().required('Product Image is required'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const formData = new FormData();
 
    const sellerId = localStorage.getItem('seller_id') || '1'; // Use '1' as a default if not found
    formData.append('seller_id', sellerId);
    formData.append('category_id', values.category_id);
    formData.append('product_name', values.product_name);
    formData.append('product_description', values.product_description);
    formData.append('product_quantity', values.product_quantity);
    formData.append('product_price', values.product_price);
    formData.append('image', values.image);

    try {
        const response = await fetch(`${apiUrl}add_product`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }


        // Show success snackbar
        setSnackbarMessage('Product Successfully Created!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Navigate after a short delay
        setTimeout(() => {
            navigate('/seller/manage_product');
        }, 2000);

    } catch (error) {
        console.error('Error adding product:', error);
        setSnackbarMessage('Failed to create Product');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    } finally {
        setSubmitting(false);
    }
};

const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
        console.log("Admin ID not found in local storage");
    }
}, []);

  return (
    <div>
      <section id="sidebar" className={sidebarHidden ? 'hide' : ''}>
        <img src={logo} alt="Logo" className="logo" style={{ height: 'auto', width: '90%', margin: '0 auto', display: 'flex' }} />
        <Sidebar />
      </section>

      <section id="content">
        <nav>
          <i className='bx bx-menu toggle-sidebar' onClick={() => setSidebarHidden(prev => !prev)}></i>
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
          <h1 className="title1" style={{ marginBottom: '20px' }}>Add Products</h1>

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

          <div className="form-container1">
          <Formik
  initialValues={{
    product_name: '',
    product_description: '',
    product_quantity: '',
    product_price: '',
    category_id: '',
    image: null,
  }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ setFieldValue, isSubmitting, errors, touched }) => (
    <Form encType="multipart/form-data">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="product_name">Product Name</label>
          <Field 
            type="text" 
            id="product_name" 
            name="product_name" 
            placeholder="Enter Product Name" 
            className="text-input" 
          />
          {touched.product_name && errors.product_name && (
            <div className="error" style={{ color: 'red', fontSize: '12px' }}>
              {errors.product_name}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="product_description">Product Description</label>
          <Field 
            type="text" 
            id="product_description" 
            name="product_description" 
            placeholder="Enter Product Description" 
            className="text-input" 
          />
          {touched.product_description && errors.product_description && (
            <div className="error" style={{ color: 'red', fontSize: '12px' }}>
              {errors.product_description}
            </div>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="product_quantity">Product Quantity</label>
          <Field 
            type="number" 
            id="product_quantity" 
            name="product_quantity" 
            placeholder="Enter Product Quantity" 
            className="number-input" 
          />
          {touched.product_quantity && errors.product_quantity && (
            <div className="error" style={{ color: 'red', fontSize: '12px' }}>
              {errors.product_quantity}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="product_price">Product Price</label>
          <Field 
            type="number" 
            id="product_price" 
            name="product_price" 
            placeholder="Enter Product Price" 
            step="0.01" 
            className="number-input" 
          />
          {touched.product_price && errors.product_price && (
            <div className="error" style={{ color: 'red', fontSize: '12px' }}>
              {errors.product_price}
            </div>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Product Category</label>
          <Field as="select" id="category" name="category_id" className="select-input">
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.category_name}</option>
            ))}
          </Field>
          {touched.category_id && errors.category_id && (
            <div className="error" style={{ color: 'red', fontSize: '12px' }}>
              {errors.category_id}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="file-input"
            onChange={(event) => {
              const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
              setFieldValue("image", file);
            }}
          />
          {touched.image && errors.image && (
            <div className="error" style={{ color: 'red', fontSize: '12px' }}>
              {errors.image}
            </div>
          )}
        </div>
      </div>
      <div className="form-group">
        <button type="submit" className="create-btn" disabled={isSubmitting}>Create</button>
      </div>
    </Form>
  )}
</Formik>

          </div>
        </main>
      </section>
    </div>
  );
}

export default Add_Product;
