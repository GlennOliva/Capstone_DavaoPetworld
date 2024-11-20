import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/landingpage.css';
import fish1 from '../credentials/images/hero-bgnew1.png';
import fish2 from '../credentials/images/hero-bgnew2.png';
import fish3 from '../credentials/images/hero-bgnew3.png';
import fish4 from '../credentials/images/hero-bgnew4.png';
import fish5 from '../credentials/images/hero-bgnew5.png';
import client2 from '../credentials/images/client1.jpg';
import service1 from '../credentials/images/bullhorn.png'
import service2 from '../credentials/images/online-store.png'
import service3 from '../credentials/images/magnifying-glass-and-fish.png'

const LandingPage: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(1);
  
  const images = [
    { src: fish1, alt: 'Japanese Koi' },
    { src: fish2, alt: 'Betta Siamese' },
    { src: fish3, alt: 'Metalic Blue skin guppy' },
    { src: fish4, alt: 'Gold fish' },
    { src: fish5, alt: 'Curl Corydoras' },
  ];

  // Handle next/previous slide controls
  const plusSlides = (n: number) => {
    let newIndex = slideIndex + n;
    if (newIndex > images.length) newIndex = 1;
    if (newIndex < 1) newIndex = images.length;
    setSlideIndex(newIndex);
  };



  return (
    <div>
      <Navbar />

    {/* Hero Banner Section */}
<div 
  className="hero-banner" 
  id='home' 
  style={{ 
    backgroundImage: `url(${images[slideIndex - 1].src})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    width: '100%',
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: '#fff'
  }}
>
  {/* Overlay */}
  <div className="overlay" style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  }}></div>





  {/* Next and Previous Buttons */}
  <a className="prev" onClick={() => plusSlides(-1)} style={{
    position: 'absolute',
    top: '50%',
    left: '10px',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 2
  }}>&#10094;</a>
  
  <a className="next" onClick={() => plusSlides(1)} style={{
    position: 'absolute',
    top: '50%',
    right: '10px',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 2
  }}>&#10095;</a>
</div>


      {/* About section */}
      <section className="about-section" id='about'>
        <h2 className="about-title">ABOUT</h2>
        <div className="about-content">
          <div className="about-paragraph">
          <p>
    Davao Pet World is a platform that combines the social aspects of a community with the convenience of ecommerce, offering a unique space for fish enthusiasts to connect, shop, and learn. The platform provides a user-friendly interface for creating profiles, sharing experiences, and engaging with fellow fish lovers. One standout feature is the Fish Identification service powered by TensorFlow.js, which allows users to upload images of fish for instant identification using machine learning algorithms. This feature is particularly beneficial for hobbyists looking to learn more about their fish and sellers ensuring compliance with regulations regarding endangered species.

    Davao Pet World offers a wide variety of fish and aquarium products, catering to all your fishkeeping needs. It facilitates seamless transactions, making it easy to browse and purchase items. The platform also partners with reputable local clients like Davao Petworld and V&A Fishville Petshop, providing a trustworthy marketplace filled with high-quality fish and accessories.

    To enhance your shopping experience, Davao Pet World offers flexible payment methods, such as Cash on Delivery (COD) or secure online transactions provided by PayPal. The goal is to make purchasing your favorite fish and aquarium supplies as smooth as possible, allowing you to focus on caring for your aquatic companions.

    Davao Pet World is more than just an ecommerce platform; it is a community that celebrates the joy of fishkeeping. Join Davao Pet World today and discover a world where you can connect with other fish enthusiasts, shop for your favorite products, and easily identify the fish you encounter. Together, let's nurture our passion for aquatic life and create a vibrant ecosystem of knowledge and support.
</p>

          </div>
        </div>
      </section>


   {/* Services section */}
<section className="services-section" id='services'>
  <h2 className="services-title">SERVICES</h2>
  <div className="services-container">
    
    {/* Social Service */}
    <div className="service-card">
      <img src={service1} alt="Social Service" className="service-image" />
      <h3>Social</h3>
      <p>
        Our platform provides a vibrant social space for fish enthusiasts to connect, share, and learn. Users can create profiles, post updates, share fish-related content, and interact with others in the community. Whether you're looking to showcase your latest fish collection, share your aquarium setup, or get advice from fellow hobbyists, our social features make connecting with the fish-loving community easy and enjoyable.
      </p>
    </div>

    {/* Ecommerce Service */}
    <div className="service-card">
      <img src={service2} alt="Ecommerce Service" className="service-image" />
      <h3>Ecommerce</h3>
      <p>
        Our ecommerce service allows users to browse and purchase a wide range of fish species, habitats, and aquarium products. Sellers can manage their inventory and track sales with ease, while buyers can enjoy a seamless shopping experience with features like add-to-cart and multiple payment options. Whether you're in the market for Betta fish, ornamental fish, or high-quality fish supplies, our ecommerce platform has you covered.
      </p>
    </div>

    {/* Fish Identification Service */}
    <div className="service-card">
      <img src={service3} alt="Fish Identification Service" className="service-image" />
      <h3>Fish Identification</h3>
      <p>
        Our advanced Fish Identification service allows users to upload or capture images of fish and instantly identify their species using cutting-edge AI technology. Powered by TensorFlow.js and trained with a vast dataset of fish species, this tool makes it easier than ever to recognize fish breeds, including endangered species. Whether you're a seller ensuring compliance with wildlife laws or a hobbyist curious about your new pet, our identification service provides accurate results in seconds.
      </p>
    </div>

  </div>
</section>



 {/* Clients section */}
<section className="clients-section" id='clients'>
  <h2 className="clients-title">CLIENT</h2>
  <div className="clients-container">
    {/* <div className="client">
      <img src={client1} alt="Client 1" className="client-image" />
      <div className="client-details">
        <h3>FISHVILLE</h3>
        <p>V&A Fishville Petshop, established in 2017, is a leading pet fish shop in the Philippines. The shop, located in Buhangin, Davao City, specializes in Betta fish and ornamental fish, offering a wide range of aquatic species to cater to the diverse preferences of fish hobbyists. The store's convenient location in Buhangin, near San Isidro Elementary School, makes it easily accessible to locals and fish lovers. The friendly staff at V&A Fishville Petshop provide expert advice on fish care, tank setup, and maintenance, ensuring both beginners and experienced hobbyists can create and sustain thriving aquatic environments. With multiple branches across the country, the shop continues to expand its presence, reaching a broader audience of aquarium enthusiasts who value quality, variety, and expertise. Each branch upholds the company's mission to provide healthy and vibrant fish, ensuring customer satisfaction. V&A Fishville Petshop has established itself as a trusted brand in the aquatic pet industry, with a loyal following due to its commitment to high-quality fish breeds and excellent customer service.</p>
      </div>
    </div> */}
    <div className="client">
  <div className="client-details">
    <h3>PETWORLD</h3>
    <p>Davao Petworld, established in 2016, is a popular destination for fish enthusiasts in Davao City. The pet shop, located at Door #2, Gahol Building, Ponciano Reyes Street, offers a wide selection of aquatic pets and supplies, catering to both beginners and seasoned aquarium hobbyists. The shop specializes in Betta fish, known for their vibrant colors and striking fin displays, and ensures their well-cared for Betta fish are healthy and active. The store also offers a vast range of ornamental fish, from goldfish to guppies, each contributing to the aesthetic beauty of home aquariums. The knowledgeable staff is always ready to provide guidance on setting up and maintaining these fish. Davao Petworld has become a hub for fish lovers in Davao City, thanks to its commitment to quality and customer satisfaction. The shop's location in Ponciano Reyes Street is highly convenient for pet owners, making it a popular choice for fish-related needs. Over the years, Davao Petworld has grown in popularity, with many returning customers who trust the shop for their aquatic pets. The shop continues to expand its offerings, aiming to be the go-to place for fish lovers across the city.</p>
  </div>
  <img src={client2} alt="Client 2" className="client-image" />
</div>

  </div>
</section>


{/* Location section */}


<div className="location-section" id='location'>
  <h2 style={{margin: '2%'}}>LOCATION</h2>
  
  <div className="location">
    <div className="location-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.4891006677044!2d125.60707437454192!3d7.069149816583012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96d9d61c76eeb%3A0xdb96ad8bb077a261!2sPet%20World!5e0!3m2!1sen!2sph!4v1727873603122!5m2!1sen!2sph"
        width="1500"
        height="500"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Fishville Location"
      ></iframe>
      <h3>DAVAO PETWORLD LOCATION</h3>
    </div>

    {/* <div className="location-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.118252260696!2d125.61769177454244!3d7.11229251604218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96c67fc3ace85%3A0xbed7170330a79956!2sV%26A%20Fish%20Ville%20Petshop!5e0!3m2!1sen!2sph!4v1727873515920!5m2!1sen!2sph"
        width="1500"
        height="500"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Petworld Location"
      ></iframe>
      <h3>FISHVILLE LOCATION</h3>
    </div> */}
  </div>
</div>






      <Footer />
    </div>
  );
};

export default LandingPage;
