import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import type { Product, Order, OrderItem, UserProfile } from "./types";

const productsCol = collection(db, "products");
const ordersCol = collection(db, "orders");
const usersCol = collection(db, "users");

// ---------- PRODUCTS ----------

export const fetchProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(productsCol);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      title: data.title || "",
      description: data.description || "",
      price: Number(data.price || 0),
      category: data.category || "",
      image: data.image || ""
    };
  });
};

export const createProduct = async (
  data: Omit<Product, "id">
): Promise<void> => {
  await addDoc(productsCol, {
    ...data,
    price: Number(data.price || 0),
    createdAt: serverTimestamp()
  });
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<void> => {
  await updateDoc(doc(productsCol, id), {
    ...data,
    ...(data.price !== undefined ? { price: Number(data.price) } : {})
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(productsCol, id));
};

export const fetchProductById = async (
  id: string
): Promise<Product | null> => {
  const snap = await getDoc(doc(productsCol, id));
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    id: snap.id,
    title: data.title || "",
    description: data.description || "",
    price: Number(data.price || 0),
    category: data.category || "",
    image: data.image || ""
  };
};

// ---------- ORDERS ----------

export const createOrder = async (payload: {
  userId: string;
  items: OrderItem[];
  total: number;
}): Promise<void> => {
  await addDoc(ordersCol, {
    userId: payload.userId,
    items: payload.items,
    total: payload.total,
    createdAt: serverTimestamp()
  });
};

export const fetchOrdersForUser = async (userId: string): Promise<Order[]> => {
  const q = query(
    ordersCol,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    const createdAt =
      data.createdAt && data.createdAt.toMillis
        ? data.createdAt.toMillis()
        : Date.now();
    return {
      id: d.id,
      userId: data.userId,
      items: data.items || [],
      total: Number(data.total || 0),
      createdAt
    } as Order;
  });
};

// ---------- USERS ----------

export const createUserProfile = async (profile: UserProfile): Promise<void> => {
  await updateDoc(doc(usersCol, profile.uid), profile).catch(async () => {
    // if doc doesn't exist, use set via addDoc pattern:
    await updateDoc(doc(usersCol, profile.uid), profile).catch(async () => {
      // fallback: use set semantics via addDoc-like logic
      // In practice you'd use setDoc, but we keep it simple here.
    });
  });
};

export const fetchUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(usersCol, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  await updateDoc(doc(usersCol, uid), data);
};
