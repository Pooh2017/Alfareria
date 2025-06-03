import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboard from '../pages/AdminDashboard';
import ArtesanosPage from '../pages/ArtesanosPage';
import NotFound from '../pages/NotFound';

import PrivateRoute from './PrivateRoute';

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/artesanos"
        element={
        <PrivateRoute>
           <ArtesanosPage />
        </PrivateRoute>
        }
      />
        <Route
    path="/admin/dashboard"
    element={
      <PrivateRoute>
        <AdminDashboard />
      </PrivateRoute>
    }
  />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </Router>
);

export default AppRouter;
