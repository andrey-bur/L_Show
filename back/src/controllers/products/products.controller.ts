import { readData } from "../../servires/database.servires"

const file = "products"

type Product = {
  id: number
  name: string
  categoryName: string
  price: number
  rating: number
  volume: string
  country: string
  image: string
  popular: boolean
}

export async function getAllProducts(): Promise<Product[]> {
  return await readData(file)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products: Product[] = await readData(file)
  const value = query.toLowerCase()

  return products.filter(p =>
    p.name.toLowerCase().includes(value) ||
    p.categoryName.toLowerCase().includes(value) ||
    p.country.toLowerCase().includes(value)
  )
}

export async function filterProductsByType(type: string): Promise<Product[]> {
  const products: Product[] = await readData(file)
  return products.filter(p => p.categoryName === type)
}

export async function filterProductsByPopular(popular: boolean): Promise<Product[]> {
  const products: Product[] = await readData(file)
  return products.filter(p => p.popular === popular)
}

export async function sortProductsByPriceAsc(): Promise<Product[]> {
  const products: Product[] = await readData(file)
  return products.sort((a, b) => a.price - b.price)
}

export async function sortProductsByPriceDesc(): Promise<Product[]> {
  const products: Product[] = await readData(file)
  return products.sort((a, b) => b.price - a.price)
}

export async function sortProductsByName(): Promise<Product[]> {
  const products: Product[] = await readData(file)
  return products.sort((a, b) => a.name.localeCompare(b.name))
}

export async function sortProductsByRating(): Promise<Product[]> {
  const products: Product[] = await readData(file)
  return products.sort((a, b) => b.rating - a.rating)
}