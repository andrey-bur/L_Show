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

/**
 * Checks whether a product matches a case-insensitive search query.
 * @param product Product entity from storage.
 * @param search Free-form search string.
 * @returns True when at least one searchable field includes the query.
 */
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

/**
 * Applies sorting strategy to a product array.
 * @param products Product list.
 * @param sort Optional sorting mode.
 * @returns Sorted list according to selected mode.
 */
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

/**
 * Applies search/filter/sort query to product collection.
 * @param products Source products.
 * @param query Query options.
 * @returns Filtered and sorted products.
 */
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

/**
 * Returns all products.
 * @returns Full products list from storage.
 */
export async function getAllProducts(): Promise<Product[]> {
  return readData<Product>(file)
}

/**
 * Finds products by free-form query.
 * @param query Search phrase.
 * @returns Product list matching the search phrase.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  return getProductsByQuery({ search: query })
}

/**
 * Filters products by category name.
 * @param type Category name.
 * @returns Product list in the selected category.
 */
export async function filterProductsByType(type: string): Promise<Product[]> {
  return getProductsByQuery({ type })
}

/**
 * Filters products by popularity flag.
 * @param popular Popularity flag.
 * @returns Product list with matching popularity.
 */
export async function filterProductsByPopular(popular: boolean): Promise<Product[]> {
  const products: Product[] = await readData<Product>(file)
  return products.filter(p => p.popular === popular)
}

/**
 * Sorts products by price ascending.
 * @returns Sorted product list.
 */
export async function sortProductsByPriceAsc(): Promise<Product[]> {
  return getProductsByQuery({ sort: "price-asc" })
}

/**
 * Sorts products by price descending.
 * @returns Sorted product list.
 */
export async function sortProductsByPriceDesc(): Promise<Product[]> {
  return getProductsByQuery({ sort: "price-desc" })
}

/**
 * Sorts products by name.
 * @returns Sorted product list.
 */
export async function sortProductsByName(): Promise<Product[]> {
  return getProductsByQuery({ sort: "name" })
}

/**
 * Sorts products by rating.
 * @returns Sorted product list.
 */
export async function sortProductsByRating(): Promise<Product[]> {
  return getProductsByQuery({ sort: "rating" })
}

/**
 * Filters products by stock availability.
 * @param inStock In-stock state.
 * @returns Filtered products.
 */
export async function filterProductsByAvailability(inStock: boolean): Promise<Product[]> {
  return getProductsByQuery({ inStock })
}

/**
 * Applies a typed query object to the products collection.
 * @param query Filtering and sorting query.
 * @returns Filtered and sorted products list.
 */
export async function getProductsByQuery(query: ProductQuery): Promise<Product[]> {
  const products = await getAllProducts()
  return applyProductQuery(products, query)
}
