import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { HiUserCircle } from "react-icons/hi";
import { Outlet, Link, Navigate } from "react-router-dom";
import { getProfile } from "../services/api/OAuthApi";
import { FaAdversal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { stfExecAPI } from "../stf/common";
import Cookies from "js-cookie";
import {
  CaretDown,
  CaretLeft,
  HouseSimple,
  User,
  FileText,
  CalendarBlank,
  ChartBar,
  Gear,
  Info,
  SignOut,
  Archive,
  Storefront,
  Package,
  UserGear,
  Ticket,
} from "phosphor-react";
import "./style.css";

let menus = [
  {
    title: "",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <HouseSimple />,
        link: "/admin/dashboard",
        subItems: null,
      },
      {
        id: "100",
        label: "Người dùng",
        icon: <User />,
        subItems: [
          { id: "101", label: "Nhân viên", link: "/admin/users/manage" },
          { id: "102", label: "Khách hàng", link: "/admin/customers/manage" },
        ],
      },
      {
        id: "2",
        label: "Sản phẩm",
        icon: <Archive />,
        subItems: [
          {
            id: "3",
            label: "Phân loại",
            en: "Category",
            link: "/admin/products/categories",
          },
          {
            id: "5",
            label: "Danh sách",
            en: "Product",
            link: "/admin/products/manage",
          },
          {
            id: "20",
            label: "Giảm giá",
            en: "Sale",
            link: "/admin/products/sale",
          },
        ],
      },
      {
        id: "feedback",
        label: "Phản hồi",
        en: "Feedback",
        icon: <CalendarBlank />,
        link: "/admin/feedback/manage",
      },
      {
        id: "6",
        label: "Đơn hàng",
        en: "Order",
        icon: <FileText />,
        link: "/admin/orders/manage",
        subItems: null,
      },
      {
        id: "7",
        label: "Nhà cung cấp",
        en: "Supplier",
        icon: <Storefront />,
        link: "/admin/suppliers/manage",
        subItems: null,
      },
      {
        id: "8",
        label: "Kho hàng",
        icon: <Package />,
        // link: "/admin/warehouse/stock-in",
        subItems: [
          {
            id: "12",
            label: "Nhập hàng",
            en: "Receipt",
            role: "Add",
            link: "/admin/warehouse/stockin",
          },
          {
            id: "13",
            label: "Phiếu nhập",
            en: "Receipt",
            role: "View",
            link: "/admin/warehouse/manage",
          },
        ],
      },
      {
        id: "9",
        label: "Phiếu giảm giá",
        en: "Coupon",
        icon: <Ticket />,
        link: "/admin/coupon/manage",
      },
      {
        id: "14",
        label: "Quảng cáo",
        en: "Advertisement",
        icon: <FaAdversal />,
        // link: "/admin/advertisement/manage",
        subItems: [
          { id: "16", label: "Danh sách", link: "/admin/advertisement/manage" },
        ],
      },
    ],
  },
];

const isQuyenSubMenu = (quyens, tenQuyen, role = "") => {
  const quyen = quyens.find((i) => i.title.toLowerCase() == tenQuyen);

  if (quyen) {
    let isCoQuyen;

    if (role) {
      isCoQuyen =
        quyen.permission.find(
          (i) => i.use && i.name.toLowerCase() == role.toLowerCase()
        ) !== undefined;
    } else {
      isCoQuyen = quyen.permission.some((i) => i.use);
    }

    return isCoQuyen;
  }

  return false;
};

