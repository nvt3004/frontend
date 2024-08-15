import React from "react";
import { Link } from "react-router-dom";
const TopBar = () => (
    <div class="top-bar">
    <div class="content-topbar flex-sb-m h-full container">
      <div class="left-top-bar">
        Free shipping for standard order over $100
      </div>
      <div class="right-top-bar flex-w h-full">
        <Link href="#" class="flex-c-m trans-04 p-lr-25"> Help & FAQs </Link>
        <Link href="#" class="flex-c-m trans-04 p-lr-25"> My Account </Link>
        <Link href="#" class="flex-c-m trans-04 p-lr-25"> EN </Link>
        <Link href="#" class="flex-c-m trans-04 p-lr-25"> USD </Link>
      </div>
    </div>
  </div>
  );
  
  export default TopBar;
  