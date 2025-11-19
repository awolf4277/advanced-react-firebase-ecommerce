import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  deleteUser
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { UserProfile } from "../types";

interface AuthUser {
  uid: string;
  email: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapUser = (fbUser: FirebaseUser): AuthUser => ({
  uid: fbUser.uid,
  email: fbUser.email
});

const ensureUserProfileSafe = async (fbUser: FirebaseUser) => {
  try {
    const ref = doc(db, "users", fbUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || "",
        name: "",
        address: "",
        createdAt: Date.now()
      };
      await setDoc(ref, profile);
    }
  } catch (err) {
    console.error("Failed to ensure user profile", err);
    // We DON'T rethrow – auth must still work even if Firestore rules are strict
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      const run = async () => {
        try {
          if (fbUser) {
            await ensureUserProfileSafe(fbUser);
            setUser(mapUser(fbUser));
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("onAuthStateChanged error", err);
        } finally {
          setLoading(false);
        }
      };
      run();
    });

    return () => unsub();
  }, []);

  const register = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserProfileSafe(cred.user);
    setUser(mapUser(cred.user));
  };

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserProfileSafe(cred.user);
    setUser(mapUser(cred.user));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    try {
      // delete user doc
      await deleteDoc(doc(db, "users", uid));

      // delete orders for this user
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", uid));
      const snap = await getDocs(q);
      const deletions: Promise<void>[] = [];
      snap.forEach((d) => deletions.push(deleteDoc(d.ref)));
      await Promise.all(deletions);
    } catch (err) {
      console.error("Failed to clean up Firestore for user", err);
    }

    await deleteUser(auth.currentUser);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
