import React, { useEffect, useState } from 'react';
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/checkout.css';
import axios from 'axios';
import { Alert, AlertColor, Snackbar } from '@mui/material';



const Checkout: React.FC = () => {
  const location = useLocation();
  const { products } = location.state || { products: [], totalPrice: 0 };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const navigate = useNavigate();
  const [, setSnackbarOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const Secretkey = import.meta.env.VITE_SECRETKEY;
  console.log("Received Products:", products); // Debugging line

  const addressOptions: string[] = [
    // Davao del Sur
    'Rizal Ave, Digos City, Davao del Sur',
    'Quezon Ave, Magsaysay, Davao del Sur',
    'San Pedro St, Padada, Davao del Sur',
    'Poblacion St, Bansalan, Davao del Sur',
    'Malvar St, Sta. Cruz, Davao del Sur',
    'Barangay Road, Hagonoy, Davao del Sur',
    'Poblacion, Matanao, Davao del Sur',
    'Baywalk, Sulop, Davao del Sur',
    'Digos Heights Rd, Digos City, Davao del Sur',

    // Davao City
    'Agdao Proper, Davao City',
    'Buhangin Road, Buhangin, Davao City',
    'Torres St, Davao City Proper, Davao City',
    'Ecoland Drive, Ecoland, Davao City',
    'Lanang St, Lanang, Davao City',
    'Matina Aplaya, Matina, Davao City',
    'Panacan Rd, Panacan, Davao City',
    'Talomo Ave, Talomo, Davao City',
    'Bajada St, Bajada, Davao City',
    'Baguio St, Baguio District, Davao City',
    'Toril Main St, Toril, Davao City',
    'Bangkal St, Bangkal, Davao City',
    'Catalunan Pequeno, Davao City',
    'Catalunan Grande, Davao City',
    'Matina Pangi, Davao City',
    'Matina Crossing, Davao City',

    // Davao del Norte
    'Tagum City Blvd, Tagum City, Davao del Norte',
    'San Pedro St, Panabo City, Davao del Norte',
    'Asuncion St, Asuncion, Davao del Norte',
    'Kapalong Rd, Kapalong, Davao del Norte',
    'New Corella St, New Corella, Davao del Norte',
    'Santo Tomas Ave, Santo Tomas, Davao del Norte',
    'Braulio Dujali St, Braulio Dujali, Davao del Norte',
    'Laak Proper, Laak, Davao del Norte',
    'Magsaysay Ave, Magsaysay, Davao del Norte',
    'Carmen St, Carmen, Davao del Norte',
  ];

  const [userProfile, setUserProfile] = useState<{ image: string; first_name: string; last_name: string; id: number; } | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetch(`${apiUrl}user/${userId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => setUserProfile(data[0] || null)) // Assuming the response is an array
        .catch(err => console.error('Fetch error:', err));
    } else {
      console.log("User ID not found in local storage");
    }
  }, []);


  
interface Product {
  product_id: number;
  name: string;
  price: number;
  quantity: number; // Make sure this is present
}



const [formData, setFormData] = useState(() => {
  const totalPrice = products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + product.price * product.quantity, 0);
  
  return {
      product_id: products.map((product: Product) => product.product_id),
      productname: products.map((product: Product) => product.name).join(', '),
      productprice: products.map((product: Product) => product.price).join(', '),
      productquantity: products.map((product: Product) => product.quantity).join(', '), // Join quantities as a string
      totalprice: totalPrice.toFixed(2),
      paymentmethod: '',
      address: '',
      shipfee: 0,
      sub_total: totalPrice.toFixed(2),
  };
});

useEffect(() => {
  const updatedTotalPrice = products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + product.price * product.quantity, 0);

  setFormData(prev => ({
      ...prev,
      product_id: products.map((product: Product) => product.product_id),
      productname: products.map((product: Product) => product.name).join(', '),
      productprice: products.map((product: Product) => product.price).join(', '),
      productquantity: products.map((product: Product) => product.quantity).join(', '), // Update to join quantities as a string
      totalprice: updatedTotalPrice.toFixed(2), // Update total price
  }));
}, [products]);


  const [filteredAddresses, setFilteredAddresses] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPaypalButton, setShowPaypalButton] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'address') {
      const filtered = addressOptions.filter((address) =>
        address.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAddresses(filtered);
      setShowSuggestions(value !== '');
    }

    if (name === 'paymentmethod') {
      setShowPaypalButton(value === 'paypal');
    }
  };

  const calculateShippingFee = (address: string) => {
    if (address.includes('Davao City')) return 40;
    if (address.includes('Davao del Sur')) return 120;
    if (address.includes('Davao del Norte')) return 150;
    return 0;
  };

  const handleAddressSelect = (address: string) => {
    const shippingFee = calculateShippingFee(address);
    setFormData((prev) => ({ ...prev, address, shipfee: shippingFee }));
    setShowSuggestions(false);
    setFilteredAddresses([]);
  };

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Calculate total price including shipping fee
    const shippingFee = formData.shipfee;
    const totalPriceWithShipping = (parseFloat(formData.totalprice) + shippingFee).toFixed(2);
  
    const orderData = {
      user_id: userProfile?.id,
      product_name: formData.productname,
      product_id: formData.product_id,  // Ensure this is properly formatted
      product_quantity: formData.productquantity.split(',').map(Number),
      total_price: totalPriceWithShipping, // Use the updated total price here
      payment_method: formData.paymentmethod,
      address: formData.address,
      shipfee: shippingFee,
      sub_total: formData.sub_total
    };
  
    try {
      const response = await axios.post(`${apiUrl}checkout`, orderData);
      console.log('Order submitted successfully:', response.data);
      // Update Snackbar state
      setSnackbarMessage('Thankyou for your order!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Delay navigation to allow Snackbar to show
      setTimeout(() => {
          navigate('/orders');
      }, 2000); // Delay in milliseconds (2000ms = 2 seconds)
    } catch (error) {
      console.error('Error submitting order:', error);
      // Update Snackbar state for error
      setSnackbarMessage('Order is failed!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);

      // Delay navigation in case of error too, if needed
      setTimeout(() => {
          navigate('/checkout');
      }, 2000);
    }

    
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }
    setSnackbarOpen(false);
  };
  


  const initialOptions: ReactPayPalScriptOptions = {
    clientId: `${Secretkey}`,
  };

  return (
    <div className="checkout-form">

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


      <h2 style={{ fontSize: '24px', padding: '12px' }}>CHECKOUT FORM</h2>
      <form className='form1' onSubmit={handleFormSubmission}>
    <div className="form-group">
      <label>Firstname</label>
      <input type="text" name="firstname" placeholder='Enter Firstname' value={userProfile?.first_name} className="form-control" readOnly />
    </div>
    <div className="form-group">
      <label>Lastname</label>
      <input type="text" name="lastname" placeholder='Enter Lastname' value={userProfile?.last_name} className="form-control" readOnly />
    </div>
    <div className="form-group">
      <label>Product name</label>
      <input type="text" name="productname" value={formData.productname} className="form-control" readOnly />
    </div>
    <div className="form-group">
      <label>Product quantity</label>
      <input type="text" name="productquantity" value={formData.productquantity} className="form-control" readOnly />
    </div>
    <div className="form-group">
      <label>Sub total</label>
      <input type="number" name="subtotal" value={formData.totalprice} className="form-control" readOnly />
    </div>
    <div className="form-group">
    <label>Total price</label>
    <input type="number" name="totalprice" value={(parseFloat(formData.totalprice) + formData.shipfee).toFixed(2)} className="form-control" readOnly />
</div>
    <div className="form-group">
      <label>Address</label>
      <input
        type="text"
        name="address"
        placeholder='Enter Address'
        value={formData.address}
        onChange={handleChange}
        className="form-control"
      />
      {showSuggestions && filteredAddresses.length > 0 && (
        <ul className="address-suggestions" style={{ backgroundColor: '#fff', maxHeight: '200px', overflowY: 'auto', width: '50%' }}>
          {filteredAddresses.map((address, index) => (
            <li key={index} onClick={() => handleAddressSelect(address)}>
              {address}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="form-group">
      <label>Shipping fee</label>
      <input type="number" name="shipfee" value={formData.shipfee} className="form-control" readOnly />
    </div>
    <div className="form-group">
      <label>Payment method</label>
      <select name="paymentmethod" className="form-control" onChange={handleChange}>
        <option value="">Select Payment Method</option>
        <option value="cod">Cash on delivery</option>
        <option value="paypal">PayPal</option>
      </select>
      {showPaypalButton && (
        <PayPalScriptProvider options={{ clientId: initialOptions.clientId, currency: "PHP" }}>
          <PayPalButtons
            createOrder={(_data, actions) => {
              const total_price = (parseFloat(formData.totalprice) + formData.shipfee).toFixed(2); // No need to parse shipfee

              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "PHP",
                    value: total_price // Amount in PHP
                  }
                }],
                intent: 'CAPTURE'
              });
            }}
            onApprove={async (_data, actions) => {
              if (actions.order) { // Check if actions.order is defined
                try {
                  const order = await actions.order.capture();
                  console.log('Order successful:', order);
                  
                  
                  // Prepare order data to send to the database
                  const orderData = {
                    user_id: userProfile?.id,
                    product_name: formData.productname,
                    product_id: formData.product_id,
                    product_quantity: formData.productquantity.split(',').map(Number), // Convert quantities to an array of numbers
                    total_price: (parseFloat(formData.totalprice) + formData.shipfee).toFixed(2), // Calculate total price including shipping
                    payment_method: 'paypal', // Set payment method to PayPal
                    address: formData.address,
                    shipfee: formData.shipfee
                  };
            
                  // Send order data to the backend for insertion
                  const response = await axios.post(`${apiUrl}checkout`, orderData);
                  console.log('Order inserted into database:', response.data);
                  // Update Snackbar state
      setSnackbarMessage('Thankyou for your order!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Delay navigation to allow Snackbar to show
      setTimeout(() => {
          navigate('/orders');
      }, 2000);
            
                  // Optionally, handle successful response (e.g., navigate to a success page)
                } catch (error) {
                  console.error('Error capturing order or inserting to database:', error);
                  // Update Snackbar state for error
                  setSnackbarMessage('Order is failed!');
                  setSnackbarSeverity('error');
                  setOpenSnackbar(true);

                  // Delay navigation in case of error too, if needed
                  setTimeout(() => {
                      navigate('/checkout');
                  }, 2000);
                }
              } else {
                console.error('Order actions not defined');
              }
            }}
            
            onError={(err) => {
              console.error('PayPal Checkout onError', err);
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
    <button type="submit" className='checkout-btn'>Submit</button>
  </form>
    </div>
  );
};

export default Checkout;
