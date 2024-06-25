import React from "react";

type Props = {
  type: "vertical" | "horizontal";
  value: string;
};

function Spacer({ type, value }: Props) {
  return (
    <div
      style={{
        width: type === "horizontal" ? value : "0px",
        minHeight: type === "vertical" ? value : "0px",
      }}
    />
  );
}

export default Spacer;
