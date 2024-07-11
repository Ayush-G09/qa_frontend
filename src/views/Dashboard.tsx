import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Sidebar, { hideScrollbarStyles } from "../components/Sidebar";
import Label from "../components/Label";
import {
  ask,
  getGreeting,
  getText,
  saveEmbeddings,
  split,
  validateEmail,
} from "../utils";
import ModeToggle, { TModeContainer } from "../components/ModeToggle";
import Logo from "../assets/Logo";
import Button from "../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import Spacer from "../components/Spacer";
import axiosInstance from "../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setIsUserLoggedIn } from "../store/themeAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faKey } from "@fortawesome/free-solid-svg-icons";
import Notifications from "../components/Notifications";
import Loader from "../loader/Loader";
import { BounceLoader } from "react-spinners";

type Card = {
  msg: string;
  type: "error" | "success";
  id: number;
};

type State = {
  modal: boolean;
  email: {
    value: string;
    error: boolean;
  };
  password: {
    value: string;
    error: boolean;
  };
  cnfPassword: {
    value: string;
    error: boolean;
  };
  name: {
    value: string;
    error: boolean;
  };
  modalChild: "Login" | "Signup" | "Apikey";
  question: string;
  selectedFile: File | null;
  conversationId: string;
  apikey: {
    value: string;
    error: boolean;
  };
  cards: Card[];
  conversations: {
    chat: { from: "user" | "assistant"; data: string; _id: string }[];
    name: string;
    _id: string;
    file: {
      name: string;
    };
  }[];
  selectedFileName: string;
  loading: {
    value: boolean;
    msg: string;
  };
};

