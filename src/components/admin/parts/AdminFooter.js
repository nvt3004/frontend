import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  background-color: #fff;
  padding: 15px;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
`;

const AdminFooter = () => {
  return (
    <Footer>
      MADE BY STF COMPANY
    </Footer>
  );
}

export default AdminFooter;
