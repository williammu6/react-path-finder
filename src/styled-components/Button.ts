import styled from "styled-components";

const Button = styled.button`
  cursor: pointer;
  background: transparent;
  font-size: 16px;
  border-radius: 3px;
  color: darkslategray;
  border: 2px solid darkslategray;
  margin: 0 1em;
  padding: 0.25em 1em;
  transition: 0.5s all ease-out;
  &:hover {
    background-color: darkslategray;
    color: white;
  }
`;

export default Button;
