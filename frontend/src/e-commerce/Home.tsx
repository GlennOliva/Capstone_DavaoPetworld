import { useEffect, useState } from 'react';
import '../css/styles.css'
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import hero_1 from '../e-commerce/images/10-Gallon Curved Corner Saltwater Aquarium Rimless Low Iron Aquarium Marine Fish Tank Reef Tank with Lid, Protein Skimmer, LED Light, Filter Media and Pump (Black, Premium All-in-One Kits) for 5000.png'
import hero_2 from '../e-commerce/images/TetraMin Tropical Granules 100g for 1,383 pesos.png'
import hero_3 from '../e-commerce/images/betta-siamese.png'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  useEffect(() => {
    const initializeGlide = () => {
      const glideElement = document.querySelector('#glide_1') as HTMLElement | null;
      
      if (glideElement) {
        try {
          new Glide(glideElement, {
            type: 'carousel',
            startAt: 0,
            gap: 10, // Adjust gap if needed
            hoverpause: true,
            perView: 1, // Show one slide at a time
            animationDuration: 1000, // Increase duration for slower transitions
            animationTimingFunc: 'ease', // Use 'ease' for smoother transitions
            autoplay: 3000, // Adjust autoplay interval (in milliseconds) if needed
          }).mount();
          console.log('Glide initialized successfully');
        } catch (error) {
          console.error('Error initializing Glide:', error);
        }
      } else {
        console.error('Glide element not found');
      }
    };

    // Initialize Glide.js
    initializeGlide();
  }, []);


  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}categories`); // Make sure this points to your correct backend route
        setCategories(response.data); // Set the categories from the response
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

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
        const response = await axios.get(`${apiUrl}product`);
        console.log("Fetched products:", response.data); // Log the data to see if only 6 are fetched
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
  
  

  return (
    <>
       <div className="hero">
        <div className="glide" id="glide_1">
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              <li className="glide__slide">
              <div className="center">
  <div className="left">
    <span>Transform Your Space</span>
    <h1>STYLISH AND FUNCTIONAL AQUARIUMS</h1>
    <p>Create the perfect home for your fish with our modern, high-quality aquariums. Designed for beauty and practicality, they fit seamlessly into any space.</p>
    
    <Link to="/product" className="hero-btn">Explore Aquariums</Link>
  </div>
  <div className="right" style={{marginBottom:'10%'}}>
    <img className="img1" src={hero_1} alt="Aquarium Image" />
  </div>
</div>
              </li>
              <li className="glide__slide">
              <div className="center">
  <div className="left">
    <span>Discover Vibrant Fish Species</span>
    <h1>EXQUISITE BETTAS AND ORNAMENTAL FISH</h1>
    <p>Browse through a variety of beautiful fish species, from colorful bettas to unique ornamental fish. Perfect for hobbyists and collectors alike.</p>
    
    <Link to="/product" className="hero-btn">Shop Fish</Link>
  </div>
  <div className="right">
    <img className="img1" src={hero_3} alt="Fish Image" />
  </div>
</div>
              </li>


              <li className="glide__slide">
              <div className="center">
  <div className="left">
    <span>Keep Your Fish Healthy</span>
    <h1>NUTRITIOUS FISH FOOD FOR EVERY SPECIES</h1>
    <p>Ensure your fish are getting the best nutrition with our selection of high-quality fish food. From pellets to flakes, we have what your fish need to thrive.</p>
    
    <Link to="/product" className="hero-btn">Shop Fish Food</Link>
  </div>
  <div className="right" style={{marginBottom:'12%'}}>
    <img className="img1" src={hero_2} alt="Fish Food Image"  />
  </div>
</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="section category">
      <div className="title">
        <h1>CATEGORIES</h1>
      </div>
      <div className="cat-center">
        {categories.map((category) => (
          <Link 
            key={category['id']} 
            to={`/category/${category['id']}`} 
            className='cat'>
            <img   src={`${apiUrl}uploads/${category['image']}`}  alt={category['category_name']} /> {/* Assuming you have an image_url field */}
            <div>
            <p>{category['category_name']}</p>

            </div>
          </Link>
        ))}
      </div>
    </section>



      {/* New Arrivals */}
      <section className="section new-arrival">
        <div className="title">
          <h1>SHOP</h1>
          <p>All the latest picked fish species of our store</p>
        </div>

        <div className="product-center">
          {products.slice(0,6).map((product: Product) => (
            <div className="product_container" key={product.id}>
              <div className="product-item">
                <div className="overlay">
                  <Link to={`/product_details/${product.id}`} className="product-thumb">
                    <img  src={`${apiUrl}uploads/${product.image}`} alt={product.product_name} />
                  </Link>
                </div>
                <div className="product-info" style={{ textAlign: 'justify', padding: '10px' }}>
                    <span style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Category:</span> <span style={{fontSize:'14px', color:'#000'}}>{product.category_name}</span>
                    <h1 style={{ fontSize: '15px' }}>{product.product_name}</h1>
                    <span style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Store:</span> <span style={{fontSize:'14px', color:'#000'}}>{product.store_name}</span>
                    <h4 style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Price:  <span style={{fontSize:'14px', color:'#000', fontWeight:'normal'}}>₱{product.product_price}</span></h4>
                    <span style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Quantity: <span style={{fontSize:'14px', color:'#000', fontWeight: 'normal'}}>{product.product_quantity}</span> </span>
                    <p style={{fontSize:'15px',fontWeight:'bold', color:'#000'}}>Description: <span style={{fontSize:'14px', color:'#000', fontWeight: 'normal'}}>{product.product_description}</span></p>
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

      

      
    </>
  );
};

export default Home;
