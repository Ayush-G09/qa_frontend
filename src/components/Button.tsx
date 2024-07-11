import React, { ReactNode } from "react";
import styled, { CSSProperties } from "styled-components";

type Props = {
  placeholder?: string;
  onClick: () => void;
  sx?: CSSProperties;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
};

function Button({
  placeholder,
  onClick,
  sx,
  icon,
  disabled = false,
  children,
}: Props) {
  const click = () => {
    if (!disabled) {
      onClick();
    }
  };
  return (
    <StyledButton disabled={disabled} style={sx} onClick={click}>
      {icon}
      {placeholder}
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.div<{ disabled: boolean }>`
  padding: 0.7rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: ${(p) => p.theme.shadows.shadow105};
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: ${(p) => p.theme.fontWeight.large};
  background-color: ${(p) =>
    p.disabled ? p.theme.colors.gray300 : p.theme.colors.blue200};
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  gap: 1rem;

  &:hover {
    background-color: ${(p) =>
      p.disabled ? p.theme.colors.gray400 : p.theme.colors.blue300};
    box-shadow: ${(p) => p.theme.shadows.shadowHover57};
  }
`;

export default Button;
