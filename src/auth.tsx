import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

export interface User {
  uid: string;
  email: string;
}

export interface IAuthContext {
  user: User | null;
  isUserLoading: boolean;
  login: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

// auth context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<IAuthContext | null>(null);

const provider = new GoogleAuthProvider();

export default function AuthProvider({ children }: { children: ReactNode }) {
  // user state
  const [user, setUser] = useState<User | null>(null);
  // user loading state
  const [isUserLoading, setIsUserLoading] = useState(true);

  const login = useCallback(() => {
    setIsUserLoading(true);
    return signInWithPopup(auth, provider);
  }, []);

  const logout = useCallback(() => {
    setIsUserLoading(true);
    return signOut(auth);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
