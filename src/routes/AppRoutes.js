import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Layouts
import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";

// Client Pages
import Home from "../pages/client/Home"; // Default Pages
import About from "../pages/client/About";
import Product from "../pages/client/Product";
import ProductDetail from "../pages/client/ProductDetail";
import ShopingCart from "../pages/client/Shoping-cart";
import Blog from "../pages/client/Blog";
import BlogDetail from "../pages/client/BlogDetail";
import Contact from "../pages/client/Contact";
import Account from "../pages/client/Account";
import WishList from "../pages/client/WishList";
import PageNotFound from "../pages/PageNotFound";
// Admin Pages
import Dashboard from "../pages/admin/Dashboard"; // Default Pages
import Settings from "../pages/admin/Settings";
import AddNewUser from "../components/admin/parts/AddNewUser";
import OrderManagement from "../components/admin/parts/OrderManagement";
import AddNewSupplier from "../components/admin/parts/AddNewSupplier";
import PermissionManagement from "../components/admin/parts/PermissionManagement";
import NewPermission from "../components/admin/parts/NewPermission";
import FeedbackManagement from "../components/admin/parts/FeedbackManagement";
import CustomerTable from "../components/admin/parts/NewParts/body/CustomerManagement/CustomerTable";
import ReceiptDetail from "../components/admin/parts/NewParts/body/WarehouseManagement/ReceiptDetail";
import Sale from "../components/admin/parts/NewParts/body/ProductManagement/Sale";
import AddSale from "../components/admin/parts/NewParts/body/ProductManagement/AddSale";
// Auth Pages
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PaymentSuccess from "../pages/client/PaymentSuccess";
import PaymentCancel from "../pages/client/PaymentCancel";
// Admin new pages
import UserTable from "../components/admin/parts/NewParts/body/UserManagement/UserTable";
import SuppliersTable from "../components/admin/parts/NewParts/body/SuppliersManagement/SuppliersTable";
import ProductTable from "../components/admin/parts/NewParts/body/ProductManagement/ProductTable";
import NewProduct from "../components/admin/parts/NewParts/body/ProductManagement/NewProduct";
import StockIn from "../components/admin/parts/NewParts/body/WarehouseManagement/StockIn";
import ProductCategories from "../components/admin/parts/NewParts/body/ProductManagement/ProductCategories";

import ProtectedRoute from "./ProtectedRoute";
import UpdateProduct from "../components/admin/parts/NewParts/body/ProductManagement/UpdateProduct";
import ReceiptList from "../components/admin/parts/NewParts/body/WarehouseManagement/ReceiptList";
import OrderTable from "../components/admin/parts/NewParts/body/OrderManagement/OrderTable";
import CouponTable from "../components/admin/parts/NewParts/body/CouponManagement/CouponTable";
import AdvertisementTable from "../components/admin/parts/NewParts/body/AdvertisementManagement/AdvertisementTable";
import NewAdvertisement from "../components/admin/parts/NewParts/body/AdvertisementManagement/NewAdvertisement";
import OrderDetail from "../components/admin/parts/NewParts/body/OrderManagement/OrderDetail";
import FeedbacksTable from "../components/admin/parts/NewParts/body/FeedbackManagement/FeedbacksTable";
const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <Home /> }, // Trang mặc định cho client
      { path: "/home", element: <Home /> },
      { path: "/product", element: <Product /> },
      { path: "/product-detail/:id", element: <ProductDetail /> },
      { path: "/product-detail", element: <ProductDetail /> },
      {
        path: "/shoping-cart",
        element: (
          <ProtectedRoute element={<ShopingCart />} requiredRole="User,Staff,Admin" />
        ),
      },
      { path: "/blog", element: <Blog /> },
      { path: "/blog-detail", element: <BlogDetail /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "/account",
        element: (
          <ProtectedRoute
            element={<Account />}
            requiredRole="User, Staff,Admin"
          />
        ),
      },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute
            element={<WishList />}
            requiredRole="User,Staff,Admin"
          />
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "customers/manage",
        element: (
          <ProtectedRoute
            element={<CustomerTable />}
            requiredRole="Admin,Staff"
          />
        ),
      },
      {
        index: true,
        element: (
          <ProtectedRoute element={<Dashboard />} requiredRole="Admin" />
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute element={<Dashboard />} requiredRole="Admin" />
        ),
      },
      {
        path: "settings",
        element: <ProtectedRoute element={<Settings />} requiredRole="Admin" />,
      },
      {
        path: "users",
        children: [
          {
            path: "add",
            element: (
              <ProtectedRoute
                element={<AddNewUser />}
                requiredRole="Admin,Staff"
              />
            ),
          },
          {
            path: "manage",
            element: (
              <ProtectedRoute
                element={<UserTable />}
                requiredRole="Admin,Staff"
              />
            ),
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            path: "manage",
            element: (
              <ProtectedRoute
                element={<OrderTable />}
                requiredRole="Admin,Staff"
              />
            ),
          },
        ],
      },
      {
        path: "suppliers",
        children: [
          {
            path: "manage",
            element: (
              <ProtectedRoute
                element={<SuppliersTable />}
                requiredRole="Admin,Staff"
              />
            ),
          },
          {
            path: "add",
            element: (
              <ProtectedRoute
                element={<AddNewSupplier />}
                requiredRole="Admin,Staff"
              />
            ),
          },
        ],
      },
      {
        path: "warehouse",
        children: [
          { path: "manage", element: <ReceiptList /> },
          { path: "stockin", element: <StockIn /> },
          { path: "detail", element: <ReceiptDetail /> },
        ],
      },
      {
        path: "coupon",
        children: [
          { path: "manage", element: <CouponTable /> },
        ],
      },
      {
        path: "advertisement",
        children: [
          { path: "new", element: <NewAdvertisement /> },
          { path: "manage", element: <AdvertisementTable /> },
        ],
      },
      {
        path: "feedback",
        children: [{ path: "manage", element: <FeedbacksTable /> }],
      },
      {
        path: "products",
        children: [
          { path: "manage", element: <ProductTable /> },
          { path: "new", element: <NewProduct /> },
          { path: "categories", element: <ProductCategories /> },
          { path: "update", element: <UpdateProduct /> },
          { path: "sale", element: <Sale /> },
          { path: "sale/add", element: <AddSale /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "*", // Catch-all route for 404 pages
    element: <PageNotFound />,
  },
  { path: "/pm-success", element: <PaymentSuccess /> },
  { path: "/pm-cancel", element: <PaymentCancel /> },
  { path: "/orders/:orderId", element: <OrderDetail /> },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
