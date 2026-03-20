export interface BasketItem {
  productId: number
  quantity: number
}

export interface Basket {
  id: number
  userId: number
  items: BasketItem[]
}
