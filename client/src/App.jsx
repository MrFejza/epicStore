import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; // Ensure these components exist
import Admin from './pages/Admin';
import Upload from './pages/Upload';
import Header from './components/Header';
import PrivateRoutes from './components/PrivateRoutes';
import Shemsia from './pages/Shemsia'; // Ensure Shemsia is imported
import Edit from './pages/Edit'; // Ensure Edit is imported
import Information from './pages/Information'; // Ensure Information is imported
import Orders from './pages/Orders';



function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/shemsia" element={<Shemsia />} /> {/* Add the closing tag here */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/information/:_id" element={<Information />} /> {/* Add the closing tag here */}
        <Route path="/edit/:_id" element={<Edit />} /> {/* Add the closing tag here */}

        {/* Private routes */}
        <Route element={<PrivateRoutes adminOnly={true} />}>
          <Route path="/upload" element={<Upload />} />
          {/* Add other private routes here */}
        </Route>

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />

        {/* Catch-all route for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
