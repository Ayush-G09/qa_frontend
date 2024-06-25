import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../store/themeAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

function ModeToggle() {
  const mode = useSelector((state: any) => state.mode);
  const dispatch = useDispatch();
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    dispatch(setMode(newMode));
  };

  return (
    <Container onClick={toggleMode}>
      <FontAwesomeIcon icon={mode === "light" ? faSun : faMoon} />
    </Container>
  );
}

const Container = styled.div`
  width: 2rem;
  font-size: 1rem;
  background-color: ${(p) => p.theme.colors.base200};
  height: 2rem;
  margin-left: 1rem;
  border-radius: 50%;
  box-shadow: inset 0px 0px 5px 0px
    ${(p) =>
      p.theme.shadows.shadowInset === "light"
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(225, 225, 225, 0.2)"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default ModeToggle;