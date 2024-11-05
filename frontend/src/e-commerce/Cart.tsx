import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  product_name: string;
  product_price: number;
  image: string;
  store_name: string;
  category_name: string;
  quantity: number;
  subtotal: number;
  product_id: number;
}


const Cart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Ensure initial state is an array
  const userId = localStorage.getItem('user_id'); // Retrieve user_id from localStorage
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

   // Fetch products for the cart based on user_id
   const fetchCartProducts = async () => {
    try {
      if (!userId) {
        console.error('No user_id found in localStorage');
        return;
      }

      const response = await fetch(`http://localhost:8081/products_cart?user_id=${userId}`); // Pass user_id as query param
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data); // Only set products if the fetched data is an array
      } else {
        console.error('Expected array but got:', data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  // Calculate subtotal and total
  const calculateSubtotal = (price: number, quantity: number) => price * quantity;
  const calculateTotal = () => products.reduce((total, product) => total + product.subtotal, 0);


  
   // Handle product removal from the cart
const handleRemove = async (cartId: number) => {
  try {
    const response = await axios.post('http://localhost:8081/remove_cart_item', { id: cartId });
    
    if (response.data.success) {
      // Remove the product from the local state
      setProducts(products.filter(product => product.id !== cartId));
      // Update Snackbar state
      setSnackbarMessage('Product removed from cart!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Delay navigation to allow Snackbar to show
      setTimeout(() => {
        // Use window.location to navigate and reload the page
        window.location.href = '/cart'; // This will reload the page
      }, 2000); // Delay in milliseconds (2000ms = 2 seconds)
      
    } else {
      console.error('Failed to remove product:', response.data.message);
      // Update Snackbar state for error
      setSnackbarMessage('Failed to delete from the cart');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);

      // Delay navigation in case of error too, if needed
      setTimeout(() => {
        // Use window.location to navigate and reload the page
        window.location.href = '/cart'; // This will reload the page
      }, 2000);
    }
  } catch (error) {
    console.error("Error removing product:", error);
  }
};



    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
          return;
      }
      setSnackbarOpen(false);
    };


    const handleCheckout = () => {
      const totalPrice = calculateTotal();
    
      // Create arrays for product IDs and quantities
      const productIds: number[] = [];
      const productQuantities: number[] = [];
    
      // Populate the arrays with product IDs and quantities
      products.forEach(product => {
        productIds.push(product.product_id); // Collecting product IDs
        productQuantities.push(product.quantity); // Collecting quantities
      });
    
      // Convert arrays to comma-separated strings
      const productIdsString = productIds.join(', ');
      const productQuantitiesString = productQuantities.join(', ');
    
      // Prepare product details array with necessary fields
      const productDetails = products.map(product => ({
        product_id: product.product_id,
        name: product.product_name,
        price: product.product_price,
        quantity: product.quantity,
        subtotal: calculateSubtotal(product.product_price, product.quantity), // Assuming subtotal calculation is still needed
      }));
    
      console.log("Product Details:", productDetails); // Debugging line
      console.log("Total Price:", totalPrice); // Debugging line
      console.log("Product IDs:", productIdsString); // Debugging line
      console.log("Product Quantities:", productQuantitiesString); // Debugging line
    
      if (productDetails.length > 0) {
        navigate('/checkout', {
          state: {
            products: productDetails,
            totalPrice,
            productIds: productIdsString, // Include product IDs as a string
            productQuantities: productQuantitiesString // Include quantities as a string
          },
        });
      } else {
        console.error('No products to checkout');
      }
    };
    
    
    
  return (

   

    <div className="container cart">

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

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
        {products.length > 0 ? (
            products.map((product, index) => (
          <tr key={index}>
            <td>
            <div className="cart-info">
  <img 
    src={`http://localhost:8081/uploads/${product.image}`} 
    alt={product.product_name} 
    className="product-image" 
  />
  <div className="product-details">
    <span className="category">{product.category_name}</span>
    <h3 className="product-name">{product.product_name}</h3>
    <span className="store-name">{product.store_name}</span>
    <h4 className="product-price">₱{product.product_price}</h4>
    <a 
                        href="#"
                        className="remove-link"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default anchor behavior
                          handleRemove(product.id); // Call handleRemove with cart_id
                        }}
                      >
                        remove
                      </a>
  </div>
</div>

            </td>
            <td>
                  <input
                    type="number"
                    defaultValue={product.quantity}
                    min="1"
                  />
                </td>
                <td>₱{calculateSubtotal(product.product_price, product.quantity).toFixed(2)}</td>
          </tr>

))
) : (
  <tr>
    <td colSpan={3}>No products in the cart</td>
  </tr>
)}
        </tbody>
        <table style={{ textAlign: 'right', marginLeft: '50%' }}>
        <tbody>
    
          <tr>
            <td>Total</td>
            <td><h4>₱{(calculateTotal()).toFixed(2)}</h4></td>
          </tr>
          <tr>
          <td colSpan={2} style={{ textAlign: 'right' }}>
  <button className="checkout btn responsive-button" onClick={handleCheckout}>Proceed to Checkout</button>
</td>

          </tr>
        </tbody>
      </table>


        
      </table>
      
      
    </div>
  );
};

export default Cart;
