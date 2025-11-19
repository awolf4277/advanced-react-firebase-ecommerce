import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebase/firebaseConfig";
import type { Product } from "../types/product";

const productsRef = collection(db, "products");

export const mapProduct = (d: any): Product => ({
  id: d.id,
  title: d.title,
  description: d.description,
  price: d.price,
  category: d.category,
  image: d.image,
  createdAt: d.createdAt
});

export const fetchProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(productsRef);
  return snap.docs.map((docSnap) =>
    mapProduct({ id: docSnap.id, ...docSnap.data() })
  );
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapProduct({ id: snap.id, ...snap.data() });
};

export const useProductsQuery = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts
  });

export const useProductQuery = (id: string) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id
  });

export const createProduct = async (
  data: Omit<Product, "id" | "createdAt">
): Promise<void> => {
  await addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<void> => {
  const ref = doc(db, "products", id);
  await updateDoc(ref, data);
};

export const deleteProductById = async (id: string): Promise<void> => {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
};

export const useCreateProductMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  });
};

export const useUpdateProductMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<Omit<Product, "id">> }) =>
      updateProduct(payload.id, payload.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  });
};

export const useDeleteProductMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProductById,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  });
};
