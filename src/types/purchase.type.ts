export interface Purchase {
  date: string;
  id: number;
  productId: number;
  username: string;
}

export interface Product {
  id: number;
  face: string;
  price: number;
  size: number;
}
