import { checkAuthToken } from "../utils"; // Ensure you have the correct path to your auth file

const initialState = {
  mode: localStorage.getItem("mode") || "light",
  isUserLoggedIn: checkAuthToken(),  // Initialize based on checkAuthToken
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_IS_USER_LOGGED_IN":
      return { ...state, isUserLoggedIn: action.payload };
    default:
      return state;
  }
};

export default themeReducer;
