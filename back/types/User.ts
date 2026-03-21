export interface CartItem {
  id: number
  name: string
  image: string
  categoryName: string
  price: number
  quantity: number
}

export interface Delivery {
  id: number
  createdAt: string
  status: string
  address: string
  phone?: string
  email?: string
  paymentMethod?: string
  itemsCount: number
  total: number
}

export interface User {
  id: number
  name: string
  email: string
  login: string
  phone: string
  password: string
  cart: CartItem[]
  deliveries: Delivery[]
}
