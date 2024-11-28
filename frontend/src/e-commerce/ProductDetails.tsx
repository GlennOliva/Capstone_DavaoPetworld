import React, { useState, useEffect } from 'react';
import '../css/styles.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams(); // Get the productId from URL parameters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // State to track selected quantity
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const navigate = useNavigate();
  const [, setSnackbarOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}product_details/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem('user_id');
    if (!userId) {
        setSnackbarMessage('User not logged in');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return; // Exit early if user is not logged in
    }

    try {
        // Send a request to add the product to the cart
        const response = await axios.post(`${apiUrl}addcart`, {
            product_id: id,
            user_id: userId,
            quantity: quantity,
        });

        console.log('Response:', response);

        // Show success Snackbar
        setSnackbarMessage('Product Added to Cart!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Delay navigation to product page
        setTimeout(() => {
            window.location.reload();
        }, 2000); // 2 seconds delay
    } catch (error: any) {
        // Check for specific error in response
        if (error.response && error.response.data && error.response.data.error === 'Sorry, insufficient stock available.') {
            setSnackbarMessage('Sorry, insufficient stock');
        } else {
            setSnackbarMessage('Failed to add product to cart');
        }

        setSnackbarSeverity('error');
        setOpenSnackbar(true);

        // Optional: Delay navigation to product details if needed
        setTimeout(() => {
            navigate(`/product_details/${id}`);
        }, 2000); // 2 seconds delay
    }
};


  


  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <section className="section product-detail">

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

      {product && ( // Ensure the product is not null before rendering details
        <div className="details container" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', width:'80%', padding:'5%' }}>
          <div className="left image-container">
            <div className="main">
              <img src={`${apiUrl}uploads/${product.image}`} id="zoom" alt={product.product_name} />
            </div>
          </div>
          <div className="right">
            <span style={{fontSize:'16px', fontWeight:'bold'}}>Category: </span> <span>{product.category_name}</span>
            <h1>{product.product_name}</h1>
            <h4>Quantity: <span style={{fontWeight:'normal'}}>{product.product_quantity}</span></h4>
            <h4>Price: <span style={{fontWeight:'normal'}}>₱{product.product_price}</span></h4>
            <h4>Store: <span style={{fontWeight:'normal'}}>{product.store_name}</span></h4>
            <h3>Product Details</h3>
            <p style={{textAlign: 'justify'}}>
              {product.product_description}
            </p>

            <form className="form" onSubmit={handleAddToCart} style={{ display: 'flex', alignItems: 'left', gap: '10px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <label htmlFor="quantity" style={{ fontSize: '14px', fontWeight: '500' }}>Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{
                    width: '60px',
                    padding: '8px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                  }}
                />
              </div>
              
              <button
                type="submit"
                className="addCart"
                style={{
                  backgroundColor: '#1876F2',  // Green background
                  color: '#fff',  // White text color
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1876F2'} // Hover effect
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1876F2'}
              >
                Add To Cart
              </button>
            </form>
          </div>
        </div>
      )}
      </section>
    </>
  );
};

export default ProductDetails;
