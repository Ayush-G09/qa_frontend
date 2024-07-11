import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { truncateString } from "../utils";
import Label from "./Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPen,
  faSave,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "./InputField";

type Props = {
  conversation: {
    chat: { from: "user" | "assistant"; data: string }[];
    name: string;
    _id: string;
    file: {
      name: string;
    };
  };
  setSelectedName: (e: string) => void;
  openDelete: () => void;
  setCurrent: (e: string) => void;
  updateName: (conversationId: string, newName: string) => void;
};

type State = {
  open: boolean;
  edit: boolean;
  text: string;
};

function Conversation({
  conversation,
  setSelectedName,
  openDelete,
  setCurrent,
  updateName,
}: Props) {
  const [state, setState] = useState<State>({
    open: false,
    edit: false,
    text: conversation.name,
  });

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const changeConversation = (id: string) => {
    const param = new URLSearchParams();
    param.append("conversationId", id);
    navigate({
      pathname: "/",
      search: param.toString(),
    });
    setSelectedName(id);
  };

  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    setState((prev) => ({ ...prev, open: false }));
    setCurrent(conversation._id);
    openDelete();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setState((prev) => ({
        ...prev,
        open: false,
        edit: false,
        text: conversation.name,
      }));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSave = (e: any) => {
    e.stopPropagation();
    updateName(conversation._id, state.text);
    setState((prev) => ({
      ...prev,
      open: false,
      edit: false,
      text: conversation.name,
    }));
  };

  const onEdit = (e: any) => {
    e.stopPropagation();
    setState((prev) => ({ ...prev, edit: true }));
  };

  const onCancel = (e: any) => {
    setState((prev) => ({
      ...prev,
      open: false,
      edit: false,
      text: conversation.name,
    }));
  };

  return (
    <Options
      onClick={() => changeConversation(conversation._id)}
      selected={params.get("conversationId") === conversation._id}
      key={conversation._id}
      ref={ref}
    >
      {state.edit ? (
        <InputField
          sx={{ boxShadow: "inset 0px 0px 5px 0px rgba(0, 0, 0, 0.5)" }}
          width="85%"
          placeholder={""}
          type={"text"}
          value={state.text}
          onChange={(e) => setState((prev) => ({ ...prev, text: e }))}
        />
      ) : (
        <Label
          sx={{ padding: "0.4rem 0rem", width: "85%" }}
          font={"sm"}
          weight={"t"}
          content={truncateString(
            conversation.name
              ? conversation.name
              : conversation.chat.length
              ? conversation.chat[0].data
              : conversation.file.name
          )}
        />
      )}
      {conversation._id !== "NewConversation" && (
        <OptionBt
          width="15%"
          onClick={(e) => {
            e.stopPropagation();
            setState((prev) => ({ ...prev, open: !state.open }));
          }}
        >
          <FontAwesomeIcon style={{ fontSize: "0.8rem" }} icon={faEllipsis} />
          {state.open && (
            <Tooltip>
              <TooltipItem
                onClick={(e) => (state.edit ? onSave(e) : onEdit(e))}
              >
                <div style={{ width: "20%", cursor: "pointer" }}>
                  <FontAwesomeIcon
                    icon={state.edit ? faSave : faPen}
                    style={{ fontSize: "0.7rem" }}
                  />
                </div>
                <div style={{ width: "80%", cursor: "pointer" }}>
                  <Label
                    sx={{ cursor: "pointer" }}
                    font={"xsm"}
                    weight={"n"}
                    content={state.edit ? "Save" : "Edit"}
                  />
                </div>
              </TooltipItem>
              <Divider />
              <TooltipItem
                onClick={(e) =>
                  state.edit ? onCancel(e) : handleDeleteClick(e)
                }
              >
                <div style={{ width: "20%", cursor: "pointer" }}>
                  <FontAwesomeIcon
                    color="#EE4B2B"
                    icon={state.edit ? faX : faTrash}
                    style={{ fontSize: "0.7rem" }}
                  />
                </div>
                <div style={{ width: "80%", cursor: "pointer" }}>
                  <Label
                    sx={{ cursor: "pointer", color: "#EE4B2B" }}
                    font={"xsm"}
                    weight={"n"}
                    content={state.edit ? "Cancel" : "Delete"}
                  />
                </div>
              </TooltipItem>
            </Tooltip>
          )}
        </OptionBt>
      )}
    </Options>
  );
}

const OptionBt = styled.div<{ width: string }>`
  width: ${(p) => p.width};
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  &:hover {
    background-color: ${(p) => p.theme.colors.base400};
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${(p) => p.theme.colors.base400};
`;

const TooltipItem = styled.div`
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  cursor: pointer;
  gap: 0.5rem;
  border-radius: 5px;
  &:hover {
    background-color: ${(p) => p.theme.colors.base200};
  }
`;

const Tooltip = styled.div`
  width: 4.5rem;
  cursor: pointer;
  background-color: ${(p) => p.theme.colors.base300};
  position: absolute;
  top: 100%;
  right: 0%;
  padding: 0.25rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  z-index: 100;
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

export default Conversation;
