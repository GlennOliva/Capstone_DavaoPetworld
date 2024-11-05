import React from 'react';
import '../css/styles.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="row">
        <div className="col d-flex">
          <h4>INFORMATION</h4>
          <a href="#">About us</a>
          <a href="#">Contact Us</a>
          <a href="#">Term & Conditions</a>
          <a href="#">Shipping Guide</a>
        </div>
        <div className="col d-flex">
          <h4>SHOP DETAILS</h4>
          <a href="#">Fishcommerce</a>
        </div>
        <div className="col d-flex">
        <h4>CLIENTS</h4>
          <a href="#">Petworld</a>
          <a href="#">Fishville</a>
        </div>

        <div className="col d-flex">
      
        </div>
      </div>
    </footer>
  );
}

export default Footer;
