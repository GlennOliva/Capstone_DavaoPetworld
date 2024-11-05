import React from 'react';
import '../credentials/register.css'
import { Link } from 'react-router-dom';

export const Seller_Register = () => {
  return (
    <div className="login-container">
      <div className="info">
        <h1>Fishcom</h1>
        <p>Connect all fish enthusiasts and vendors in the Philippines around you on Fishcom.</p>
      </div>
      <div className="login-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#1876F2' }}>REGISTER AN ACCOUNT</h1>
          <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" placeholder="First name" required />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" placeholder="Last name" required />
            </div>
          </div>

          <label htmlFor="email">Enter email address</label>
          <input type="email" id="email" name="email" placeholder="Enter email address" required />

          <label htmlFor="password">Enter password</label>
          <input type="password" id="password" name="password" placeholder="Enter password" required />

          <label htmlFor="birthdate">Birthdate</label>
          <input type="date" id="birthdate" name="birthdate" placeholder="Month / Day / Year" required />

          <label htmlFor="gender">Gender</label>
          <input type="text" id="gender" name="gender" placeholder="Enter gender" required />

        <label htmlFor='valid_id'>Valid Id</label>
        <input type="file" name="valid_id" id="" />

          <Link to="/login" style={{ textDecoration: 'none' }}>
          <button type="submit" className="login-btn">REGISTER</button>
          </Link>
          <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />
          <Link to="/register" style={{ textDecoration: 'none' }}>
          <button type="submit" className="seller-btn">REGISTER AS USER</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Seller_Register;
