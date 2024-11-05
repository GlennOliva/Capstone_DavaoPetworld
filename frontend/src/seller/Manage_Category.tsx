import React, { useState, useEffect } from 'react';
import logo from '../images/logo1.png';
// import '../css/admin.css';
 import '../css/manage_admin.css'
import { Link } from 'react-router-dom';

const Manage_Category: React.FC = () => {
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
    <Link to="/seller_dashboard" >
      <i className='bx bxs-dashboard icon'></i> Dashboard
    </Link>
  </li>
  <li>
    <Link to="/manage_product" >
      <i className='bx bxs-box icon'></i> Manage Products
    </Link>
  </li>
  <li>
    <Link to="/manage_category" className='active'>
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
             
         
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Category Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Goldfish</td>
                            <td>Available</td>
                            <td style={{width: '15%'}}>
                            <Link 
                                    to="/edit_category" 
                                    className="edit-btn" 
                                    style={{textDecoration: 'none'}}
                                    >
                                    <i className="bx bx-edit"></i>Edit
                            </Link>

                                <a href="" className='delete-btn' style={{textDecoration: 'none',}}><i className="bx bx-trash"></i>Delete</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
          
        </main>
      </section>
    </div>
  );
}

export default Manage_Category;
