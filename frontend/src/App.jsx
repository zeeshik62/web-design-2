import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';

// Public Pages
import Home from './pages/public/Home';
import HallsList from './pages/public/HallsList';
import HallDetail from './pages/public/HallDetail';
import VendorsList from './pages/public/VendorsList';
import VendorDetail from './pages/public/VendorDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerHalls from './pages/owner/Halls';
import OwnerVendors from './pages/owner/Vendors';
import OwnerCustomers from './pages/owner/Customers';
import OwnerQueries from './pages/owner/Queries';
import OwnerProfile from './pages/owner/Profile';
import OwnerLogin from './pages/owner/Login';
import OwnerRegister from './pages/owner/Register';
import OwnerVerify from './pages/owner/Verify';
import OwnerForgotPassword from './pages/owner/ForgotPassword';
import OwnerResetPassword from './pages/owner/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="halls" element={<HallsList />} />
          <Route path="halls/:id" element={<HallDetail />} />
          <Route path="vendors" element={<VendorsList />} />
          <Route path="vendors/:id" element={<VendorDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Owner Auth Routes (No Sidebar) */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<OwnerRegister />} />
        <Route path="/owner/verify" element={<OwnerVerify />} />
        <Route path="/owner/forgot-password" element={<OwnerForgotPassword />} />
        <Route path="/owner/reset-password" element={<OwnerResetPassword />} />

        {/* Owner Dashboard Routes with OwnerLayout */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="halls" element={<OwnerHalls />} />
          <Route path="vendors" element={<OwnerVendors />} />
          <Route path="customers" element={<OwnerCustomers />} />
          <Route path="queries" element={<OwnerQueries />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
