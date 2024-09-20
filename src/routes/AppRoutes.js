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
import WishList from '../pages/client/WishList';
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
import AddNewUser from '../components/admin/parts/AddNewUser';
import OrderManagement from '../components/admin/parts/OrderManagement';
import AddNewSupplier from '../components/admin/parts/AddNewSupplier';
import WarehouseManagement from '../components/admin/parts/WarehouseManagement';
import WarehouseStockIn from '../components/admin/parts/WarehouseStockIn';
import PermissionManagement from '../components/admin/parts/PermissionManagement';
import NewPermission from '../components/admin/parts/NewPermission';
import FeedbackManagement from '../components/admin/parts/FeedbackManagement';

// Admin new pages
import UserTable from '../components/admin/parts/NewParts/body/UserManagement/UserTable';
import SuppliersTable from '../components/admin/parts/NewParts/body/SuppliersManagement/SuppliersTable';


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
      { path: '/wishlist', element: <WishList /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> }, // Trang mặc định cho admin
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      {
        path: 'users',
        children: [
          { path: 'add', element: <AddNewUser /> },
          { path: 'manage', element: <UserTable /> },
        ],
      },
      {
        path: 'orders',
        children: [
          { path: 'manage', element: <OrderManagement/>}
        ],
      },
      {
        path: 'suppliers',
        children: [
          { path: 'manage', element: <SuppliersTable/>},
          { path: 'add', element: <AddNewSupplier /> },
        ],
      },
      {
        path: 'warehouse',
        children: [
          { path: 'manage', element: <WarehouseManagement/>},
          { path: 'stock-in', element: <WarehouseStockIn /> },
        ],
      },
      {
        path: 'permission',
        children: [
          { path: 'manage', element: <PermissionManagement/>},
          { path: 'add', element: <NewPermission/> },
        ],
      },
      {
        path: 'feedback',
        children: [
          { path: 'manage', element: <FeedbackManagement/>},
        ],
      },
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
