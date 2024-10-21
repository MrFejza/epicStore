import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Upload from './pages/Upload';
import PrivateRoutes from './components/PrivateRoutes';
import Shemsia from './pages/Shemsia';
import Edit from './pages/Edit';
import Information from './pages/Information';
import Orders from './pages/Orders';
import Kategori from './pages/Kategori';
import { CartProvider } from './context/CartContext';
import { CheckoutModalProvider } from './context/CheckoutModalContext';
import Footer from './components/Footer';
import FAQs from './pages/FAQs';
import CategoryManagement from './pages/CategoryManagement';
import ManageProducts from './pages/ManageProducts';
import LogariaIme from './pages/LogariaIme';


function App() {
  return (
    <CheckoutModalProvider>
      <CartProvider>
        <Router>


          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />

            {/* Search Route */}
            <Route path="/search" element={<Kategori />} />

            {/* Category Route */}
            <Route path="/kategori/:category" element={<Kategori />} />

            {/* Information Route */}
            <Route path="/information/:_id" element={<Information />} />
            <Route path="/faq" element={<FAQs />} />
           
            
            

            {/* Admin and Other Pages */}
            <Route path="/sign-in" element={<Admin />} />
            <Route path="/sign-up" element={<Shemsia />} />

          
              <Route path='/llogaria-ime' element={<LogariaIme />} />
           

            {/* Private routes */}
            <Route element={<PrivateRoutes adminOnly={true} />}>
              <Route path="/orders" element={<Orders />} />
              <Route path="/edit/:_id" element={<Edit />} />
              <Route path="/upload" element={<Upload />} />
              <Route path='/menaxhimi-i-produkteve' element={<ManageProducts />} />
               <Route path='/menaxhimi-i-kategorive' element={<CategoryManagement />} />
            </Route>

            {/* Unauthorized route */}
            <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />

            {/* Catch-all route for undefined routes */}
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </CheckoutModalProvider>
  );
}

export default App;
