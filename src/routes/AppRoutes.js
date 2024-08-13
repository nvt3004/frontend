import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';

// Client Pages
import Home from '../pages/client/Home';
import About from '../pages/client/About';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import Settings from '../pages/admin/Settings';

// Default Pages
import DefaultClientPage from '../pages/client/index';
import DefaultAdminPage from '../pages/admin/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      { index: true, element: <DefaultClientPage /> }, // Trang mặc định cho client
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DefaultAdminPage /> }, // Trang mặc định cho admin
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
