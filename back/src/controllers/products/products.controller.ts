import { readData } from "../../servires/database.servires"
import { Product } from "../../../types/Product"

const file = "products"
type ProductSort = "price-asc" | "price-desc" | "name" | "rating"

export type ProductQuery = {
  search?: string
  type?: string
  inStock?: boolean
  sort?: ProductSort
}

function matchesSearch(product: Product, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return true
  }

  return (
    product.name.toLowerCase().includes(normalizedSearch) ||
    product.description.toLowerCase().includes(normalizedSearch) ||
    product.categoryName.toLowerCase().includes(normalizedSearch) ||
    product.country.toLowerCase().includes(normalizedSearch)
  )
}

function sortProducts(products: Product[], sort?: ProductSort): Product[] {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => a.price - b.price)
    case "price-desc":
      return [...products].sort((a, b) => b.price - a.price)
    case "name":
      return [...products].sort((a, b) => a.name.localeCompare(b.name))
    case "rating":
      return [...products].sort((a, b) => b.rating - a.rating)
    default:
      return products
  }
}

function applyProductQuery(products: Product[], query: ProductQuery): Product[] {
  const filteredProducts = products.filter(product => {
    if (query.search && !matchesSearch(product, query.search)) {
      return false
    }

    if (query.type && product.categoryName !== query.type) {
      return false
    }

    if (typeof query.inStock === "boolean" && product.inStock !== query.inStock) {
      return false
    }

    return true
  })

  return sortProducts(filteredProducts, query.sort)
}

export async function getAllProducts(): Promise<Product[]> {
  return readData<Product>(file)
}

export async function searchProducts(query: string): Promise<Product[]> {
  return getProductsByQuery({ search: query })
}

export async function filterProductsByType(type: string): Promise<Product[]> {
  return getProductsByQuery({ type })
}

export async function filterProductsByPopular(popular: boolean): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.filter(p => p.popular === popular)
}

export async function sortProductsByPriceAsc(): Promise<Product[]> {
  return getProductsByQuery({ sort: "price-asc" })
}

export async function sortProductsByPriceDesc(): Promise<Product[]> {
  return getProductsByQuery({ sort: "price-desc" })
}

export async function sortProductsByName(): Promise<Product[]> {
  return getProductsByQuery({ sort: "name" })
}

export async function sortProductsByRating(): Promise<Product[]> {
  return getProductsByQuery({ sort: "rating" })
}

export async function filterProductsByAvailability(inStock: boolean): Promise<Product[]> {
  return getProductsByQuery({ inStock })
}

export async function getProductsByQuery(query: ProductQuery): Promise<Product[]> {
  const products = await getAllProducts()
  return applyProductQuery(products, query)
}
