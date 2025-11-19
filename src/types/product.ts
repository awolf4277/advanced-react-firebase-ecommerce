export interface Product {
  id: string; // Firestore doc id
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  createdAt?: number;
}
