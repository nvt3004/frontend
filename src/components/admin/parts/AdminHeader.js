import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header = styled.header`
  background-color: #fff;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 5px;
  width: 200px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const AvatarDropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover .dropdown-content {
    display: block;
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

  a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;

    &:hover {
      background-color: #f1f1f1;
    }
  }
`;

const AdminHeader = () => {
  return (
    <Header>
      <SearchInput type="text" placeholder="Search..."  className='py-2 px-3 rounded-5' style={{minWidth: '350px'}}/>
      <AvatarDropdown>
        <img src={process.env.PUBLIC_URL + '/images/DefaultAvatar.png'} className='rounded-circle' alt="Avatar" style={{ borderRadius: '50%', width: '40px' }} />
        <DropdownContent className="dropdown-content">
          <Link to="/admin/account">Account</Link>
          <Link to="/logout">Sign Out</Link>
        </DropdownContent>
      </AvatarDropdown>
    </Header>
  );
}

export default AdminHeader;
