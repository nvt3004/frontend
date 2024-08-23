
import styled from "styled-components";

const ButtonHover = styled.button`
  
  &:hover {
    transform: scale(1.1); /* Điều chỉnh kích thước khi hover */
    opacity: 0.75; /* Độ trong suốt khi hover */
  }
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

const LabelHover = styled.label`
&:hover {
  transform: scale(1.1); /* Điều chỉnh kích thước khi hover */
  opacity: 0.75; /* Độ trong suốt khi hover */
}
transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

export {ButtonHover, LabelHover};
