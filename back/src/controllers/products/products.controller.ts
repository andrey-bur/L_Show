import { readData } from "../../servires/database.servires"
import { Product } from "../../../types/Product"

const file = "products"

export type ProductQuery = {
  search?: string
  type?: string
  inStock?: boolean
  sort?: "price-asc" | "price-desc" | "name" | "rating"
}

export async function getAllProducts(): Promise<Product[]> {
  return readData<Product>(file)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  const value = query.toLowerCase()

  return products.filter(p =>
    p.name.toLowerCase().includes(value) ||
    p.description.toLowerCase().includes(value) ||
    p.categoryName.toLowerCase().includes(value) ||
    p.country.toLowerCase().includes(value)
  )
}

export async function filterProductsByType(type: string): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.filter(p => p.categoryName === type)
}

export async function filterProductsByPopular(popular: boolean): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.filter(p => p.popular === popular)
}

export async function sortProductsByPriceAsc(): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.sort((a, b) => a.price - b.price)
}

export async function sortProductsByPriceDesc(): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.sort((a, b) => b.price - a.price)
}

export async function sortProductsByName(): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.sort((a, b) => a.name.localeCompare(b.name))
}

export async function sortProductsByRating(): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.sort((a, b) => b.rating - a.rating)
}

export async function filterProductsByAvailability(inStock: boolean): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.filter(product => product.inStock === inStock)
}

export async function getProductsByQuery(query: ProductQuery): Promise<Product[]> {
  let products = await getAllProducts()

  if (query.search) {
    const normalizedSearch = query.search.toLowerCase()
    products = products.filter(product =>
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      product.categoryName.toLowerCase().includes(normalizedSearch) ||
      product.country.toLowerCase().includes(normalizedSearch)
    )
  }

  if (query.type) {
    products = products.filter(product => product.categoryName === query.type)
  }

  if (typeof query.inStock === "boolean") {
    products = products.filter(product => product.inStock === query.inStock)
  }

  switch (query.sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      products.sort((a, b) => b.price - a.price)
      break
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "rating":
      products.sort((a, b) => b.rating - a.rating)
      break
  }

  return products
}
