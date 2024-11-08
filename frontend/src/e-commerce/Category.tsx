import { useState, useEffect } from 'react';
import '../css/styles.css';
import '../css/search1.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Category = () => {
  const { category_id } = useParams();  // Get the category_id from the URL
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);  // State to hold the products
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const apiUrl = import.meta.env.VITE_API_URL;
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Set items per page

  // Fetch products based on category_id
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}fetch_product_category/${category_id}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError("Error fetching products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category_id]);  // Trigger fetch when category_id changes

  // Interface for Product
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

  // Filter products by search term
  const filteredProducts = products.filter((product: Product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get current products to display
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) return <p>Loading products...</p>;  // Show loading state
  if (error) return <p>{error}</p>;  // Show error message

  return (
    <>
      <section className="section all-products" id="products">
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

        {/* All products */}
        <div className="product-center container1">
          {loading && <p>Loading products...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && currentProducts.map((product: Product) => (
            <div className="product_container" key={product.id}>
              <div className="product-item">
                <div className="overlay">
                  <Link to={`/product_details/${product.id}`} className="product-thumb">
                    <img src={`${apiUrl}uploads/${product.image}`} alt={product.product_name} />
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

export default Category;
