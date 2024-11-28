import  { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import '../credentials/register.css';

export const Seller_Register = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      gender: '',
      profile_pic: null,
      valid_id: null,
      terms: false,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      gender: Yup.string().required('Gender is required'),
      profile_pic: Yup.mixed().required('Profile picture is required'),
      valid_id: Yup.mixed().required('Valid ID is required'),
      terms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('gender', values.gender);
    
      // Handle profile_pic
      if (values.profile_pic) {
        formData.append('profile_pic', values.profile_pic);
      }
    
      // Handle valid_id
      if (values.valid_id) {
        formData.append('valid_id', values.valid_id);
      }
    
      // Convert terms to a string
      formData.append('terms', values.terms ? 'true' : 'false');
    
      try {
        const response = await fetch(`${apiUrl}register_seller`, {
          method: 'POST',
          body: formData,
        });
    
        const result = await response.json();
        if (response.ok) {
          setSnackbarMessage('Registration successful');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setTimeout(() => navigate('/login'), 2000);
        } else {
          throw new Error(result.message || 'Registration failed');
        }
      } catch (error) {
        const err = error as Error; // Typecasting to Error
        setSnackbarMessage(err.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
      
    },
    
  });

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
          <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#1876F2' }}>REGISTER AN ACCOUNT</h1>
          <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />

          {/* First and Last Name */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="First name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.first_name}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <div style={{ color: 'red' }}>{formik.errors.first_name}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Last name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.last_name}
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <div style={{ color: 'red' }}>{formik.errors.last_name}</div>
              )}
            </div>
          </div>

          {/* Email and Password */}
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
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: 'red' }}>{formik.errors.email}</div>
          )}

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
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: 'red' }}>{formik.errors.password}</div>
          )}

          {/* Gender */}
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
          {formik.touched.gender && formik.errors.gender && (
            <div style={{ color: 'red' }}>{formik.errors.gender}</div>
          )}

          {/* Profile Picture and Valid ID */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="profile_pic">Profile Picture</label>
                            <input
                type="file"
                name="profile_pic"
                id="profile_pic"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    formik.setFieldValue('profile_pic', file);
                  }
                }}
              />

              {formik.touched.profile_pic && formik.errors.profile_pic && (
                <div style={{ color: 'red' }}>{formik.errors.profile_pic}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="valid_id">Valid ID</label>
              <input
  type="file"
  name="valid_id"
  id="valid_id"
  onChange={(event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('valid_id', file);
    }
  }}
/>

              {formik.touched.valid_id && formik.errors.valid_id && (
                <div style={{ color: 'red' }}>{formik.errors.valid_id}</div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
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
            {formik.touched.terms && formik.errors.terms && (
              <div style={{ color: 'red' }}>{formik.errors.terms}</div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-btn">REGISTER</button>
        </form>
      </div>

      
    </div>
  );
};

export default Seller_Register;
