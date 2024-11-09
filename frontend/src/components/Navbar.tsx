import  { useState, useEffect } from 'react';
import '../css/style.css'; // Assuming you have a CSS file named style.css for styling

// Importing images

import settings from '../images/setting.png';

import logout from '../images/logout.png';
import logo from '../images/davao-petworld-logo.png';

import { Link,  useNavigate } from 'react-router-dom';
import Search from './Search';
import Notification from './Notification';
import defaultprofile from '../images/userpng.png'


const Navbar = () => {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [darkTheme] = useState(localStorage.getItem('theme') === 'dark');
  // const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility
  const apiUrl = import.meta.env.VITE_API_URL;
  const history = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    
    // Navigate to the login page
    history('/login');
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkTheme);
    localStorage.setItem('theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme]);

  const handleSettingsMenuToggle = () => {
    setSettingsMenuOpen(prev => !prev);
    if (notificationMenuOpen) setNotificationMenuOpen(false);
  };
  
 
  // const handleDarkThemeToggle = () => {
  //   setDarkTheme(prev => !prev);
  // };

  const [userProfile, setUserProfile] = useState<{ image: string; first_name: string; last_name: string; id:number; } | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id'); // Retrieve the admin ID from local storage

    if (userId) {
      fetch(`${apiUrl}user/${userId}`) // Adjusted endpoint to fetch by ID
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => setUserProfile(data[0] || null)) // Assuming the response is an array
        .catch(err => console.log(err));
    } else {
      console.log("User ID not found in local storage");
    }
  }, []);

 


  // const toggleSidebar = () => {
  //   setSidebarOpen(prev => !prev); // Toggle sidebar visibility
  // };

  return (
    <nav className='nav1'>
      <div className="navbar-left">
        <a href="#"><img src={logo} alt="Logo" className="logo" /></a>
        {/* <div className="hamburger" style={{marginRight: '10%'}} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </div> */}
        <ul>
         <Search/>
        </ul>
      </div>
      <div className="navbar-right">
   

       <Notification/>

        <div className="navbar-user-profile online" onClick={handleSettingsMenuToggle}>
          {userProfile?.image ? (
            <img
              src={`${apiUrl}uploads/${userProfile.image}`} // Use dynamic image
              alt="Profile"
            />
          ) : (
            <img
              src={defaultprofile}
              alt="Default Profile"
            />
          )}
        </div>
      </div>

     

      {settingsMenuOpen && (
        <div className="setting-menu setting-menu-height">
          <div className="setting-menu-inner">
            <div className="user-profile">
              {userProfile?.image ? (
                <img
                  src={`${apiUrl}uploads/${userProfile.image}`} // Use dynamic image
                  alt="Profile"
                />
              ) : (
                <img
                src={defaultprofile}
                  alt="Default Profile"
                />
              )}
              <div>
                <p>Hi: {userProfile?.first_name}</p>
                <Link to="/profile" className="popup-link">See your Profile</Link>
              </div>
            </div>
            <hr />
            <div className="settings-links">
              <img src={settings} alt="Settings" className="settings-icon" />
              <Link to={`/profile_settings/${userProfile?.id}`} style={{ textDecoration: 'none' }}>
    Profile settings 
</Link>

            </div>
            <div className="settings-links" onClick={handleLogout} style={{ cursor: 'pointer' }}>
      <img src={logout} alt="Logout" className="settings-icon" />
      Logout 
    </div>
          </div>
        </div>
      )}



    </nav>
  );
};

export default Navbar;
