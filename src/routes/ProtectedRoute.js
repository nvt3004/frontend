import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { stfExecAPI } from "../stf/common";

const quyenAdmin = [
  "/admin/users/manage",
  "/admin/customers/manage",
  "/admin/dashboard",
];

const listQuyen = [
  { to: "/admin/products/categories", role: "Category" },
  { to: "/admin/products/manage", role: "Product" },
  { to: "/admin/products/new", role: "Product", action: "add" },
  { to: "/admin/products/update", role: "Product", action: "update" },
  { to: "/admin/products/sale", role: "Sale" },
  { to: "/admin/products/sale/add", role: "Sale", action: "add" },
  { to: "/admin/products/sale/update", role: "Sale", action: "update" },
  { to: "/admin/feedback/manage", role: "Feedback" },
  { to: "/admin/orders/manage", role: "Order" },
  { to: "/admin/suppliers/manage", role: "Supplier" },
  { to: "/admin/warehouse/stockin", role: "Receipt", action: "add" },
  { to: "/admin/warehouse/manage", role: "Receipt", action: "view" },
  { to: "/admin/coupon/manage", role: "Coupon" },
  { to: "/admin/advertisement/manage", role: "Advertisement" },
  { to: "/admin/advertisement/new", role: "Advertisement", action: "add" },
];

const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, role, loading: authLoading, profile } = useAuth();
  const location = useLocation();
  const [isAllowed, setIsAllowed] = useState(null); // Trạng thái quyền
  const [loading, setLoading] = useState(true); // Trạng thái chờ
  const pathNow = location?.pathname;

  useEffect(() => {
    const checkPermissions = async () => {
      setLoading(true); // Bắt đầu kiểm tra quyền

      // Nếu người dùng chưa đăng nhập, từ chối quyền
      if (!isAuthenticated) {
        setIsAllowed(false);
        setLoading(false);
        return;
      }

      // Kiểm tra quyền admin
      if (quyenAdmin.includes(pathNow) && role?.toLowerCase() !== "admin") {
        setIsAllowed(false);
        setLoading(false);
        return;
      }

      // Gọi API để lấy danh sách quyền
      const [error, data] = await stfExecAPI({
        url: `api/staff/userpermissions/${profile?.listData?.userId}`,
      });

      if (data) {
        const quyens = data.data;
        const duongDanQuyen = listQuyen.find((i) => i.to === pathNow);

        if (duongDanQuyen) {
          const quyenCsdl = quyens.find(
            (i) => i.title.toLowerCase() === duongDanQuyen.role.toLowerCase()
          );

          if (quyenCsdl && duongDanQuyen.action) {
            const isCoQuyen = quyenCsdl.permission.find(
              (q) =>
                q.name.toLowerCase() === duongDanQuyen.action.toLowerCase() &&
                q.use
            );
            if (!isCoQuyen) {
              setIsAllowed(false);
              setLoading(false);
              return;
            }
          } else if (quyenCsdl) {
            const isCoQuyen = quyenCsdl.permission.some((q) => q.use);
            if (!isCoQuyen) {
              setIsAllowed(false);
              setLoading(false);
              return;
            }
          }
        }
      }

      // Người dùng có quyền
      setIsAllowed(true);
      setLoading(false);
    };

    checkPermissions();
  }, [isAuthenticated, pathNow, profile?.listData?.userId, role]);

  // Hiển thị "Loading" trong khi chờ kiểm tra quyền
  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  // Điều hướng nếu không có quyền
  if (!isAllowed) {
    return <Navigate to="/not-found-page" />;
  }

  // Hiển thị nội dung khi có quyền
  return element;
};

export default ProtectedRoute;
