import { addItem, readData, updateItem } from "../../servires/database.servires"
import { Basket } from "../../../types/Besket"

const file = "basket"

export async function getAllBaskets(): Promise<Basket[]> {
  return readData<Basket>(file)
}

export async function getBasketByUserId(userId: number): Promise<Basket | null> {
  const baskets = await getAllBaskets()
  return baskets.find(basket => basket.userId === userId) ?? null
}

export async function createBasket(userId: number): Promise<Basket> {
  const baskets = await getAllBaskets()

  const basket: Basket = {
    id: baskets.reduce((currentMax, currentBasket) => Math.max(currentMax, currentBasket.id), 0) + 1,
    userId,
    items: []
  }

  await addItem(file, basket)

  return basket
}

export async function updateBasketByUserId(userId: number, basketData: Basket["items"]): Promise<Basket | null> {
  const baskets = await getAllBaskets()
  const currentBasket = baskets.find(basket => basket.userId === userId)

  if (!currentBasket) {
    return null
  }

  return updateItem<Basket>(file, currentBasket.id, { items: basketData })
}
