import { createContext } from "react";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

const AUTH_TOKEN_NAME = "userAuthToken";

export const AuthContext = createContext({
  loginSuccess: (userToken) => {},
  logoutSuccess: () => {},
  getUserFromToken: () => {},
});

export default function AuthProvider(props) {
  const [cookies, setCookies, removeCookies] = useCookies([AUTH_TOKEN_NAME]);

  const loginSuccess = (userToken) => {
    setCookies(AUTH_TOKEN_NAME, userToken);
  };

  const logoutSuccess = () => {
    removeCookies(AUTH_TOKEN_NAME);
  };

  const getUserFromToken = () => {
    const { userAuthToken } = cookies;
    if (userAuthToken) return jwt_decode(userAuthToken);
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ loginSuccess, logoutSuccess, getUserFromToken }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
