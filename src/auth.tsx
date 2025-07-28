import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { auth } from "./firebase";
import firebase from "./firebase";

export interface User {
  uid: string;
  email: string;
}

export interface IAuthContext {
  user: User | null;
  isUserLoading: boolean;
  login: () => Promise<firebase.auth.UserCredential>;
  logout: () => Promise<void>;
}

// auth context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<IAuthContext | null>(null);

const provider = new firebase.auth.GoogleAuthProvider();

export default function AuthProvider({ children }: { children: ReactNode }) {
  // user state
  const [user, setUser] = useState<User | null>(null);
  // user loading state
  const [isUserLoading, setIsUserLoading] = useState(true);

  const login = useCallback(() => {
    setIsUserLoading(true);
    return auth.signInWithPopup(provider);
  }, []);

  const logout = useCallback(() => {
    setIsUserLoading(true);
    return auth.signOut();
  }, []);

  const contextValue = useMemo(() => {
    return {
      user,
      isUserLoading,
      login,
      logout,
    };
  }, [user, isUserLoading, login, logout]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setUser({ uid: user.uid, email: user.email });
      } else {
        setUser(null);
      }

      //   finally set user loading to false
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}
