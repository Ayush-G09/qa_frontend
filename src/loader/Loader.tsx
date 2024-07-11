import { styled, keyframes } from "styled-components";
import Label from "../components/Label";
import { GridLoader } from "react-spinners";

type Props = {
  msg: string;
};

function Loader({ msg }: Props) {
  return (
    <LoaderOverlay>
      <div
        style={{
          width: "20vw",
          height: "40vh",
          display: "flex",
          backgroundColor: "white",
          borderRadius: "10px",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GridLoader color="#3F66DA" />
        </div>
        <div
          style={{
            height: "30%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Label font={"sm"} weight={"b"} content={msg} />
        </div>
      </div>
    </LoaderOverlay>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  gap: 1rem;

  & > * {
    animation: ${fadeIn} 0.5s ease-out;
  }
`;

export default Loader;
