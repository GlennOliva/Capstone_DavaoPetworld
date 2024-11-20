import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../credentials/login.css';
import axios from 'axios';


interface ChangePasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangePassword = async (
    values: ChangePasswordFormValues,
    { setSubmitting, setFieldError }: { setSubmitting: (isSubmitting: boolean) => void; setFieldError: (field: string, message: string) => void }
  ) => {
    try {
      const email = new URLSearchParams(window.location.search).get('email');
      if (!email) {
        setFieldError('password', 'Invalid reset link.');
        return;
      }
  
      const response = await axios.post(`${apiUrl}change-password`, {
        email,
        password: values.password,
      });
  
      setMessage(response.data.message);
      setSnackbarOpen(true);
  
      // Redirect to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) { // Explicitly handle error as 'any' or a specific type
      if (error.response && error.response.data.error) {
        setFieldError('password', error.response.data.error);
      } else {
        setFieldError('password', 'An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  
  return (
    <div className="login-container">
      <div className="info">
        <h1>FishCom</h1>
        <p>Connect all fish enthusiasts and vendors in the Philippines around you on FishCom.</p>
      </div>
      <div className="login-form">
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={Yup.object({
            password: Yup.string()
              .required('Password is required')
              .min(6, 'Password must be at least 6 characters')
              .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
              .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
            confirmPassword: Yup.string()
              .required('Confirm password is required')
              .oneOf([Yup.ref('password')], 'Passwords must match'),
          })}
          onSubmit={handleChangePassword}
        >
          <Form>
            <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#1876F2' }}>CHANGE PASSWORD</h1>
            <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />

            <Field
              type="password"
              name="password"
              placeholder="Enter new password"
              className="login-input"
            />
            <div style={{ color: 'red', fontSize: '15px', textAlign: 'left' }}>
              <ErrorMessage name="password" />
            </div>

            <Field
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="login-input"
            />
            <div style={{ color: 'red', fontSize: '15px', textAlign: 'left' }}>
              <ErrorMessage name="confirmPassword" />
            </div>

            <button type="submit" className="login-btn">Submit</button>
          </Form>
        </Formik>
      </div>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ChangePassword;
