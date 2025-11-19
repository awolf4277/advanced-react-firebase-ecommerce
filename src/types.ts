export interface Product {
  id: string;          // Firestore doc id
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: number;
  items: OrderItem[];
  total: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  address: string;
  createdAt: number;
}