const AdminLayout = () => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeSubMenuId, setActiveSubMenuId] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [profile, setProfile] = useState();
  const [permissions, setPermissions] = useState({});
  const [menusSft, setMenuSft] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { listData } = await getProfile();
        setProfile(listData);

        const fetchPermissions = async () => {
          const [error, data] = await stfExecAPI({
            url: `api/staff/userpermissions/${listData?.userId}`,
          });

          if (data) {
            setPermissions(data.data);

            const quyenDungDuoc = menus[0].items
              .map((mn) => {
                const boQua = ["Người dùng", "Dashboard"].map((i) =>
                  i.toLowerCase()
                );

                const textAdmin = listData?.authorities[0].authority;
  
                if (
                  boQua.includes(mn.label.toLowerCase()) &&
                  textAdmin == "Admin"
                ) {
                  return mn;
                }

                if (
                  boQua.includes(mn.label.toLowerCase()) &&
                  textAdmin !== "Admin"
                ) {
                  return null;
                }

                if (mn.en) {
                  if (isQuyenSubMenu(data.data, mn?.en?.toLowerCase())) {
                    return mn;
                  }

                  return null;
                }

                if (mn.subItems) {
                  const itemCoQuyens = mn.subItems.filter((it) => {
                    return isQuyenSubMenu(
                      data.data,
                      it?.en?.toLowerCase(),
                      it.role ? it.role : ""
                    );
                  });

                  return itemCoQuyens.length <= 0
                    ? null
                    : { ...mn, subItems: itemCoQuyens };
                }

                return mn;
              })
              .filter((i) => i);

            menus = [{ ...menus[0], items: quyenDungDuoc }];
            setMenuSft([...menus]);
            return;
          }
        };

        fetchPermissions();
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  console.log("Ty ", permissions);

  const handleLogout = () => {
    Cookies.remove("token"); // Remove the token
    Cookies.remove("refreshToken");
    navigate("/auth/login"); // Correct usage of navigation
    window.location.reload(); // Optional: reload the page
  };

  const handleMenuClick = (id) => {
    if (activeMenuId === id) {
      setActiveMenuId(null);
      setActiveSubMenuId(null);
    } else {
      setActiveMenuId(id);
      setActiveSubMenuId(null);
    }
  };

  const handleSubMenuClick = (menuId, subMenuId) => {
    if (activeMenuId === menuId && activeSubMenuId === subMenuId) {
      setActiveSubMenuId(null);
    } else {
      setActiveSubMenuId(subMenuId);
    }
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className={`container-stf`}>
      <div className={`sidebar-stf ${sidebarActive ? "active" : ""}`}>
        <div
          className="menu-btn-stf bg-secondary text-white"
          onClick={toggleSidebar}
        >
          <CaretLeft className={`ph-bold ${sidebarActive ? "active" : ""}`} />
        </div>
        <div className="head-stf">
          <div className="user-img-stf">
            <img
              src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-black.svg"
              alt=""
            />
          </div>
          <div className="user-details-stf">
            <p className="name-stf">Step Future</p>
          </div>
        </div>

        <div className="nav-stf">
          {menusSft.map((menu, index) => (
            <div className="menu-stf" key={index}>
              <p className="title-stf">{menu.title}</p>
              <ul>
                {menu.items.map((item) => (
                  <li
                    key={item.id}
                    className={activeMenuId === item.id ? "active" : ""}
                  >
                    <Link
                      to={item.link || "#"}
                      onClick={() => handleMenuClick(item.id)}
                    >
                      {item.icon}
                      <span className="text-stf">{item.label}</span>
                      {item.subItems && (
                        <i
                          className={`arrow-stf ${
                            activeMenuId === item.id ? "active" : ""
                          }`}
                        >
                          <CaretDown />
                        </i>
                      )}
                    </Link>
                    {item.subItems && activeMenuId === item.id && (
                      <ul className="sub-menu-stf">
                        {item.subItems.map((subItem) => (
                          <li
                            key={subItem.id}
                            className={
                              activeSubMenuId === subItem.id ? "active" : ""
                            }
                          >
                            <Link
                              to={subItem.link || "#"}
                              onClick={() =>
                                handleSubMenuClick(item.id, subItem.id)
                              }
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-100">
        <div className="header-stf">
          <div className="account px-4">
            <HiUserCircle
              style={{ fontSize: "2.5rem", marginRight: "1px", color: "#000" }}
            />
            <Dropdown>
              <Dropdown.Toggle
                style={{
                  border: "none",
                  color: "#000",
                  backgroundColor: "#fafafa",
                }}
                id="dropdown-basic"
              >
                {profile?.fullName}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Tài khoản</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="content-sft">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
