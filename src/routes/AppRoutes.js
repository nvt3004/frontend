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
// Admin Pages
import Dashboard from '../pages/admin/Dashboard'; // Default Pages
import Settings from '../pages/admin/Settings';
import AddNewUser from '../components/admin/parts/AddNewUser';
import OrderManagement from '../components/admin/parts/OrderManagement';
import AddNewSupplier from '../components/admin/parts/AddNewSupplier';
import PermissionManagement from '../components/admin/parts/PermissionManagement';
import NewPermission from '../components/admin/parts/NewPermission';
import FeedbackManagement from '../components/admin/parts/FeedbackManagement';

// Admin new pages
import UserTable from '../components/admin/parts/NewParts/body/UserManagement/UserTable';
import SuppliersTable from '../components/admin/parts/NewParts/body/SuppliersManagement/SuppliersTable';
import ProductTable from '../components/admin/parts/NewParts/body/ProductManagement/ProductTable';
import NewProduct from '../components/admin/parts/NewParts/body/ProductManagement/NewProduct';
import StockIn from '../components/admin/parts/NewParts/body/WarehouseManagement/StockIn';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      { index: true, element: <Home /> }, // Trang mặc định cho client
      { path: '/home', element: <Home /> },
      { path: '/product', element: <Product /> },
      { path: '/product-detail', element: <ProductDetail /> },
      { path: '/shoping-cart', element: <ShopingCart /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog-detail', element: <BlogDetail /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
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
          { path: 'manage', element: <OrderManagement /> }
        ],
      },
      {
        path: 'suppliers',
        children: [
          { path: 'manage', element: <SuppliersTable /> },
          { path: 'add', element: <AddNewSupplier /> },
        ],
      },
      {
        path: 'warehouse',
        children: [
          // { path: 'manage', element: <WarehouseManagement/>},
          { path: 'stock-in', element: <StockIn /> },
        ],
      },
      {
        path: 'permission',
        children: [
          { path: 'manage', element: <PermissionManagement /> },
          { path: 'add', element: <NewPermission /> },
        ],
      },
      {
        path: 'feedback',
        children: [
          { path: 'manage', element: <FeedbackManagement /> },
        ],
      },
      {
        path: 'products',
        children: [
          { path: 'manage', element: <ProductTable /> },
          { path: 'new', element: <NewProduct /> },
        ],
      },
    ],
  },
  // {
  //   path: '/auth',
  //   element: <AuthLayout />,
  //   children: [
  //     { path: 'login', element: <Login /> },
  //     { path: 'register', element: <Register /> },
  //     { path: 'forgot-password', element: <ForgotPassword /> },
  //   ],
  // },
  {
    path: '*', // Catch-all route for 404 pages
    element: <div>404 Page Not Found</div>,
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
