import React, { useState, useEffect } from 'react';
import logo from '../images/davao-petworld-logo.png';
import '../css/admin.css';
 import '../css/add_admin.css'
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import { Alert, AlertColor, Snackbar } from '@mui/material';



const Add_Admin: React.FC = () =>{
    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
    const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
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


    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [storeName, setStoreName] = useState<string>('');
    // const [status, setStatus] = useState<string>('Active');
    const [image, setImage] = useState<File | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
const navigate = useNavigate();
const [, setSnackbarOpen] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setImage(e.target.files[0]); // Set the selected file as image
      }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create form data object
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('store_name', storeName);
    if (image) formData.append('image', image); // Add image if available

    try {
        // Send POST request to the backend
        const response = await axios.post(`${apiUrl}add_admin`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log(response.data);

        // Update Snackbar state
        setSnackbarMessage('Admin Successfully Created!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Delay navigation to allow Snackbar to show
        setTimeout(() => {
            navigate('/manage_admin');
        }, 2000); // Delay in milliseconds (2000ms = 2 seconds)

    } catch (error) {
        console.error('Error uploading admin:', error);

        // Update Snackbar state for error
        setSnackbarMessage('Failed to create admin');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);

        // Delay navigation in case of error too, if needed
        setTimeout(() => {
            navigate('/manage_admin');
        }, 2000);
    }
};

const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
      return;
  }
  setSnackbarOpen(false);
};


const [adminProfile, setAdminProfile] = useState<{ image: string; first_name: string; last_name: string } | null>(null);


useEffect(() => {
    const adminId = localStorage.getItem('admin_id'); // Retrieve the admin ID from local storage

    if (adminId) {
        // Fetch admin profile data using the updated endpoint
        fetch(`${apiUrl}admin/${adminId}`) // Adjusted endpoint to fetch by ID
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
  
          <main>
          <div className="form-container1">
                <h3>Add Admin</h3>
                <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="Enter First Name"
                        className="text-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} // Update first name state
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        placeholder="Enter Last Name"
                        className="text-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} // Update last name state
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Email Address"
                        className="email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state
                        required
                    />
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
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                        className="password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="store_name">Store Name</label>
                    <input
                        type="text"
                        id="store_name"
                        name="store_name"
                        placeholder="Enter Store Name"
                        className="text-input"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)} // Update store name state
                        required
                    />
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

export default Add_Admin