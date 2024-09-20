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
import AddNewUser from '../components/admin/parts/AddNewUser';
import ManageUsers from '../components/admin/parts/ManageUsers';
import OrderManagement from '../components/admin/parts/OrderManagement';
import SupplierManagement from '../components/admin/parts/SuppliersManagement';
import AddNewSupplier from '../components/admin/parts/AddNewSupplier';
import WarehouseManagement from '../components/admin/parts/WarehouseManagement';
import AddNewWarehouse from '../components/admin/parts/AddNewWarehouse';
import WarehouseStockIn from '../components/admin/parts/WarehouseStockIn';
import PermissionManagement from '../components/admin/parts/PermissionManagement';
import NewPermission from '../components/admin/parts/NewPermission';
import FeedbackManagement from '../components/admin/parts/FeedbackManagement';

// Admin new pages
import UserTable from '../components/admin/parts/NewParts/body/UserManagement/UserTable';
import SuppliersTable from '../components/admin/parts/NewParts/body/SuppliersManagement/SuppliersTable';

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
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
