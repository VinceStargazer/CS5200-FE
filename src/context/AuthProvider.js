import { createContext, useState } from 'react';
import user from '../data/user';

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: user,
  isLoggedIn: true,
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
