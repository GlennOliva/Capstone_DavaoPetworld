import React, { useEffect, useState } from 'react';
import '../css/styles.css';
import '../css/search1.css'
import { Link } from 'react-router-dom';
import product_1 from '../e-commerce/images/betta-blue.png';
import product_2 from '../e-commerce/images/betta-siamese.png';
import axios from 'axios';

const Search = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface Product {
    id: number;
    product_name: string;
    store: string;
    product_price: string;
    store_name: string;
    image: string;
    category_name: string;
    product_description: string;
    product_quantity: number;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading true at the start
      try {
        const response = await axios.get('http://localhost:8081/product');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error fetching products. Please try again.');
      } finally {
        setLoading(false); // Set loading false whether request succeeds or fails
      }
    };

    fetchProducts();
  }, []);

  
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Set items per page

  // Filter products by search term
  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get current products to display
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  return (
    <>
   

           {/* All Products */}
           <section className="section all-products" id="products">
        <div className="top container1">
          <h1>All Fish Products</h1>
        </div>
        <div className="container1">
          <label htmlFor="search" className="search-label">Search Fish Products</label>
          <div className="search-container">
            <input
              type="text"
              id="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="bx bx-search search-icon"></i> {/* Magnifying glass icon */}
          </div>
        </div>

        <div className="product-center container1">
          {loading && <p>Loading products...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && currentProducts.map((product: Product) => (
            <div className="product_container" key={product.id}>
              <div className="product-item">
                <div className="overlay">
                  <Link to={`/product_details/${product.id}`} className="product-thumb">
                    <img src={`http://localhost:8081/uploads/${product.image}`} alt={product.product_name} />
                  </Link>
                </div>
                <div className="product-info" style={{ textAlign: 'justify', padding: '10px' }}>
                  <span style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Category:</span> 
                  <span style={{fontSize:'14px', color:'#000'}}>{product.category_name}</span>
                  <h1 style={{ fontSize: '15px' }}>{product.product_name}</h1>
                  <span style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Store:</span> 
                  <span style={{fontSize:'14px', color:'#000'}}>{product.store_name}</span>
                  <h4 style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Price:  
                    <span style={{fontSize:'14px', color:'#000', fontWeight:'normal'}}>₱{product.product_price}</span>
                  </h4>
                  <span style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Quantity: 
                    <span style={{fontSize:'14px', color:'#000', fontWeight: 'normal'}}>{product.product_quantity}</span> 
                  </span>
                  <p style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Description: 
                    <span style={{fontSize:'14px', color:'#000', fontWeight: 'normal'}}>{product.product_description}</span>
                  </p>
                </div>
                <ul className="icons">
                  <li>
                    <Link to={`/product_details/${product.id}`}>
                      <i className="bx bx-show"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart">
                      <i className="bx bx-cart"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

       {/* Pagination Section */}
      <section className="pagination">
        <div className="container1">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
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
    </>
  );
};

export default Search;
