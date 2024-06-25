import { jwtDecode } from "jwt-decode";

export function getGreeting() {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return "Good Morning";
  } else if (hours < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

export function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isTokenValid(token: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp) {
      return decoded.exp > currentTime;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export function checkAuthToken() {
  const token = localStorage.getItem("authToken");
  if (token) {
    return isTokenValid(token);
  }
  return false;
}

