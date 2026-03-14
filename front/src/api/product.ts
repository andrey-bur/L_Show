import { Product } from "../interface/Product";

const API_URL = "http://localhost:6967/products";

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async search(query: string): Promise<Product[]> {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async getByType(type: string): Promise<Product[]> {
    const res = await fetch(`${API_URL}/type/${encodeURIComponent(type)}`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async getPopular(isPopular: boolean): Promise<Product[]> {
    const res = await fetch(`${API_URL}/popular/${isPopular}`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByPriceAsc(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/price-asc`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByPriceDesc(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/price-desc`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByName(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/name`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByRating(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/rating`);
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  }
};
