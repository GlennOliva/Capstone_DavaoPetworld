import React, { useState, useEffect } from 'react';
import logo from '../images/davao-petworld-logo.png';
// import '../css/admin.css';
// import '../css/manage_admin.css'
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import { Alert } from '@mui/material';

const Manage_Seller: React.FC = () => {
    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
    const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
    const apiUrl = import.meta.env.VITE_API_URL;
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
          return;
      }
      setSnackbarOpen(false);
    };
  


    function handleDeleteItem(id: string) {
      if (window.confirm("Are you sure you want to delete this post?")) {
          // Show success Snackbar
          setSnackbarMessage('Seller deleted Successfully!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
  
          // Delay the deletion
          setTimeout(() => {
              axios.delete(`${apiUrl}seller/${id}`)
                  .then((response) => {
                      console.log("response: " + response.data);
                      window.location.reload(); // Reload the page after deletion
                  })
                  .catch((error) => {
                      console.error("There was an error deleting the seller!", error);
  
                      // Show error Snackbar if deletion fails
                      setSnackbarMessage('Error deleting seller!');
                      setSnackbarSeverity('error');
                      setSnackbarOpen(true);
                  });
          }, 2000); // Delay in milliseconds (3000ms = 3 seconds)
      }
  }


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



    
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}seller`)
    .then((res) => res.json())
    .then((data) => setData(data))
    .then((err) => console.log(err));
  }, []);


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


  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Set how many items per page you want

  // Pagination Logic
  const totalPages = Math.ceil(data.length / itemsPerPage); // Calculate total pages
  const indexOfLastOrder = currentPage * itemsPerPage; // Last order index for current page
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage; // First order index for current page
  const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder); // Current orders to display

  // Handle page click
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
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
  
          <main>
          <h1 className="title1" style={{marginBottom: '20px',}}>Manage Seller</h1>
          <div className="action-btn" >

          <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={3000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Adjust position as needed
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant='filled'>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
         
                 

                 
          <div className="container1" style={{marginBottom: '20px',}}>

            
               
           
                  </div>
                  <table className="admin-table">
                      <thead>
                      <tr>
                            <th>Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Valid Id</th>
                            <th>Gender</th>
                            <th>Image</th>
                            <th>Store Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
              
                      {currentOrders.length > 0 ? (
                currentOrders.map((data, index) => ( // Keep the variable name as `data`
                  <tr key={index + 1}> {/* Increment index to start from 1 */}
                        <td>{index + 1}</td> {/* Display incremental id */}
                    <td>{data['first_name']}</td>
                    <td>{data['last_name']}</td>
                    <td>{data['email']}</td>
                    <td>
                      <img 
                        src={`${apiUrl}uploads/${data['valid_id']}`} 
                        alt={`${data['first_name']} ${data['last_name']}`} // Use user’s name as alt text
                        className="user-image"
                        style={{ width: '80px', height: 'auto' }}
                      />
                    </td>
                    <td>{data['gender']}</td>
                    <td>{data['store_name']}</td>
                    <td>
                      <img 
                        src={`${apiUrl}uploads/${data['image']}`} 
                        alt={`${data['first_name']} ${data['last_name']}`} // Use user’s name as alt text
                        className="user-image"
                        style={{ width: '80px', height: 'auto' }}
                      />
                    </td>
                    <td>{data['status']}</td>

                    <td style={{ width: '15%' }}>
          <a 
            href="#" 
            className='delete-btn' 
            style={{ textDecoration: 'none' }} 
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              handleDeleteItem(data['id']); // Call the delete handler with the item's id
            }}
          >
            <i className="bx bx-trash"></i>Delete
          </a>
        </td>

                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>No users available.</td> {/* Adjust colSpan based on your table structure */}
                </tr>
              )}

                  </tbody>
                  </table>
              </div>
             {/* Pagination Section */}
      <section className="pagination">
        <div className="container1">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              style={{
                cursor: 'pointer',
                margin: '0 5px',
                fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                textDecoration: currentPage === index + 1 ? 'underline' : 'none',
              }}
            >
              {index + 1}
            </span>
          ))}
          {currentPage < totalPages && (
            <span onClick={() => setCurrentPage(currentPage + 1)} style={{ cursor: 'pointer' }}>
              <i className="bx bx-right-arrow-alt"></i>
            </span>
          )}
        </div>
      </section>
          </main>
        </section>
      </div>
    );
}

export default Manage_Seller