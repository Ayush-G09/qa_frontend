import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { generateTheme } from "./theme";
import { useSelector } from "react-redux";

function App() {
  const mode = useSelector((state: any) => state.mode);
  const currentTheme = generateTheme(mode);
  return (
    <ThemeProvider theme={currentTheme}>
      <Root>
        <RouterProvider router={router} />
      </Root>
    </ThemeProvider>
  );
}

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(p) => p.theme.colors.base100};
  transition: background-color 0.3s, transform 0.1s;
`;

export default App;
