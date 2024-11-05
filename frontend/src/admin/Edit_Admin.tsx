import React, { useState, useEffect } from 'react';
import logo from '../images/logo1.png';
 import '../css/admin.css';
 import '../css/edit_admin.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert';



const Edit_Admin: React.FC = () => {
    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
    const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success'); // 'success' or 'error'


  
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


    const { id } = useParams();
    const navigate = useNavigate();

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [store_name, setStoreName] = useState("");
    const [image, setImage] = useState<File | null>(null); // Correctly typed as File or null
    const [admin, setAdmin] = useState({});
    const [status, setStatus] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    useEffect(() => {
      fetch(`http://localhost:8081/admin/${id}`)
          .then((res) => res.json())
          .then((data) => {
              console.log("data: ", data);
              if (Array.isArray(data) && data.length > 0) {
                  const adminData = data[0]; // Get the first element if it's an array
                  setAdmin(adminData);
                  setFirstName(adminData.first_name);
                  setLastName(adminData.last_name);
                  setEmail(adminData.email);
                  setStoreName(adminData.store_name);
                  setPassword(adminData.password);
                  setStatus(adminData.status);
                  setImage(adminData.image); // Assuming this is just the filename
              } else {
                  console.error("No admin data found");
              }
          })
          .catch((err) => console.log(err));
  }, [id]);
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setImage(e.target.files[0]);
      }
  };
  

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('store_name', store_name);
    formData.append('status', status);
    if (image) {
        formData.append('image', image);
    }

    fetch(`http://localhost:8081/edit_admin/${id}`, {
        method: 'PUT',
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setSnackbarMessage('Admin details updated successfully.');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Delay navigation to allow Snackbar to show
            setTimeout(() => {
                navigate('/manage_admin');
            }, 2000); // Delay in milliseconds (e.g., 2000ms = 2 seconds)
        })
        .catch((err) => {
            console.error(err);
            setSnackbarMessage('Error updating admin details.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);

            // Delay navigation in case of error too, if needed
            setTimeout(() => {
                navigate('/manage_admin');
            }, 2000);
        });
};


const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
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
                <h3>Edit Admin</h3>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="image-section">
            <div className="image-placeholder">
    {/* Display the current image if available */}
    {image && (
        <img src={`http://localhost:8081/uploads/${image}`} style={{width: '150px', height: 'auto', display: 'flex', margin: '0 auto'}} alt="Current" />
    )}
</div>

                <label htmlFor="current-image">Current Image:</label>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input type="text" id="first_name" value={first_name} onChange={(e) => setFirstName(e.target.value)} className="text-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input type="text" id="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)} className="text-input" />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="email-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="file" id="image" name="image" onChange={handleImageChange} className="file-input" />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="store_name" className="form-label">Store Name</label>
                    <input type="text" id="store_name" value={store_name} onChange={(e) => setStoreName(e.target.value)} className="text-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-input" />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status" className="form-label">Status</label>
                    <input type="text" id="status" value={status} onChange={(e) => setStatus(e.target.value )} className="text-input" />
                </div>
            </div>
            <div className="form-group">
                <button type="submit" className="create-btn" style={{ width: '20%' }}>Update</button>
            </div>
        </form>
            </div>
          
            
          </main>
        </section>
      </div>
    );
}

export default Edit_Admin