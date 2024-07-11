import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Label from "./Label";
import Logo from "../assets/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import Spacer from "./Spacer";
import { useDispatch, useSelector } from "react-redux";
import Conversation from "./Conversation";

type Props = {
  removeFile: () => void;
  conversations: {
    chat: { from: "user" | "assistant"; data: string }[];
    name: string;
    _id: string;
    file: {
      name: string;
    };
  }[];
  addNewConversation: () => void;
  setSelectedName: (e: string) => void;
  deleteConversations: (e: string) => void;
  updateName: (conversationId: string, newName: string) => void;
};

type State = {
  modal: boolean;
  delete: boolean;
  id: string;
};

function Sidebar({
  removeFile,
  conversations,
  addNewConversation,
  setSelectedName,
  deleteConversations,
  updateName,
}: Props) {
  const [state, setState] = useState<State>({
    modal: false,
    delete: false,
    id: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const isUserLoggedIn = useSelector((state: any) => state.isUserLoggedIn);
  const dispatch = useDispatch();

  const setCurrent = (id: string) => {
    setState((prev) => ({ ...prev, id }));
  };

  const openModal = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('modal', 'logout');
    navigate(`${location.pathname}?${searchParams.toString()}`);
};

  const openDelete = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('modal', 'delete');
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const closeModal = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('modal');
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("modal") === "logout") {
      setState((prev) => ({ ...prev, modal: true }));
    } else if (params.get("modal") === "delete") {
      setState((prev) => ({ ...prev, delete: true }));
    } else {
      setState((prev) => ({ ...prev, modal: false, delete: false }));
    }
  }, [location.search]);

  return (
    <SidebarCon>
      <Header>
        <Options selected={false} onClick={addNewConversation}>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          <Label content={"Askq"} font={"sm"} weight={"n"} />
          {isUserLoggedIn && (
            <IconContainer>
              <FontAwesomeIcon
                icon={faPenToSquare}
                style={{ marginRight: "0.5rem" }}
              />
            </IconContainer>
          )}
        </Options>
      </Header>
      <ConversationCon>
        {conversations.map((conversation) => (
          <Conversation
            updateName={updateName}
            setCurrent={setCurrent}
            openDelete={openDelete}
            key={conversation._id}
            conversation={conversation}
            setSelectedName={setSelectedName}
          />
        ))}
      </ConversationCon>
      <Header style={{ marginTop: "0px", marginBottom: "10px" }}>
        {isUserLoggedIn && (
          <Options
            selected={false}
            style={{ height: "35px" }}
            onClick={openModal}
          >
            <Label content={"Logout"} font={"sm"} weight={"n"} />
            <IconContainer>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                style={{ marginRight: "0.5rem" }}
              />
            </IconContainer>
          </Options>
        )}
      </Header>
      {state.modal && (
        <Modal width="30vw" onClose={closeModal}>
          <Spacer type={"vertical"} value={"2rem"} />
          <Label
            sx={{ textAlign: "center" }}
            font={"md"}
            weight={"n"}
            content={"You want to logout ?"}
          />
          <Spacer type={"vertical"} value={"4rem"} />
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Button
              sx={{ backgroundColor: "#2ABB7F" }}
              placeholder={"Yes"}
              onClick={removeFile}
            />
            <Button
              sx={{ backgroundColor: "#F15B50" }}
              placeholder={"No"}
              onClick={closeModal}
            />
          </div>
        </Modal>
      )}
      {state.delete && (
        <Modal width="20vw" onClose={closeModal}>
          <Label font={"sm"} weight={"n"} content={"Delete chat"} />
          <Spacer type={"vertical"} value={"2rem"} />
          <Label
            sx={{ textAlign: "center" }}
            font={"md"}
            weight={"n"}
            content={"Are you sure ?"}
          />
          <Spacer type={"vertical"} value={"3rem"} />
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: "1.5rem",
            }}
          >
            <Button
              sx={{ backgroundColor: "#F15B50", padding: "0.5rem 2rem" }}
              placeholder={"Cancel"}
              onClick={closeModal}
            />

            <Button
              sx={{ backgroundColor: "#2ABB7F", padding: "0.5rem 2rem" }}
              placeholder={"Delete"}
              onClick={() => {
                deleteConversations(state.id);
                setState((prev) => ({ ...prev, delete: false }));
              }}
            />
          </div>
        </Modal>
      )}
    </SidebarCon>
  );
}

export const hideScrollbarStyles = css`
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ConversationCon = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  overflow-y: scroll;
  ${hideScrollbarStyles}
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarCon = styled.div`
  width: 16%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${(p) => p.theme.colors.base300};
  gap: 10px;
`;

const Options = styled.div<{ selected: boolean }>`
  width: 90%;
  padding: 0.3rem 0.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  background-color: ${(p) =>
    p.selected ? p.theme.colors.base300 : "transparent"};

  &:hover {
    background-color: ${(p) => p.theme.colors.base300};
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 40px;
  margin-top: 10px;
  cursor: pointer;
  justify-content: center;
`;

const LogoContainer = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: end;
`;

export default Sidebar;
