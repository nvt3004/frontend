import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { HiUserCircle } from "react-icons/hi";
import { Outlet, Link, Navigate } from "react-router-dom";
import { getProfile } from "../services/api/OAuthApi";
import { FaAdversal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  Ticket
} from "phosphor-react";
import "./style.css";
import axiosInstance from "../services/axiosConfig";

const AdminLayout = () => {

  const [userProfile, setUserProfile] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);

  // Hàm lấy thông tin người dùng
  const fetchUserProfile = async () => {
    try {
      const profile = await getProfile();
      if (profile) {
        const listData = profile?.listData;
        setUserProfile(listData);
      } else {
        console.warn("No profile data found!");
      }
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    }
  };

  const fetchUserPermissions = () => {
    axiosInstance.get(`/admin/userpermissions/${userProfile?.userId}`).then(
      (response) => {
        if (response) {
          setUserPermissions(response?.data?.data);
        }
      }
    ).catch(
      (error) => {
        if (error) {
          console.log(error?.response);
        }
      }
    )
  }

  useEffect(() => {
    // Gọi hàm lấy thông tin người dùng
    fetchUserProfile();
  }, []); // Chỉ gọi 1 lần khi component mount

  // Theo dõi sự thay đổi của `userProfile`
  useEffect(() => {
    if (userProfile) {
      console.log("Updated user profile: ", userProfile);
      // Sau khi lấy thông tin user, lấy luôn quyền
      fetchUserPermissions();
    }
  }, [userProfile]); // Chạy khi `userProfile` thay đổi

  useEffect(() => {
    if (userPermissions && userPermissions.length > 0) {
      console.log("User permissions: ", userPermissions);
    } else if (userPermissions) {
      console.warn("No permissions available.");
    }
  }, [userPermissions]);

  const menus = [
    {
      items: [
        {
          id: true,
          label: "Bảng điều khiển",
          icon: <HouseSimple />,
          link: "/admin/dashboard",
          subItems: null,
        },
        {
          id: "-1",
          label: "Người dùng",
          icon: <User />,
          subItems: [
            { id: "101", label: "Nhân viên", link: "/admin/users/manage" },
            { id: "102", label: "Khách hàng", link: "/admin/customers/manage" },
          ],
        },
        {
          id: "14",
          label: "Sản phẩm",
          icon: <Archive />,
          subItems: [
            { id: "62", label: "Phân loại", link: "/admin/products/categories" },
            { id: "15", label: "Thêm mới", link: "/admin/products/new" },
            { id: "14", label: "Danh sách", link: "/admin/products/manage" },
            { id: "50", label: "Giảm giá", link: "/admin/products/sale" },
          ],
        },
        {
          id: "0",
          label: "Phản hồi",
          icon: <CalendarBlank />,
          link: "/admin/feedback/manage",
        },
        {
          id: "13",
          label: "Đơn hàng",
          icon: <FileText />,
          link: "/admin/orders/manage",
          subItems: null,
        },
        {
          id: "26",
          label: "Nhà cung cấp",
          icon: <Storefront />,
          link: "/admin/suppliers/manage",
          subItems: null,
        },
        {
          id: "39",
          label: "Kho hàng",
          icon: <Package />,
          // link: "/admin/warehouse/stock-in",
          subItems: [
            { id: '31', label: 'Nhập hàng', link: "/admin/warehouse/stockin" },
            { id: '39', label: 'Phiếu nhập', link: "/admin/warehouse/manage" }
          ],
        },
        {
          id: "5",
          label: "Phiếu giảm giá",
          icon: <Ticket />,
          link: "/admin/coupon/manage",
        },
        {
          id: "22",
          label: "Quảng cáo",
          icon: <FaAdversal />,
          // link: "/admin/advertisement/manage",
          subItems: [
            { id: '15', label: 'Thêm mới', link: "/admin/advertisement/new" },
            { id: '16', label: 'Danh sách', link: "/admin/advertisement/manage" }
          ],
        }
      ],
    },
  ];

  const hasPermission = (id) => {
    if (!userPermissions) return false;
    // Tìm permission với id đó và check xem use có phải là true không
    return userPermissions.some(item =>
      item.permission && item.permission.some(perm => perm.id === parseInt(id) && perm.use === true)
    );
  };
  
  const filteredMenus = menus.map(menu => ({
    ...menu,
    items: menu.items
      .filter(item => hasPermission(item.id)) // Chỉ giữ lại items có permission valid
      .map(item => ({
        ...item,
        subItems: item.subItems 
          ? item.subItems.filter(subItem => subItem && hasPermission(subItem.id)) // Check null và permission valid
          : null
      }))
  }));
  
  


  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeSubMenuId, setActiveSubMenuId] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [profile, setProfile] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { listData } = await getProfile();
        setProfile(listData);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

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
        <div className="menu-btn-stf bg-secondary text-white" onClick={toggleSidebar}>
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
          {menus.map((menu, index) => (
            <div className="menu-stf" key={index}>
              <p className="title-stf">{menu.title}</p>
              <ul>
                {menu.items.map((item) => (
                  <li key={item.id} className={activeMenuId === item.id ? "active" : ""}>
                    <Link to={item.link || "#"} onClick={() => handleMenuClick(item.id)}>
                      {item.icon}
                      <span className="text-stf">{item.label}</span>
                      {item.subItems && (
                        <i className={`arrow-stf ${activeMenuId === item.id ? "active" : ""}`}>
                          <CaretDown />
                        </i>
                      )}
                    </Link>
                    {item.subItems && activeMenuId === item.id && (
                      <ul className="sub-menu-stf">
                        {item.subItems.map((subItem) => (
                          <li
                            key={subItem.id}
                            className={activeSubMenuId === subItem.id ? "active" : ""}
                          >
                            <Link
                              to={subItem.link || "#"}
                              onClick={() => handleSubMenuClick(item.id, subItem.id)}
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
            <HiUserCircle style={{ fontSize: "2.5rem", marginRight: "1px", color: "#000" }} />
            <Dropdown>
              <Dropdown.Toggle
                style={{ border: "none", color: "#000", backgroundColor: "#fafafa" }}
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
