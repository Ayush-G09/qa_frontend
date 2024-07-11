import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

type Props = {
  children: ReactNode;
  onClose: () => void;
  width?: string;
};

const modalRoot = document.getElementById("modal-root");

function Modal({ children, onClose, width }: Props) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent width={width} onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </ModalClose>
        {children}
      </ModalContent>
    </ModalOverlay>,
    modalRoot
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div<{ width?: string }>`
  background-color: ${(p) => p.theme.colors.base100};
  padding: 20px;
  border-radius: 5px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  width: ${(p) => (p.width ? p.width : "30vw")};
  color: ${(p) => p.theme.colors.font100};

  @media (max-width: 426px) {
    width: 70vw;
  }
`;

const ModalClose = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

export default Modal;
