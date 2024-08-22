import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div>
      <main>
        <Outlet /> {/* Nơi chứa nội dung động */}
      </main>
    </div>
  );
}

export default AuthLayout;