function Dashboard() {
  const [state, setState] = useState<State>({
    modal: false,
    email: {
      value: "",
      error: false,
    },
    password: {
      value: "",
      error: false,
    },
    modalChild: "Login",
    name: {
      value: "",
      error: false,
    },
    cnfPassword: {
      value: "",
      error: false,
    },
    question: "",
    selectedFile: null,
    conversationId: "",
    apikey: {
      value: "",
      error: false,
    },
    cards: [],
    conversations: [],
    selectedFileName: "",
    loading: {
      value: false,
      msg: "",
    },
  });

  const navigate = useNavigate();
  const location = useLocation();

  const isUserLoggedIn = useSelector((state: any) => state.isUserLoggedIn);
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.get("modal") === "login") {
      setState((prev) => ({ ...prev, modalChild: "Login", modal: true }));
    } else if (params.get("modal") === "signup") {
      setState((prev) => ({ ...prev, modalChild: "Signup", modal: true }));
    } else if (params.get("modal") === "apikey") {
      setState((prev) => ({ ...prev, modalChild: "Apikey", modal: true }));
    } else {
      setState((prev) => ({ ...prev, modal: false }));
    }
  }, [location.search]);

  const logout = () => {
    dispatch(setIsUserLoggedIn(false));
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    setState((prev) => ({
      ...prev,
      modal: false,
      email: {
        value: "",
        error: false,
      },
      password: {
        value: "",
        error: false,
      },
      modalChild: "Login",
      name: {
        value: "",
        error: false,
      },
      cnfPassword: {
        value: "",
        error: false,
      },
      question: "",
      selectedFile: null,
      conversationId: "",
      apikey: {
        value: "",
        error: false,
      },
      cards: [],
      conversations: [],
      selectedFileName: "",
      loading: {
        value: false,
        msg: "",
      },
    }));
    navigate("/");
    addNotification("Loged out successfully", "success");
  };

  const addNewConversation = () => {
    if (state.conversations.some((conv) => conv._id === "NewConversation")) {
      return;
    }

    if (!isUserLoggedIn) {
      return;
    }

    setState((prev) => ({
      ...prev,
      conversations: [
        ...prev.conversations,
        {
          chat: [],
          name: "New Conversation",
          _id: "NewConversation",
          file: { name: "" },
        },
      ],
      selectedFileName: "",
      selectedFile: null,
      conversationId: "NewConversation",
    }));

    const params = new URLSearchParams();
    params.append("conversationId", "NewConversation");
    navigate({
      pathname: "/",
      search: params.toString(),
    });
  };

  const openModal = (type: string) => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.set("modal", type);

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const closeModal = () => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("modal");

    navigate(`${location.pathname}?${searchParams.toString()}`);
    setState((prev) => ({
      ...prev,
      name: { ...prev.name, value: "", error: false },
      email: { ...prev.email, value: "", error: false },
      password: { ...prev.password, value: "", error: false },
      cnfPassword: { ...prev.cnfPassword, value: "", error: false },
    }));
  };

  useEffect(() => {
    if (state.password.value === state.cnfPassword.value) {
      setState((prev) => ({
        ...prev,
        cnfPassword: { ...prev.cnfPassword, error: false },
      }));
    }
  }, [state.cnfPassword.value, state.password.value]);

  const login = async () => {
    if (state.email.value.trim() === "") {
      setState((prev) => ({ ...prev, email: { ...prev.email, error: true } }));
    } else if (validateEmail(state.email.value)) {
      if (state.password.value === "") {
        setState((prev) => ({
          ...prev,
          email: { ...prev.email, error: false },
          password: { ...prev.password, error: true },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          password: { ...prev.password, error: false },
        }));
        const data = {
          email: state.email.value,
          password: state.password.value,
        };
        try {
          const response = await axiosInstance.post("/auth", data);
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("userName", response.data.user.name);
          setState((prev) => ({
            ...prev,
            apikey: { ...prev.apikey, value: response.data.user.apikey },
          }));
          setState((prev) => ({
            ...prev,
            password: { ...prev.password, value: "" },
            email: { ...prev.email, value: "" },
          }));
          addNotification(`Welcome ${response.data.user.name}`, "success");
          dispatch(setIsUserLoggedIn(true));
          navigate("/");
        } catch {
          addNotification("Invalid credentials", "error");
        }
      }
    } else {
      setState((prev) => ({ ...prev, email: { ...prev.email, error: true } }));
    }
  };

  const signup = async () => {
    if (state.name.value.trim() === "") {
      setState((prev) => ({ ...prev, name: { ...prev.name, error: true } }));
    } else if (state.email.value.trim() === "") {
      setState((prev) => ({
        ...prev,
        email: { ...prev.email, error: true },
        name: { ...prev.name, error: false },
      }));
    } else if (validateEmail(state.email.value)) {
      if (state.password.value === "") {
        setState((prev) => ({
          ...prev,
          email: { ...prev.email, error: false },
          password: { ...prev.password, error: true },
        }));
      } else if (state.cnfPassword.value === "") {
        setState((prev) => ({
          ...prev,
          password: { ...prev.password, error: false },
          cnfPassword: { ...prev.cnfPassword, error: true },
        }));
      } else if (state.password.value === state.cnfPassword.value) {
        setState((prev) => ({
          ...prev,
          cnfPassword: { ...prev.cnfPassword, error: false },
        }));
        const data = {
          name: state.name.value,
          email: state.email.value,
          password: state.password.value,
        };
        try {
          await axiosInstance.post("/users", data);
          addNotification("Account created successfully.", "success");
          setState((prev) => ({
            ...prev,
            name: { ...prev.name, value: "" },
            email: { ...prev.email, value: "" },
            password: { ...prev.password, value: "" },
            cnfPassword: { ...prev.cnfPassword, value: "" },
          }));
          closeModal();
        } catch (error: any) {
          addNotification(error.response.data.msg, "success");
        }
      } else {
        setState((prev) => ({
          ...prev,
          cnfPassword: { ...prev.cnfPassword, error: true },
        }));
      }
    } else {
      setState((prev) => ({ ...prev, email: { ...prev.email, error: true } }));
    }
  };

  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (state.selectedFile !== null) {
      uploadFile(state.conversationId, state.selectedFile.name);
    }
  }, [state.selectedFile]);

  const saveFileName = async (conversationId: string, newName: string) => {
    try {
      const res = await axiosInstance.put(
        "/upload/conversationName",
        { conversationId, newName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      addNotification("Name updated", "success");
      setState((prev) => ({ ...prev, conversations: res.data.conversations }));
    } catch (err: any) {
      if (err.response.status === 401) {
        logout();
      }
      addNotification("Failed to rename, try again", "error");
    }
  };

  const updateFileName = async (conversationId: string, newName: string) => {
    try {
      const res = await axiosInstance.put(
        "/upload/fileName",
        { conversationId, newName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      addNotification("File removed", "success");
      setState((prev) => ({ ...prev, conversations: res.data.conversations }));
      const params = new URLSearchParams();
      params.append("conversationId", res.data.newConversationId);
      navigate({
        pathname: "/",
        search: params.toString(),
      });
    } catch (err: any) {
      if (err.response.status === 401) {
        logout();
      }
      addNotification("Failed to delete file, try again", "error");
    }
  };

  const uploadFile = async (conversationId: string, fileName: string) => {
    setState((prev) => ({
      ...prev,
      loading: {
        ...prev.loading,
        value: true,
        msg: "creating conversation...",
      },
    }));
    try {
      const res = await axiosInstance.post(
        "/upload",
        { conversationId, fileName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, msg: "Seprating content of the file..." },
      }));
      const text = await getText(state.selectedFile!);
      if (!text) {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, value: false, msg: "" },
        }));
        addNotification("Failed to extract text from PDF, try again", "error");
        deleteConversations(res.data.conversationId);
        return;
      }
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, msg: "Creating chunks of content..." },
      }));
      const chunks = await split(text);
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, msg: "Generating embeddings..." },
      }));
      const embeddingComplete = await saveEmbeddings(
        chunks,
        res.data.conversationId,
        state.apikey.value
      );
      if (!embeddingComplete) {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, value: false, msg: "" },
        }));
        addNotification("Failed to create the embeddings, try again", "error");
        deleteConversations(res.data.conversationId);
        return;
      }
      setState((prev) => ({
        ...prev,
        conversationId: res.data.conversationId,
        conversations: res.data.conversations,
        loading: { ...prev.loading, value: false, msg: "" },
      }));
      const params = new URLSearchParams();
      params.append("conversationId", res.data.conversationId);
      navigate({
        pathname: "/",
        search: params.toString(),
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        selectedFile: null,
        selectedFileName: "",
        loading: { ...prev.loading, value: false, msg: "" },
      }));
      if (err.response.status === 401) {
        logout();
      }
      if (err.response.status === 400) {
        addNotification("Please add api key", "error");
        openModal("apikey");
      } else {
        addNotification("unable to upload file try again", "error");
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.conversations]);

  useEffect(() => {
    if (
      state.conversations.find((con) => con._id === state.conversationId)?.chat
        .length
    ) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.conversationId]);

  const askQuestion = async () => {
    const question = state.question;
    const newMsg = [
      { from: "user", data: state.question, _id: "test1" },
      { from: "assistant", data: "thinking...", _id: "test2" },
    ] as { from: "user" | "assistant"; data: string; _id: string }[];

    const updatedConversations = state.conversations.map((conversation) => {
      if (conversation._id === state.conversationId) {
        return {
          ...conversation,
          chat: [...conversation.chat, ...newMsg],
        };
      }
      return conversation;
    });

    setState((prev) => ({
      ...prev,
      conversations: updatedConversations,
      question: "",
    }));
    const res = await ask(state.conversationId, question, state.apikey.value);
    if (!res) {
      return;
    }
    const data = {
      conversationId: state.conversationId,
      question: question,
      answer: res.content,
    };
    try {
      const res = await axiosInstance.post("/question", data, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      setState((prev) => ({ ...prev, conversations: res.data.conversations }));
    } catch (err: any) {
      if (err.response.status === 401) {
        logout();
      }
      addNotification("Error in saving the chat", "error");
    }
  };

  const submitApikey = async () => {
    if (state.apikey.value.trim() === "") {
      setState((prev) => ({
        ...prev,
        apikey: { ...prev.apikey, error: true },
      }));
    } else {
      const apikey = state.apikey.value;
      setState((prev) => ({
        ...prev,
        loading: { value: true, msg: "Saving api key" },
      }));
      try {
        await axiosInstance.put(
          `/user/apikey`,
          { apikey },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        closeModal();
        setState((prev) => ({
          ...prev,
          apikey: { ...prev.apikey, error: false },
        }));
      } catch (err: any) {
        if (err.response.status === 401) {
          logout();
        }
        addNotification("Error in saving apikey please try again", "error");
        setState((prev) => ({
          ...prev,
          apikey: { ...prev.apikey, error: false, value: "" },
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: { value: false, msg: "" } }));
      }
    }
  };

  const addNotification = (msg: string, type: "error" | "success") => {
    const id = new Date().getTime();
    setState((prev) => ({
      ...prev,
      cards: [...prev.cards, { id, msg, type }],
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        cards: prev.cards.filter((card) => card.id !== id),
      }));
    }, 10000);
  };

  const removeNotification = (id: number) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== id),
    }));
  };

  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get(`/conversation`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      setState((prev) => ({
        ...prev,
        conversations: res.data.conversations,
        apikey: { ...prev.apikey, value: res.data.apiKey },
      }));
      const conversationId = params.get("conversationId");
      if (conversationId !== "NewConversation" && conversationId !== null) {
        const fileName = res.data.conversations.filter(
          (con: any) => con._id === conversationId
        )[0].file.name;
        setState((prev) => ({
          ...prev,
          conversationId,
          selectedFileName: fileName,
        }));
      }
      if (conversationId === "NewConversation") {
        addNewConversation();
      }
    } catch (err: any) {
      if (err.response.status === 401) {
        logout();
      }
      addNotification("Error in getting coonversations", "error");
    }
  };

  const deleteConversations = async (id: string) => {
    try {
      await axiosInstance.delete(`/conversation/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      setState((prev) => ({
        ...prev,
        selectedFileName: "",
        selectedFile: null,
        conversationId: "",
        conversations: state.conversations.filter(
          (conversation) => conversation._id !== id
        ),
      }));
      navigate("/");
    } catch (err: any) {
      if (err.response.status === 401) {
        logout();
      }
      addNotification("Error in getting coonversations", "error");
    }
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchConversations();
    }
  }, [isUserLoggedIn]);

  const setSelectedName = (id: string) => {
    const name = state.conversations.find(
      (conversation) => conversation._id === id
    )?.file.name!;
    setState((prev) => ({
      ...prev,
      selectedFileName: name,
      selectedFile: null,
      conversationId: id,
    }));
  };

  const setFile = (file: File | null) => {
    setState((prev) => ({
      ...prev,
      selectedFile: file,
      selectedFileName: file ? file.name : "",
    }));
  };

  return (
    <Container>
      <Sidebar
        updateName={saveFileName}
        deleteConversations={deleteConversations}
        setSelectedName={(id) => setSelectedName(id)}
        addNewConversation={addNewConversation}
        conversations={state.conversations}
        removeFile={logout}
      />
      <Content>
        <ContentHeader>
          <Label
            sx={{ marginLeft: "1rem" }}
            font={"sm"}
            weight={"b"}
            content={
              userName && isUserLoggedIn
                ? `${getGreeting()}, ${userName}`
                : getGreeting()
            }
          />
          <ModeContainer>
            <TModeContainer
              onClick={() => {
                if (isUserLoggedIn) {
                  openModal('apikey');
                } else {
                  addNotification("You need to login first", "error");
                }
              }}
            >
              <FontAwesomeIcon icon={faKey} />
            </TModeContainer>
            <ModeToggle />
          </ModeContainer>
        </ContentHeader>
        <Context>
          {!state.conversations.find(
            (conv) => conv._id === state.conversationId
          )?.chat.length! ? (
            <>
              <LogoContainer>
                <Logo />
              </LogoContainer>
              <Label
                sx={{ marginBottom: "3rem" }}
                font={"md"}
                weight={"b"}
                content={"How can I help you today ?"}
              />
              {!isUserLoggedIn && (
                <>
                  <Button
                    placeholder={"Login"}
                    onClick={() => openModal("login")}
                  />
                  <Button
                    placeholder={"Signup"}
                    onClick={() => openModal("signup")}
                  />
                </>
              )}
            </>
          ) : (
            <ChatCon>
              {state.conversations
                .find((conv) => conv._id === state.conversationId)
                ?.chat.map((chat) => (
                  <Chat from={chat.from} key={chat._id}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      {chat._id === "test2" && (
                        <BounceLoader size={"0.7rem"} color="#3F66DA" />
                      )}
                      {chat.data}
                    </div>
                  </Chat>
                ))}
              <div ref={chatEndRef} />
            </ChatCon>
          )}
        </Context>
        <div
          style={{
            width: "100%",
            height: "10%",
            display: "flex",
            gap: "15px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InputField
            removeFileName={updateFileName}
            conversationId={
              state.conversations.find(
                (conv) => conv._id === state.conversationId
              )?._id
            }
            selectedFileName={state.selectedFileName}
            placeholder={""}
            type={"file"}
            value={""}
            selectedFile={state.selectedFile}
            setFile={(e) => setFile(e!)}
            addNotification={addNotification}
          />
          <InputField
            sx={{
              minWidth: "60%",
              pointerEvents:
                isUserLoggedIn && state.selectedFileName !== ""
                  ? "auto"
                  : "none",
            }}
            placeholder={
              isUserLoggedIn
                ? state.selectedFileName !== ""
                  ? "Ask me a question"
                  : "Upload a file first"
                : "Login to ask"
            }
            type={"text"}
            value={state.question}
            onChange={(e) => setState((prev) => ({ ...prev, question: e }))}
          />
          <Button
            disabled={
              !isUserLoggedIn ||
              state.selectedFileName === "" ||
              state.question === ""
            }
            sx={{ padding: "0.7rem 0.8rem" }}
            icon={<FontAwesomeIcon icon={faArrowUp} />}
            onClick={askQuestion}
          />
        </div>
      </Content>
      {state.modal && (
        <Modal onClose={closeModal}>
          <Spacer type={"vertical"} value={"2rem"} />
          <Label font={"md"} weight={"b"} content={state.modalChild} />
          <Spacer type={"vertical"} value={"2rem"} />
          {state.modalChild === "Apikey" ? (
            <>
              <Label
                font={"xsm"}
                weight={"b"}
                content={"Enter you openai api key here"}
              />
              <Spacer type={"vertical"} value={"1rem"} />
              <InputField
                width="80%"
                placeholder={"Openai api key"}
                type={"text"}
                value={state.apikey.value}
                ierror={state.apikey.error}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    apikey: { ...prev.apikey, value: e },
                  }))
                }
              />
              {state.apikey.error && (
                <Label
                  sx={{ color: "red" }}
                  font={"xsm"}
                  weight={"b"}
                  content={"Please enter key"}
                />
              )}
              <Spacer type={"vertical"} value={"2rem"} />
              <Button
                sx={{ width: "5vw" }}
                placeholder={"Save"}
                onClick={submitApikey}
              />
            </>
          ) : (
            <>
              {state.modalChild === "Signup" && (
                <>
                  <InputField
                    width="80%"
                    placeholder={"Name"}
                    type={"text"}
                    value={state.name.value}
                    ierror={state.name.error}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        name: { ...prev.name, value: e },
                      }))
                    }
                  />
                  {state.name.error && (
                    <Label
                      sx={{ color: "red" }}
                      font={"xsm"}
                      weight={"b"}
                      content={"Name required"}
                    />
                  )}
                  <Spacer type={"vertical"} value={"1rem"} />
                </>
              )}
              <InputField
                width="80%"
                placeholder={"Email"}
                type={"email"}
                value={state.email.value}
                ierror={state.email.error}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    email: { ...prev.email, value: e },
                  }))
                }
              />
              {state.email.error && (
                <Label
                  sx={{ color: "red" }}
                  font={"xsm"}
                  weight={"b"}
                  content={
                    state.email.value.trim() === ""
                      ? "Email required"
                      : "Enter a valid email"
                  }
                />
              )}
              <Spacer type={"vertical"} value={"1rem"} />
              <InputField
                width="80%"
                placeholder={"Password"}
                type={"password"}
                value={state.password.value}
                ierror={state.password.error}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    password: { ...prev.password, value: e },
                  }))
                }
              />
              {state.password.error && (
                <Label
                  sx={{ color: "red" }}
                  font={"xsm"}
                  weight={"b"}
                  content={"Password required"}
                />
              )}
              {state.modalChild === "Signup" && (
                <>
                  <Spacer type={"vertical"} value={"1rem"} />
                  <InputField
                    width="80%"
                    placeholder={"Confirm Password"}
                    type={"password"}
                    value={state.cnfPassword.value}
                    ierror={state.cnfPassword.error}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        cnfPassword: { ...prev.cnfPassword, value: e },
                      }))
                    }
                  />
                  {state.cnfPassword.error && (
                    <Label
                      sx={{ color: "red" }}
                      font={"xsm"}
                      weight={"b"}
                      content={
                        state.cnfPassword.value === ""
                          ? "Password required"
                          : "Password is not same"
                      }
                    />
                  )}
                </>
              )}
              <Spacer type={"vertical"} value={"2rem"} />
              <Button
                sx={{ width: "5vw" }}
                placeholder={state.modalChild}
                onClick={state.modalChild === "Signup" ? signup : login}
              />
            </>
          )}
        </Modal>
      )}
      <Notifications cards={state.cards} removeCard={removeNotification} />
      {state.loading.value && <Loader msg={state.loading.msg} />}
    </Container>
  );
}

const Chat = styled.div<{ from: "user" | "assistant" }>`
  align-self: ${(p) => (p.from === "assistant" ? "start" : "end")};
  background-color: ${(p) => p.theme.colors.base300};
  padding: 1rem;
  border-radius: 10px;
  position: relative;
  max-width: 70%;
  color: ${(p) => p.theme.colors.font100};
  ${(p) =>
    p.from === "assistant" ? "margin-left: 2rem" : "margin-right: 2rem"}
`;

const ChatCon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  overflow: hidden;
  overflow-y: scroll;
  ${hideScrollbarStyles}
  padding: 1rem 0rem;
  gap: 2rem;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  color: ${(p) => p.theme.colors.font100};
`;

const LogoContainer = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 84%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentHeader = styled.div`
  width: 100%;
  height: 6%;
  display: flex;
  align-items: center;
`;

const ModeContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: end;
  margin-right: 1rem;
`;

const Context = styled.div`
  width: 100%;
  height: 84%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

export default Dashboard;
