import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logo from '../images/logo1.png';
import '../css/edit_admin.css';
import Sidebar from './Sidebar';
import { Alert, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Edit_Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
  const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/product/${id}`);
        if (response.data.length > 0) {
          setProduct(response.data[0]);
        } else {
          setSnackbarMessage('Product not found.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setSnackbarMessage('Failed to fetch product details.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8081/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setSnackbarMessage('Failed to fetch categories.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      product_name: product ? product.product_name : '',
      product_description: product ? product.product_description : '',
      product_quantity: product ? product.product_quantity : '',
      product_price: product ? product.product_price : '',
      category_id: product ? product.category_id : '',
      image: null,
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required('Required'),
      product_description: Yup.string().required('Required'),
      product_quantity: Yup.number().required('Required').positive().integer(),
      product_price: Yup.number().required('Required').positive(),
      category_id: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key as keyof typeof values] as any);
      });

      try {
        const response = await axios.put(`http://localhost:8081/edit_product/${id}`, formData);
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/manage_product');
        }, 2000);
      } catch (error) {
        console.error('Error updating product:', error);
        setSnackbarMessage('Failed to update product.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
};

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

const [adminProfile, setAdminProfile] = useState<{ image: string; first_name: string; last_name: string } | null>(null);


useEffect(() => {
    const adminId = localStorage.getItem('admin_id'); // Retrieve the admin ID from local storage

    if (adminId) {
        // Fetch admin profile data using the updated endpoint
        fetch(`http://localhost:8081/admin/${adminId}`) // Adjusted endpoint to fetch by ID
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
          <i
            className='bx bx-menu toggle-sidebar'
            onClick={() => setSidebarHidden(prev => !prev)}
          ></i>
          <span className="divider"></span>
          <div className="profile" style={{ marginLeft: '94%', position: 'absolute' }}>
            {adminProfile && ( // Ensure adminProfile is not null
              <>
                <img
                  src={`http://localhost:8081/uploads/${adminProfile.image}`} // Use dynamic image
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
          <h1 className="title1" style={{ marginBottom: '20px' }}>Edit Products</h1>

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


          {product && (
            <div className="form-container1"> 
              <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <div className="form-row">
                <div className="form-group">
  <label htmlFor="product_name">Product Name</label>
  <input 
    type="text" 
    id="product_name" 
    name="product_name" 
    placeholder="Enter Product Name" 
    className="input-field" 
    value={formik.values.product_name}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.product_name && typeof formik.errors.product_name === 'string' ? (
    <div className="error">{formik.errors.product_name}</div>
  ) : null}
</div>

<div className="form-group">
  <label htmlFor="product_description">Product Description</label>
  <input 
    type="text" 
    id="product_description" 
    name="product_description" 
    placeholder="Enter Product Description" 
    className="input-field" 
    value={formik.values.product_description}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.product_description && typeof formik.errors.product_description === 'string' ? (
    <div className="error">{formik.errors.product_description}</div>
  ) : null}
</div>
                </div>

                <div className="form-row">
                <div className="form-group">
  <label htmlFor="product_quantity">Product Quantity</label>
  <input 
    type="number" 
    id="product_quantity" 
    name="product_quantity" 
    placeholder="Enter Product Quantity" 
    className="input-field" 
    value={formik.values.product_quantity}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.product_quantity && typeof formik.errors.product_quantity === 'string' ? (
    <div className="error">{formik.errors.product_quantity}</div>
  ) : null}
</div>

<div className="form-group">
  <label htmlFor="product_price">Product Price</label>
  <input 
    type="number" 
    id="product_price" 
    name="product_price" 
    placeholder="Enter Product Price" 
    step="0.01" 
    className="input-field" 
    value={formik.values.product_price}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.product_price && typeof formik.errors.product_price === 'string' ? (
    <div className="error">{formik.errors.product_price}</div>
  ) : null}
</div>
                </div>

                <div className="form-row">
                <div className="form-group">
  <label htmlFor="category_id">Product Category</label>
  <select 
    id="category_id" 
    name="category_id" 
    className="input-field" 
    value={formik.values.category_id}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
    <option value="">Select Category</option>
    {categories.map(category => (
      <option key={category.id} value={category.id}>
        {category.category_name}
      </option>
    ))}
  </select>
  {formik.touched.category_id && typeof formik.errors.category_id === 'string' ? (
    <div className="error">{formik.errors.category_id}</div>
  ) : null}
</div>

                  <div className="form-group">
                    <label htmlFor="image">Product Image</label>
                    <input 
                      type="file" 
                      id="image" 
                      name="image" 
                      accept="image/*" 
                      className="input-file" 
                      onChange={(event) => {
                        if (event.currentTarget.files && event.currentTarget.files[0]) {
                          formik.setFieldValue("image", event.currentTarget.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <button type="submit" className="create-btn">Edit</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

export default Edit_Product;
