"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import {
  User as AuthUser,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

interface AuthContextType {
  authUser: AuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  authUser: null,
  login: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface Props {
  children: ReactNode;
  loginComponent: ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children, loginComponent }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
    });
    setIsInitialized(true);
    return unsubscribe;
  }, [auth]);

  const login = useCallback(async () => {
    if (auth.currentUser) {
      setAuthUser(auth.currentUser);
      return;
    }

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Login error:", error);
    }
  }, [auth]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [auth]);

  if (!isInitialized) return <></>;

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {authUser ? children : loginComponent}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
