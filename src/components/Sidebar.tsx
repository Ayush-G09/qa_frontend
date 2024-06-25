import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
import { setIsUserLoggedIn } from "../store/themeAction";

type State = {
  modal: boolean;
};

function Sidebar() {
  const [state, setState] = useState<State>({
    modal: false,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const isUserLoggedIn = useSelector((state: any) => state.isUserLoggedIn);
  const dispatch = useDispatch();

  console.log({isUserLoggedIn})

  const openModal = () => {
    navigate(`?modal=logout`);
  };

  const closeModal = () => {
    navigate("/");
  };

  const logout = () => {
    dispatch(setIsUserLoggedIn(false));
    localStorage.removeItem('authToken');
    navigate("/");
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("modal") === "logout") {
      setState((prev) => ({ ...prev, modal: true }));
    } else {
      setState((prev) => ({ ...prev, modal: false }));
    }
  }, [location.search]);

  return (
    <SidebarCon>
      <Header>
        <Options>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          <Label content={"Askq"} font={"sm"} weight={"n"} />
          <IconContainer>
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{ marginRight: "0.5rem" }}
            />
          </IconContainer>
        </Options>
      </Header>
      <div style={{ display: "flex", flex: 1 }}></div>
      <Header style={{ marginTop: "0px", marginBottom: "10px" }}>
        {isUserLoggedIn && <Options style={{ height: "35px" }} onClick={openModal}>
          <Label content={"Logout"} font={"sm"} weight={"n"} />
          <IconContainer>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              style={{ marginRight: "0.5rem" }}
            />
          </IconContainer>
        </Options>}
      </Header>
      {state.modal && (
        <Modal width="30vw" onClose={closeModal}>
            <Spacer type={"vertical"} value={"2rem"}/>
          <Label sx={{textAlign: 'center'}} font={"md"} weight={"n"} content={"You want to logout ?"}/>
          <Spacer type={"vertical"} value={"4rem"}/>
          <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
            <Button sx={{backgroundColor: '#2ABB7F'}} placeholder={"Yes"} onClick={logout}/>
            <Button sx={{backgroundColor: '#F15B50'}} placeholder={"No"} onClick={closeModal}/>
          </div>
        </Modal>
      )}
    </SidebarCon>
  );
}

const SidebarCon = styled.div`
  width: 16%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${(p) => p.theme.colors.base300};
  gap: 10px;
`;

const Options = styled.div`
  width: 90%;
  padding: 0.3rem 0.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;

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
