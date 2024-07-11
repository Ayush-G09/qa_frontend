import {
  faCircleCheck,
  faExclamationCircle,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import Label from "./Label";

type Card = {
  msg: string;
  type: "error" | "success";
  id: number;
};

type Props = {
  cards: Card[];
  removeCard: (id: number) => void;
};

const modalRoot = document.getElementById("notifications-root");

function Notifications({ cards, removeCard }: Props) {
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <NotificationsOverlay>
      {cards.map((card) => (
        <Card key={card.id} type={card.type}>
          <div
            style={{
              display: "flex",
              alignItems: "start",
              marginRight: "1rem",
            }}
          >
            <FontAwesomeIcon
              icon={card.type === "error" ? faExclamationCircle : faCircleCheck}
            />
          </div>
          <Label
            sx={{ marginRight: "1rem" }}
            font={"xsm"}
            weight={"b"}
            content={card.msg}
          />
          <div
            style={{
              padding: "0.3rem",
              display: "flex",
              alignItems: "start",
              cursor: "pointer",
            }}
            onClick={() => removeCard(card.id)}
          >
            <FontAwesomeIcon style={{ fontSize: "0.8rem" }} icon={faX} />
          </div>
        </Card>
      ))}
    </NotificationsOverlay>,
    modalRoot
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

const NotificationsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  pointer-events: none;
  margin-top: 1rem;
  gap: 1rem;

  & > * {
    animation: ${fadeIn} 0.5s ease-out;
  }
`;

const Card = styled.div<{ type: "error" | "success" }>`
  display: flex;
  max-width: 50%;
  min-width: 10%;
  background-color: ${(p) => (p.type === "error" ? "#f8c0bf" : "#C4EC94")};
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  color: ${(p) => (p.type === "error" ? "#a7222f" : "#4F7A11")};
  border: 1px solid #a7222f;
  pointer-events: auto;
`;

export default Notifications;
