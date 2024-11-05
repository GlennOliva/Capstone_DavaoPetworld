import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import news from '../images/news.png';
import marketplace from '../images/marketplace.png';
import '../css/settings.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import axios from 'axios';

const ProfileSettings = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const formik = useFormik<{ 
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Optional for edit
    birthdate: string | null;
    gender: string;
    profile_pic: File | null;
    terms: boolean;
    age: string;
    bio: string;
    address: string;
  }>( {
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthdate: '',
      gender: '',
      bio: '',
      address: '',
      age: '',
      profile_pic: null,
      terms: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .optional(), // Make sure you want this to be optional
      age: Yup.number()
        .required('Age is required')
        .min(0, 'Age cannot be negative')
        .max(120, 'Please enter a valid age'),
      bio: Yup.string().required('Bio is required'),
      address: Yup.string().required('Address is required'),
      birthdate: Yup.date().required('Birthdate is required').nullable(),
      gender: Yup.string().required('Gender is required'),
      terms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'profile_pic' && value instanceof File) {
            formData.append('image', value);
          } else {
            const dbKey = key === 'firstName' ? 'first_name' : key === 'lastName' ? 'last_name' : key;
            formData.append(dbKey, value.toString());
          }
        }
      });

      fetch(`http://localhost:8081/edit_profile/${id}`, {
        method: 'PUT',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setSnackbarMessage('Profile Successfully Updated!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      })
      .catch((error) => {
        setSnackbarMessage(error.message || 'Failed to update profile');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        console.log(error);  
      });
    }
  });

  const userId = localStorage.getItem('user_id'); // Get user ID from local storage

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error('User ID is not available in local storage');
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:8081/user/${userId}`);
        const userData = response.data[0]; // Assuming data is an array
        console.log('User data:', userData); // Debug line
        
        // Set Formik values
        formik.setValues({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email || '',
          birthdate: userData.birthdate || '',
          gender: userData.gender || '',
          bio: userData.bio || '',
          address: userData.address || '',
          age: userData.age || '',
          profile_pic: null,
          terms: true,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [userId]);
  
  

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('profile_pic', file);
      setImagePreview(URL.createObjectURL(file)); // Preview image
    }
  };

  return (
    <div className="container">
      <div className="sidebar-lef1">
        <div className="imp-links">
          <a href="/"><img src={news} alt="News" />Latest News</a>
          <Link to="/ecommerce" className="link">
            <img src={marketplace} alt="Fish Shopping" />
            Store
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="update-password-container" >

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

       
          <div >
            <form onSubmit={formik.handleSubmit}>
              <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#1876F2' }}>
                EDIT PROFILE
              </h1>
              <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div style={{ color: 'red' }}>{formik.errors.firstName}</div>
                  ) : null}
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div style={{ color: 'red' }}>{formik.errors.lastName}</div>
                  ) : null}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="email">Enter email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    readOnly // Email is typically read-only on edit
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="address">Enter Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter Address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div style={{ color: 'red' }}>{formik.errors.address}</div>
                  ) : null}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="password">Enter password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div style={{ color: 'red' }}>{formik.errors.password}</div>
                  ) : null}
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="birthdate">Date of Birth</label>
                  <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.birthdate ?? ''} // Fallback to an empty string if null
                />

                  {formik.touched.birthdate && formik.errors.birthdate ? (
                    <div style={{ color: 'red' }}>{formik.errors.birthdate}</div>
                  ) : null}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="gender">Select Sex</label>
                  <select
                    id="gender"
                    name="gender"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.gender}
                  >
                    <option value="" label="Select gender" />
                    <option value="male" label="Male" />
                    <option value="female" label="Female" />
                    <option value="other" label="Other" />
                  </select>
                  {formik.touched.gender && formik.errors.gender ? (
                    <div style={{ color: 'red' }}>{formik.errors.gender}</div>
                  ) : null}
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Age"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.age}
                  />
                  {formik.touched.age && formik.errors.age ? (
                    <div style={{ color: 'red' }}>{formik.errors.age}</div>
                  ) : null}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bio}
                  />
                  {formik.touched.bio && formik.errors.bio ? (
                    <div style={{ color: 'red' }}>{formik.errors.bio}</div>
                  ) : null}
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="profile_pic">Profile Picture (optional)</label>
                                  <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  onChange={(event) => {
                    // Check if currentTarget and its files are not null
                    if (event.currentTarget.files) {
                      formik.setFieldValue('profile_pic', event.currentTarget.files[0]);
                    }
                  }}
                />

                </div>

              </div>


            
       

          

              <button type="submit" style={{ backgroundColor: '#1876F2', color: 'white' }}>Update Profile</button>
         
            </form>
          </div>
        </div>
      </div>

      <div className="sidebar-right" style={{backgroundColor: 'transparent'}}>

      </div>
    </div>
  );
};

export default ProfileSettings;
