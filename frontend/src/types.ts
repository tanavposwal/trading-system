export interface User {
  id: string;
  name: string;
  stock: number;
  cash: number;
}

export interface Order {
  userId: string;
  price: number;
  quantity: number;
}

export interface AnonyOrder {
  price: number;
  quantity: number;
}

export interface Orderbook {
  asks: AnonyOrder[];
  bids: AnonyOrder[];
}

export interface Transaction {
  id: number;
  user_id: number;
  type: string;
  quantity: number;
  price: number;
  timestamp: string;
}
