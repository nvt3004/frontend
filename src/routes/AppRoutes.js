import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';

// Client Pages
import Home from '../pages/client/Home'; // Default Pages
import About from '../pages/client/About';
import Product from '../pages/client/Product';
import ProductDetail from '../pages/client/ProductDetail';
import ShopingCart from '../pages/client/Shoping-cart';
import Blog from '../pages/client/Blog';
import BlogDetail from '../pages/client/BlogDetail';
import Contact from '../pages/client/Contact';
import Account from '../pages/client/Account';
import Favourite from '../pages/client/Favourite';
import PageNotFound from '../pages/PageNotFound';
// Admin Pages
import Dashboard from '../pages/admin/Dashboard'; // Default Pages
import Settings from '../pages/admin/Settings';
// Auth Pages
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      { index: true, element: <Home /> }, // Trang mặc định cho client
      { path: '/home', element: <Home /> },
      { path: '/product', element: <Product /> },
      { path: '/product-detail', element: <ProductDetail/> },
      { path: '/shoping-cart', element: <ShopingCart /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog-detail', element: <BlogDetail /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/account', element: <Account /> },
      { path: '/favourite', element: <Favourite /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> }, // Trang mặc định cho admin
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },
  {
    path: '*', // Catch-all route for 404 pages
    element: <PageNotFound/>,
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
