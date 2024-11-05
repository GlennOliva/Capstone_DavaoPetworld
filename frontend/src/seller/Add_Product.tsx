import React, { useState, useEffect } from 'react';
import logo from '../images/logo1.png';
// import '../css/admin.css';
 import '../css/add_admin.css'
import { Link } from 'react-router-dom';

const Add_Product: React.FC = () => {
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
    <Link to="/manage_product" className="active">
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
        <h1 className="title1" style={{marginBottom: '20px',}}>Add Products</h1>


        <div className="form-container1">
  <form action="your_action_url" method="POST" encType="multipart/form-data">
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="product_name">Product Name</label>
        <input
          type="text"
          id="product_name"
          name="product_name"
          placeholder="Enter Product Name"
          className="text-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="product_description">Product Description</label>
        <input
          type="text"
          id="product_description"
          name="product_description"
          placeholder="Enter Product Description"
          className="text-input"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="product_quantity">Product Quantity</label>
        <input
          type="text"
          id="product_quantity"
          name="product_quantity"
          placeholder="Enter Product Quantity"
          className="text-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Product Price</label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Enter Product Price"
          step="0.01"
          className="number-input"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="category">Product Category</label>
        <select id="category" name="category" className="select-input">
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home_appliances">Home Appliances</option>
          <option value="toys">Toys</option>
          <option value="books">Books</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="image">Product Image</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          className="file-input"
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

export default Add_Product;
