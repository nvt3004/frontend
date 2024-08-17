import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
  display: block;
  padding: 10px;
  text-decoration: none;
  color: black;
  transition: transform 0.2s, opacity 0.2s;
  border-bottom:  1px solid black;

  &:hover {
    transform: scale(0.9);
    opacity: 0.75;
  }
`;

export default StyledLink;
