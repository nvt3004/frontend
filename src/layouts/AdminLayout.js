import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { HiUserCircle } from "react-icons/hi";
import { Outlet, Link } from "react-router-dom";
import { getProfile } from "../services/api/OAuthApi";
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
  Storefront ,
  Package,
  UserGear 
} from "phosphor-react";
import "./style.css";

const menus = [
  {
    title: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <HouseSimple />,
        link: "/admin/dashboard",
        subItems: null,
      },
      {
        id: "1",
        label: "User",
        icon: <User />,
        link: "/admin/users/manage",
        subItems: null,
      },
      {
        id: "2",
        label: "Product",
        icon: <Archive />,
        subItems: [
          { id: "3", label: "Category", link: "/admin/products/categories" },
          { id: "4", label: "New product", link: "/admin/products/new" },
          { id: "5", label: "Manage product", link: "/admin/products/manage" },
        ],
      },
      {
        id: "feedback",
        label: "Feedback",
        icon: <CalendarBlank />,
        link: "/admin/feedback/manage",
      },
      {
        id: "6",
        label: "Order",
        icon: <FileText />,
        link: "/admin/orders/manage",
        subItems: null,
      },
      {
        id: "7",
        label: "Suppliers",
        icon: <Storefront />,
        link: "/admin/suppliers/manage",
        subItems: null,
      },
      {
        id: "8",
        label: "Warehouse",
        icon: <Package />,
        link: "/admin/warehouse/stock-in",
        subItems: null,
      },
      {
        id: "9",
        label: "Permissions",
        icon: <UserGear  />,
        subItems: [
          { id: "10", label: "New permissions", link: "/admin/permission/add" },
          { id: "11", label: "Manage permissions", link: "/admin/permission/manage" },
        ],
      }
    ],
  },
  // {
  //   title: "Settings",
  //   items: [
  //     { id: "settings", label: "Settings", icon: <Gear />, link: "/admin/settings", subItems: null },
  //   ],
  // },
  {
    title: "Account",
    items: [
      { id: "help", label: "Help", icon: <Info />, link: "/admin/help", subItems: null },
      { id: "logout", label: "Logout", icon: <SignOut />, link: "/logout", subItems: null },
    ],
  },
];

const AdminLayout = () => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeSubMenuId, setActiveSubMenuId] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {listData} = await getProfile();
        setProfile(listData);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

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
        <div className="menu-btn-stf" onClick={toggleSidebar}>
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
            <HiUserCircle
              style={{
                fontSize: "2.5rem",
                marginRight: "1px",
                color: "#000",
              }}
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
                <Dropdown.Item>Đăng xuất</Dropdown.Item>
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
