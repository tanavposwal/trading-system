export interface Balances {
  [key: string]: number;
}

export interface User {
  id: string;
  name: string;
  balances: Balances;
}

export interface Order {
  userId: string;
  price: number;
  quantity: number;
}

export interface AnonyOrder {
  price: number;
  size: number;
}

export interface Orderbook {
  asks: AnonyOrder[];
  bids: AnonyOrder[];
}

