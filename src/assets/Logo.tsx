import React from "react";
import styled from "styled-components";

function Logo() {
  return (
    <Circle color="#031273">
      <Circle color="#0504AA">
        <Circle color="#2337C6">
          <Circle color="#4169E1">
            <Circle color="#4CC9F0" />
          </Circle>
        </Circle>
      </Circle>
    </Circle>
  );
}

const Circle = styled.div<{ color: string }>`
  width: 80%;
  height: 80%;
  background-color: ${(p) => p.color};
  border-radius: 50%;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
`;

export default Logo;
