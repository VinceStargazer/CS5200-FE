import { createContext, useState } from 'react';

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: '',
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  const handleLogin = async (email, password) => {};

  const handleLogout = async () => {}

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;
  };

  return (
    <AuthContext.Provider
      value={{ authInfo, handleLogin, handleLogout, isAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
