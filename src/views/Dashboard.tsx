import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import Label from "../components/Label";
import { getGreeting, validateEmail } from "../utils";
import ModeToggle from "../components/ModeToggle";
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
import { faArrowUp, faPaperclip } from "@fortawesome/free-solid-svg-icons";

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
  modalChild: "Login" | "Signup";
  signupCompleted: {
    value: number;
    msg: string;
  };
  loginError: {
    value: boolean;
    msg: string;
  };
  question: string;
  selectedFile: File | null;
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
    signupCompleted: {
      value: 0,
      msg: "",
    },
    loginError: {
      value: false,
      msg: "Invalid credentials",
    },
    question: '',
    selectedFile: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const isUserLoggedIn = useSelector((state: any) => state.isUserLoggedIn);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("modal") === "login") {
      setState((prev) => ({ ...prev, modalChild: "Login", modal: true }));
    } else if (params.get("modal") === "signup") {
      setState((prev) => ({ ...prev, modalChild: "Signup", modal: true }));
    } else {
      setState((prev) => ({ ...prev, modal: false }));
    }
  }, [location.search]);

  const openModal = (type: string) => {
    navigate(`?modal=${type}`);
  };

  const closeModal = () => {
    navigate("/");
    setState((prev) => ({
      ...prev,
      signupCompleted: { ...prev.signupCompleted, value: 0, msg: "" },
      name: { ...prev.name, value: "", error: false },
      email: { ...prev.email, value: "", error: false },
      password: { ...prev.password, value: "", error: false },
      cnfPassword: { ...prev.cnfPassword, value: "", error: false },
      loginError: { ...prev.loginError, value: false },
    }));
  };

  useEffect(() => {
    if (state.password.value === state.cnfPassword.value) {
      setState((prev) => ({
        ...prev,
        cnfPassword: { ...prev.cnfPassword, error: false },
      }));
    }
  }, [state.cnfPassword.value]);

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
          setState((prev) => ({
            ...prev,
            password: { ...prev.password, value: "" },
            email: { ...prev.email, value: "" },
            loginError: { ...prev.loginError, value: false },
          }));
          dispatch(setIsUserLoggedIn(true));
          navigate("/");
        } catch {
          setState((prev) => ({
            ...prev,
            loginError: { ...prev.loginError, value: true },
          }));
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
          setState((prev) => ({
            ...prev,
            signupCompleted: {
              ...prev.signupCompleted,
              value: 1,
              msg: "Account created successfully.",
            },
            name: { ...prev.name, value: "" },
            email: { ...prev.email, value: "" },
            password: { ...prev.password, value: "" },
            cnfPassword: { ...prev.cnfPassword, value: "" },
          }));
        } catch (error: any) {
          setState((prev) => ({
            ...prev,
            signupCompleted: {
              ...prev.signupCompleted,
              value: 2,
              msg: error.response.data.msg,
            },
          }));
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

  return (
    <Container>
      <Sidebar />
      <Content>
        <ContentHeader>
          <Label
            sx={{ marginLeft: "1rem" }}
            font={"sm"}
            weight={"b"}
            content={getGreeting()}
          />
          <ModeContainer>
            <ModeToggle />
          </ModeContainer>
        </ContentHeader>
        <Context>
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
        </Context>
        <div style={{width: '100%', height: '10%', display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center'}}>
            {/* <Button disabled={!isUserLoggedIn} sx={{padding: '0.7rem 0.8rem'}} icon={<FontAwesomeIcon icon={faPaperclip}/>} onClick={() => console.log('aa')} /> */}
            <InputField placeholder={""} type={"file"} value={""} onChange={() => console.log('')} selectedFile={state.selectedFile} setFile={(e) => setState((prev) => ({...prev, selectedFile: e}))}/>
            <InputField sx={{minWidth: '60%', pointerEvents: isUserLoggedIn ? 'auto' : 'none'}} placeholder={isUserLoggedIn ? "Ask me a question" : "Login to ask"} type={"text"} value={state.question} onChange={(e) => setState((prev) => ({...prev, question: e}))}/>
            <Button disabled={!isUserLoggedIn} sx={{padding: '0.7rem 0.8rem'}} icon={<FontAwesomeIcon icon={faArrowUp} />} onClick={() => console.log('aa')}/>
        </div>
      </Content>
      {state.modal && (
        <Modal width="30vw" onClose={closeModal}>
          <Spacer type={"vertical"} value={"2rem"} />
          <Label font={"md"} weight={"b"} content={state.modalChild} />
          <Spacer type={"vertical"} value={"2rem"} />
          {state.modalChild === "Signup" && (
            <>
              <InputField
                width="20vw"
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
            width="20vw"
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
            width="20vw"
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
                width="20vw"
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
          {state.signupCompleted.value !== 0 && (
            <>
              <Spacer type={"vertical"} value={"2rem"} />
              <Label
                sx={{
                  color: state.signupCompleted.value === 1 ? "green" : "red",
                }}
                font={"xsm"}
                weight={"b"}
                content={state.signupCompleted.msg}
              />
            </>
          )}
          {state.loginError.value && (
            <>
              <Spacer type={"vertical"} value={"2rem"} />
              <Label
                sx={{ color: "red" }}
                font={"xsm"}
                weight={"b"}
                content={state.loginError.msg}
              />
            </>
          )}
        </Modal>
      )}
    </Container>
  );
}

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
