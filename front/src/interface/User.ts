export interface CartItem {
  id: number;
  name: string;
  image: string;
  categoryName: string;
  price: number;
  quantity: number;
}

export interface Delivery {
  id: number;
  createdAt: string;
  status: string;
  address: string;
  phone?: string;
  email?: string;
  paymentMethod?: string;
  itemsCount: number;
  total: number;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  cart: CartItem[];
  deliveries: Delivery[];
}

export class User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  cart: CartItem[];
  deliveries: Delivery[];

  constructor(data: UserDTO) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.login = data.login;
    this.phone = data.phone;
    this.password = data.password;
    this.cart = Array.isArray(data.cart) ? data.cart : [];
    this.deliveries = Array.isArray(data.deliveries) ? data.deliveries : [];
  }
}
