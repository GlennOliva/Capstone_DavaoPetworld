import { useState } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../credentials/login.css';

const ForgotPass = () => {
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleForgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${apiUrl}forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage(data.message || 'Password reset link sent successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Navigate to the login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSnackbarMessage(data.error || 'Failed to send the reset link. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setSnackbarMessage('Failed to connect to the server. Please try again later.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="login-container">
      <div className="info">
        <h1>Fishcom</h1>
        <p>Connect all fish enthusiasts and vendors in the Philippines around you on Fishcom.</p>
      </div>
      <div className="login-form">
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email format')
              .required('Email is required'),
          })}
          onSubmit={(values) => handleForgotPassword(values.email)}
        >
          <Form>
            <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#1876F2' }}>FORGOT PASSWORD</h1>
            <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />

            <ErrorMessage
              name="email"
              render={(msg) => <p style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>{msg}</p>}
            />
            <label htmlFor="email">Enter your email</label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '10px',
              }}
            />

            <button type="submit" className="login-btn">
              Submit
            </button>
            <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />

            <button type="button" className="forgot-account-btn" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </Form>
        </Formik>
      </div>

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ForgotPass;
