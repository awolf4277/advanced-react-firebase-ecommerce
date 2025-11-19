import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../firebase/firebaseConfig";
import type { Order, OrderItem } from "../types/order";

const ordersRef = collection(db, "orders");

export const createOrder = async (payload: {
  userId: string;
  items: OrderItem[];
  total: number;
}): Promise<void> => {
  await addDoc(ordersRef, {
    userId: payload.userId,
    items: payload.items,
    total: payload.total,
    createdAt: serverTimestamp()
  });
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
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
      items: data.items,
      total: data.total,
      createdAt
    } as Order;
  });
};

export const useUserOrdersQuery = (userId: string | null | undefined) =>
  useQuery({
    queryKey: ["orders", userId],
    queryFn: () => fetchUserOrders(userId!),
    enabled: !!userId
  });
