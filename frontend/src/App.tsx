
import { Route, Routes } from 'react-router'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import Ecommerce from './e-commerce/Home'
import EcommerceNavbar from './e-commerce/Navbar'
import EcommerceFooter from './e-commerce/Footer'
import Product from './e-commerce/Product'
import Cart from './e-commerce/Cart'
import ProductDetails from './e-commerce/ProductDetails'
import Fish_Identify from './components/Fish_Identify'
import Login from './credentials/Login'
import Register from './credentials/Register'
import ProfileSettings from './components/Profile_settings'
import Friends from './components/Friends'
import Profile from './components/Profile'
import Orders from './e-commerce/Orders'
import Dashboard from './seller/Dashboard'
import Manage_Admin from './admin/Manage_Admin'
import Add_Admin from './admin/Add_Admin'
import Edit_Admin from './admin/Edit_Admin'
import Manage_User from './admin/Manage_User'
import Manage_Seller from './admin/Manage_Seller'
import Manage_Post from './admin/Manage_Post'
import Admin_Profile from './admin/Admin_Profile'
import Manage_Product from './seller/Manage_Product'
import Add_Product from './seller/Add_Product'
import Edit_Product from './seller/Edit_Product'
import Manage_Category from './seller/Manage_Category'
import Add_Category from './seller/Add_Category'
import Edit_Category from './seller/Edit_Category'
import { Seller_Register } from './credentials/Seller_Register'
import Manage_Order from './seller/Manage_Order'
import Edit_Order from './seller/Edit_Order'
import TermsCondition from './credentials/TermsCondition'
import UserProfile from './components/UserProfile'
import LandingPage from './credentials/LandingPage'
import Search from './e-commerce/Search'
import Category from './e-commerce/Category'
import Checkout from './e-commerce/Checkout'
import ForgotPass from './credentials/ForgotPass'
import ChangePassword from './credentials/ChangePassword'
import Manage_IncomeAnalytics from './seller/Manage_IncomeAnalytics'
import OrderReceipt from './e-commerce/OrderReceipt'
import Manage_Chat from './seller/Manage_Chat'
import AdminDashboard from './admin/Dashboard'
import Seller_Profile from './seller/Seller_Profile'
import Chat from './e-commerce/Chat'





const App = () => {
  return (
   
    <div>
      <Routes>

      <Route path="/forgotpass" element={
          <>

            <ForgotPass />
   
    
          </>
        } />

<Route path="/changepass" element={
          <>

            <ChangePassword />
   
    
          </>
        } />

      <Route path="/" element={
          <>

            <LandingPage />
   
    
          </>
        } />

      <Route path="/home" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />

<Route path='/user_profile/:id' element={
          <>
            <Navbar />
          <UserProfile/>
          <Footer />
          </>
        }/>

        <Route path="/ecommerce/:id" element={
          <>
            <EcommerceNavbar />
            <Ecommerce />
            <EcommerceFooter/>
          </>
        } />

<Route path="/category/:category_id" element={
          <>
            <EcommerceNavbar />
            <Category/>
            <EcommerceFooter/>
          </>
        } />


<Route path="/checkout" element={
          <>
            <EcommerceNavbar />
            <Checkout/>
            <EcommerceFooter/>
          </>
        } />

        
<Route path="/search" element={
          <>
            <EcommerceNavbar />
            <Search />
            <EcommerceFooter/>
          </>
        } />

<Route path="/product" element={
          <>
            <EcommerceNavbar />
            <Product />
            <EcommerceFooter/>
          </>
        } />

<Route path="/cart" element={
          <>
            <EcommerceNavbar />
            <Cart />
            <EcommerceFooter/>
          </>
        } />

<Route path="/product_details/:id" element={
          <>
            <EcommerceNavbar />
            <ProductDetails />
            <EcommerceFooter/>
          </>
        } />



<Route path="/fish_identify" element={
          <>
            <EcommerceNavbar />
            <Fish_Identify/>
            <EcommerceFooter/>
          </>
        } />


<Route path="/orders" element={
          <>
            <EcommerceNavbar />
            <Orders/>
            <EcommerceFooter/>
          </>
        } />

<Route path="/chat" element={
          <>
            <EcommerceNavbar />
            <Chat/>
            <EcommerceFooter/>
          </>
        } />


<Route path='/login' element={<Login/>} />

<Route path='/Register' element={<Register/>} />


<Route path="/profile_settings/:id" element={
          <>
            <Navbar />
            <ProfileSettings/>
            <Footer />
          </>
        } />


<Route path="/friends" element={
          <>
          
            
            <Navbar />
            <Friends/>
            <Footer />
          </>
        } />

        <Route path='/profile' element = {
          <>
          <Navbar />
              <Profile/>
              <Footer />
          </>
        }/>



        <Route path='/dashboard' element={
          <>
          <Dashboard/>
          </>
        }/>

        
<Route path='/manage_admin' element={
          <>
          <Manage_Admin/>
          </>
        }/>

<Route path='/add_admin' element={
          <>
          <Add_Admin/>
          </>
        }/>

<Route path='/edit_admin/:id' element={
          <>
          <Edit_Admin/>
          </>
        }/>


<Route path='/order_receipt/:id' element={
          <>
          <OrderReceipt/>
          </>
        }/>


<Route path='/manage_user' element={
          <>
          <Manage_User/>
          </>
        }/>


<Route path='/seller/manage_income' element={
          <>
          <Manage_IncomeAnalytics/>
          </>
        }/>


<Route path='/manage_seller' element={
          <>
          <Manage_Seller/>
          </>
        }/>


<Route path='/manage_post' element={
          <>
          <Manage_Post/>
          </>
        }/>


<Route path='/admin_profile/:id' element={
          <>
          <Admin_Profile/>
          </>
        }/>

<Route path='/seller_profile/:id' element={
          <>
          <Seller_Profile/>
          </>
        }/>


        <Route path='/termscondition' element={
          <>
            <TermsCondition/> 
          </>
        }/>





<Route path='/seller/manage_product' element={
          <>
          <Manage_Product/>
          </>
        }/>

<Route path='/seller/add_product' element={
          <>
          <Add_Product/>
          </>
        }/>

<Route path='/seller/edit_product/:id' element={
          <>
          <Edit_Product/>
          </>
        }/>

<Route path='/seller/manage_category' element={
          <>
          <Manage_Category/>
          </>
        }/>

<Route path='/seller/add_category' element={
          <>
          <Add_Category/>
          </>
        }/>

<Route path='/seller/edit_category/:id' element={
          <>
          <Edit_Category/>
          </>
        }/>


<Route path='/seller_register' element={
          <>
          <Seller_Register/>
          </>
        }/>


<Route path='/seller/manage_order' element={
          <>
          <Manage_Order/>
          </>
        }/>



<Route path='/seller/edit_order/:id' element={
          <>
          <Edit_Order/>
          </>
        }/>


<Route path='/seller/manage_chat' element={
          <>
          <Manage_Chat/>
          </>
        }/>


<Route path='/seller/dashboard' element={
          <>
          <Dashboard/>
          </>
        }/>


<Route path='/admin/dashboard' element={
          <>
          <AdminDashboard/>
          </>
        }/>

      </Routes>
    </div>
  )
}

export default App