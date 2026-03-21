import { Product, ProductDTO } from "../interface/Product";
import { requestJson } from "./http";

const API_URL = "http://localhost:3000/product";

/**
 * Loads product list from API path and maps raw DTO to domain model.
 * @param path Relative endpoint path.
 * @returns Product models.
 */
async function getProducts(path = ""): Promise<Product[]> {
  const data = await requestJson<ProductDTO[]>(`${API_URL}${path}`);
  return data.map(product => new Product(product));
}

export const ProductService = {
  /**
   * Returns full product catalog.
   * @returns Product list.
   */
  async getAll(): Promise<Product[]> {
    return getProducts("/");
  },

  /**
   * Finds products by search query.
   * @param query Search phrase.
   * @returns Matching products.
   */
  async search(query: string): Promise<Product[]> {
    return getProducts(`/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Filters products by category type.
   * @param type Category name.
   * @returns Filtered products.
   */
  async getByType(type: string): Promise<Product[]> {
    return getProducts(`/type/${encodeURIComponent(type)}`);
  },

  /**
   * Filters products by popularity.
   * @param isPopular Popularity flag.
   * @returns Filtered products.
   */
  async getPopular(isPopular: boolean): Promise<Product[]> {
    return getProducts(`/popular/${isPopular}`);
  },

  /**
   * Filters products by availability.
   * @param inStock Availability flag.
   * @returns Filtered products.
   */
  async getByAvailability(inStock: boolean): Promise<Product[]> {
    return getProducts(`/availability/${inStock}`);
  },

  /**
   * Sorts products by ascending price.
   * @returns Sorted products.
   */
  async sortByPriceAsc(): Promise<Product[]> {
    return getProducts("/sort/price-asc");
  },

  /**
   * Sorts products by descending price.
   * @returns Sorted products.
   */
  async sortByPriceDesc(): Promise<Product[]> {
    return getProducts("/sort/price-desc");
  },

  /**
   * Sorts products by name.
   * @returns Sorted products.
   */
  async sortByName(): Promise<Product[]> {
    return getProducts("/sort/name");
  },

  /**
   * Sorts products by rating.
   * @returns Sorted products.
   */
  async sortByRating(): Promise<Product[]> {
    return getProducts("/sort/rating");
  }
};
