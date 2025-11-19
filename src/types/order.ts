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

