import React, { useState, useEffect } from 'react';
import logo from '../images/logo1.png';
// import '../css/admin.css';
// import '../css/admin_profile.css'
import { Link } from 'react-router-dom';



const Seller_Profile: React.FC = () =>{
    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
    const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
  
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
          <ul className="side-menu">
  <li>
    <Link to="/seller_dashboard" className="active">
      <i className='bx bxs-dashboard icon'></i> Dashboard
    </Link>
  </li>
  <li>
    <Link to="/manage_product">
      <i className='bx bxs-box icon'></i> Manage Products
    </Link>
  </li>
  <li>
    <Link to="/manage_category">
      <i className='bx bxs-category icon'></i> Manage Category
    </Link>
  </li>
  <li>
    <Link to="/manage_order">
      <i className='bx bxs-cart icon'></i> Manage Orders
    </Link>
  </li>
</ul>

        </section>
  
        <section id="content">
          <nav>
            <i
              className='bx bx-menu toggle-sidebar'
              onClick={() => setSidebarHidden(prev => !prev)}
            ></i>
            <span className="divider"></span>
            <div className="profile" style={{marginLeft: '94%', position: 'absolute'}}>
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
                onClick={() => setProfileDropdownVisible(prev => !prev)}
              />
              <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`}>
              <li>
  <Link to="/seller_profile">
    <i className='bx bxs-user-circle icon'></i> Profile
  </Link>
</li>

                <li><a href="#"><i className='bx bxs-log-out-circle'></i> Logout</a></li>
              </ul>
            </div>
          </nav>
  
          <main>
  <h1>Update Profile</h1>
  <div className="container">
    <form action="#" method="POST" className="profile-form">
      <div className="row">
        <div className="column left">
          <div className="image-section">
            <label htmlFor="current-image">Current Image:</label>
            <div className="image-placeholder"></div>
          </div>
          <label htmlFor="first-name">First Name:</label>
          <input type="text" id="first-name" name="first-name" placeholder="Enter First Name" required />
          
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" placeholder="Enter Email Address" required />
          
          <label htmlFor="birthdate">Birthdate:</label>
          <input type="date" id="birthdate" name="birthdate" required />
        </div>

        {/* Right Column */}
        <div className="column right">
          <label htmlFor="new-image">New Image:</label>
          <input type="file" id="new-image" name="new-image" />
          
          <label htmlFor="last-name">Last Name:</label>
          <input type="text" id="last-name" name="last-name" placeholder="Enter Last Name" required />
          
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter Password" required />
          
          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <button type="submit" className="update-btn">Update Profile</button>
    </form>
  </div>
</main>

        </section>
      </div>
    );
}

export default Seller_Profile