import React, { useState } from 'react';
import '../credentials/register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, AlertColor, Snackbar } from '@mui/material';

export const Register = () => {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik<{ 
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthdate: string | null;
    gender: string;
    profile_pic: File | null; // Keep this for form state
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
      .required('Password is required'),
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
  
      fetch('http://localhost:8081/register_user', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          setSnackbarMessage('User Successfully Registered!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          console.log(data);          // Delay navigation to allow Snackbar to show
          setTimeout(() => {
              navigate('/login');
          }, 2000); // 2 seconds delay
      })
      .catch((error) => {
          setSnackbarMessage('Failed to create user');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          console.log(error);  
          // Delay navigation in case of error
          setTimeout(() => {
              navigate('/register');
          }, 2000); // 2 seconds delay
      });
    }
  });

const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
      return;
  }
  setSnackbarOpen(false);
};
  

  return (
    <div className="login-container">

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
      <div className="info">
        <h1>Fishcom</h1>
        <p>Connect all fish enthusiasts and vendors in the Philippines around you on Fishcom.</p>
      </div>
      <div className="login-form">
        <form onSubmit={formik.handleSubmit}>
          <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#1876F2' }}>
            REGISTER AN ACCOUNT
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
    />
    {formik.touched.email && formik.errors.email ? (
      <div style={{ color: 'red' }}>{formik.errors.email}</div>
    ) : null}
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
  {/* Password Field */}
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

  {/* Age Field */}
  <div style={{ flex: 1 }}>
    <label htmlFor="age">Enter Age</label>
    <input
      type="number"
      id="age"
      name="age"
      placeholder="Enter Age"
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
    <label htmlFor="birthdate">Birthdate</label>
    <input
      type="date"
      id="birthdate"
      name="birthdate"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.birthdate || ''} // Convert null to empty string
    />
    {formik.touched.birthdate && formik.errors.birthdate ? (
      <div style={{ color: 'red' }}>{formik.errors.birthdate}</div>
    ) : null}
  </div>

  <div style={{ flex: 1 }}>
    <label htmlFor="gender">Gender</label>
    <input
      type="text"
      id="gender"
      name="gender"
      placeholder="Enter gender"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.gender}
    />
    {formik.touched.gender && formik.errors.gender ? (
      <div style={{ color: 'red' }}>{formik.errors.gender}</div>
    ) : null}
  </div>
</div>


<div style={{ display: 'flex', gap: '10px' }}>
  {/* Profile Picture Upload */}
  <div style={{ flex: 1 }}>
    <label htmlFor="profile_pic">Profile Picture</label>
    <input
      type="file"
      name="profile_pic" 
      id="profile_pic"
      onChange={(event) => {
        const files = event.currentTarget.files;
        if (files && files.length > 0) {
          formik.setFieldValue("profile_pic", files[0]); // Set profile_pic value in Formik
        }
      }}
    />
    {formik.touched.profile_pic && formik.errors.profile_pic ? (
      <div style={{ color: 'red' }}>{formik.errors.profile_pic}</div>
    ) : null}
  </div>

  {/* Bio Input Field */}
  <div style={{ flex: 1 }}>
    <label htmlFor="bio">Bio</label>
    <input
      type="text"
      id="bio"
      name="bio"
      placeholder="Enter bio"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.bio}
    />
    {formik.touched.bio && formik.errors.bio ? (
      <div style={{ color: 'red' }}>{formik.errors.bio}</div>
    ) : null}
  </div>
</div>


          <div className="checkbox-container">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.terms}
            />
            <label htmlFor="terms">
              I agree to the <Link to="/termscondition" style={{ color: '#007bff' }}>Terms and Conditions</Link>
            </label>
            {formik.touched.terms && formik.errors.terms ? (
              <div style={{ color: 'red' }}>{formik.errors.terms}</div>
            ) : null}
          </div>

          <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />
          <button type="submit" className="login-btn">
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
