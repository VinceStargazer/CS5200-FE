import { createContext, useState } from 'react';
import { signInUser } from '../api/auth';
import { useNotification } from '../utils/hooks';

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: '',
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });
  const { updateNotification } = useNotification();

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, data } = await signInUser(email, password);

    if (error) {
      updateNotification('error', JSON.stringify(error));
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    setAuthInfo({
      ...authInfo,
      profile: { ...data },
      isLoggedIn: true,
      isPending: false,
      error: ""
    });
  };

  const handleLogout = async () => {
    setAuthInfo({ ...defaultAuthInfo });
  };

  const isAuth = async () => {
    const token = localStorage.getItem('auth-token');
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
