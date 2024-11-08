import React, { useState, useEffect } from 'react';
import logo from '../images/logo1.png';
// import '../css/admin.css';
 import '../css/manage_admin.css'
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
import profile_pic from '../images/feed-image-1.png'


const Manage_Category: React.FC = () => {
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


  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}category`)
    .then((res) => res.json())
    .then((data) => setData(data))
    .then((err) => console.log(err));
  }, []);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
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


  function handleDeleteItem(id: string) {
    if (window.confirm("Are you sure you want to delete this category?")) {
        // Show success Snackbar
        setSnackbarMessage('Category deleted Successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Delay the deletion
        setTimeout(() => {
            axios.delete(`${apiUrl}category/${id}`)
                .then((response) => {
                    console.log("response: " + response.data);
                    window.location.reload(); // Reload the page after deletion
                })
                .catch((error) => {
                    console.error("There was an error deleting the admin!", error);

                    // Show error Snackbar if deletion fails
                    setSnackbarMessage('Error deleting admin!');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                });
        }, 2000); // Delay in milliseconds (3000ms = 3 seconds)
    }
}


const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
      return;
  }
  setSnackbarOpen(false);
};

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
        <h1 className="title1" style={{marginBottom: '20px',}}>Manage Category</h1>
        <div className="action-btn" >
                 

        <Link 
  to="/add_category" 
  className="create-btn" 
  style={{textDecoration: 'none', backgroundColor: '#28a745', fontSize: '14px' ,}}
>
  <i className="bx bx-plus-circle"></i>Create
</Link>

        <div className="container1" style={{marginBottom: '20px',}}>
             
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
         
         
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Category Name</th>
                            <th>Category Image</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentOrders.length > 0 ? (
    currentOrders.map((data, _key) => ( // Add `key` here to ensure each row has a unique key
      <tr key={data['id']}> {/* Use a unique identifier like id for the key */}
        <td>{data['id']}</td>
        <td>{data['category_name']}</td>
        <td style={{ width: '40%' }}>
          {data['image'] ? (
            <img src={`${apiUrl}uploads/${data['image']}`} style={{ width: '20%' }} alt="" />
          ) : (
            <img
              src={profile_pic} // Fallback image if userProfile.image is not available
              alt="Default Profile"
            />
          )}
        </td>
        <td>{data['status']}</td>
        <td style={{ width: '20%' }}>
          <Link 
            to={`/edit_category/${data['id']}`}
            className="edit-btn" 
            style={{ textDecoration: 'none' }}
          >
            <i className="bx bx-edit"></i>Edit
          </Link>

          <a 
            href="#" // Change to "#" to prevent navigation
            className='delete-btn' 
            style={{ textDecoration: 'none' }} 
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              handleDeleteItem(data['id']);
            }}
          >
            <i className="bx bx-trash"></i>Delete
          </a>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} style={{ textAlign: 'center' }}>No categories found.</td>
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

export default Manage_Category;
