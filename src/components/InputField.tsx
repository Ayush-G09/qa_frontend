import React, { ChangeEvent, MouseEvent, useRef, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faX } from "@fortawesome/free-solid-svg-icons";
import Label from "./Label";
import { useSelector } from "react-redux";
import { truncateString } from "../utils";

type Props = {
  placeholder: string;
  type: "text" | "password" | "email" | "date" | "file";
  width?: string;
  height?: string;
  value: string;
  onChange?: (value: string) => void;
  ierror?: boolean;
  sx?: CSSProperties;
  disabled?: boolean;
  setFile?: (value: File | null) => void;
  selectedFile?: File | null;
  selectedFileName?: string;
  removeFileName?: (conversationId: string, fileName: string) => void;
  conversationId?: string;
  addNotification?: (msg: string, type: "error" | "success") => void;
};

type State = {
  inputType: "text" | "password" | "email" | "date" | "file";
};

function InputField({
  placeholder,
  type,
  width,
  height,
  value,
  onChange,
  ierror = false,
  sx,
  disabled = false,
  setFile,
  selectedFile,
  selectedFileName,
  removeFileName,
  conversationId,
  addNotification,
}: Props) {
  const [state, setState] = useState<State>({
    inputType: type === "date" ? "text" : type,
  });

  const handleFocus = () => {
    if (type === "date") {
      setState((prev) => ({ ...prev, inputType: "date" }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf"];

      if (allowedTypes.includes(file.type)) {
        setFile!(file);
      } else {
        addNotification!("Please select a valid file type (PDF).", "error");
        setFile!(null);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setFile!(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    removeFileName!(conversationId!, "");
  };

  const isUserLoggedIn = useSelector((state: any) => state.isUserLoggedIn);

  return (
    <>
      {type === "file" ? (
        <>
          <Button
            sx={{ padding: "0.7rem 0.8rem" }}
            onClick={handleClick}
            icon={<FontAwesomeIcon icon={faPaperclip} />}
            disabled={!isUserLoggedIn}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.xlsx,.xls,.doc,.docx,.txt"
              style={{ display: "none" }}
            />
            {selectedFile || selectedFileName ? (
              <Label
                font="xsm"
                weight="b"
                content={
                  selectedFile
                    ? truncateString(selectedFile.name)
                    : truncateString(selectedFileName!)
                }
              />
            ) : null}
          </Button>
          {selectedFile || selectedFileName ? (
            <Button
              sx={{ padding: "0.7rem 0.8rem" }}
              onClick={handleRemove}
              icon={<FontAwesomeIcon icon={faX} />}
            />
          ) : null}
        </>
      ) : (
        <Field
          width={width}
          height={height}
          id={placeholder}
          placeholder={placeholder}
          type={state.inputType}
          onFocus={handleFocus}
          value={value}
          onChange={(e) => onChange!(e.target.value)}
          ierror={ierror}
          autoComplete="off"
          style={sx}
        />
      )}
    </>
  );
}

const Field = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== "ierror",
})<{ width?: string; height?: string; ierror: boolean }>`
  outline: none;
  width: ${(p) => (p.width ? p.width : "50%")};
  height: ${(p) => (p.height ? p.height : "45px")};
  border-radius: 10px;
  border: none;
  background-color: ${(p) => p.theme.colors.base300};
  padding-left: 10px;
  padding-right: 10px;
  font-size: ${(p) => p.theme.fontSize.small};
  box-shadow: 0px 0px 5px 0px
    ${(p) => (p.ierror ? "red" : "rgba(0, 0, 0, 0.1)")};
  color: ${(p) => p.theme.colors.font100};
  transition: 0.3s, transform 0.1s;
`;

export default InputField;
