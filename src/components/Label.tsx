import React, { CSSProperties } from "react";
import styled from "styled-components";

type Props = {
  font: "xsm" | "sm" | "md" | "lg" | "12";
  weight: "t" | "n" | "b";
  content: string;
  sx?: CSSProperties;
  onClick?: () => void;
};

function Label({ font, weight, content, sx, onClick }: Props) {
  return (
    <Con font={font} weight={weight} style={sx} onClick={onClick}>
      {content}
    </Con>
  );
}

const Con = styled.label<{ font: "xsm" | "sm" | "md" | "lg" | "12"; weight: "t" | "n" | "b" }>`
  font-size: ${(p) =>
    p.font === "sm"
      ? p.theme.fontSize.small
      : p.font === "md"
      ? p.theme.fontSize.medium
      : p.font === "lg" 
      ? p.theme.fontSize.large
      : p.font === "xsm" 
      ? '0.8rem'
      : '1.2rem'}; 
  font-weight: ${(p) =>
    p.weight === "t"
      ? p.theme.fontWeight.small
      : p.weight === "n"
      ? p.theme.fontWeight.medium
      : p.theme.fontWeight.large};

  @media (max-width: 768px) {
    font-size: ${(p) =>
      p.font === "sm" ? "0.8rem" : p.font === "md" ? "1.6rem" : "2.4rem"};
  }
`;

export default Label;
