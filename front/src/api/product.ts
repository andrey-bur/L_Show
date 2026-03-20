import { Product } from "../interface/Product";
import { requestJson } from "./http";

const API_URL = "http://localhost:3000/product";

async function getProducts(path = ""): Promise<Product[]> {
  const data = await requestJson<Product[]>(`${API_URL}${path}`);
  return data.map(product => new Product(product));
}

export const ProductService = {
  async getAll(): Promise<Product[]> {
    return getProducts("/");
  },

  async search(query: string): Promise<Product[]> {
    return getProducts(`/search?q=${encodeURIComponent(query)}`);
  },

  async getByType(type: string): Promise<Product[]> {
    return getProducts(`/type/${encodeURIComponent(type)}`);
  },

  async getPopular(isPopular: boolean): Promise<Product[]> {
    return getProducts(`/popular/${isPopular}`);
  },

  async getByAvailability(inStock: boolean): Promise<Product[]> {
    return getProducts(`/availability/${inStock}`);
  },

  async sortByPriceAsc(): Promise<Product[]> {
    return getProducts("/sort/price-asc");
  },

  async sortByPriceDesc(): Promise<Product[]> {
    return getProducts("/sort/price-desc");
  },

  async sortByName(): Promise<Product[]> {
    return getProducts("/sort/name");
  },

  async sortByRating(): Promise<Product[]> {
    return getProducts("/sort/rating");
  }
};
