import React from "react";
import { Link } from "react-router-dom";

function AdminNav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNav;
