import { Product } from "../interface/Product";

const API_URL = "http://localhost:3000/product";
export const ProductService = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}})
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async search(query: string): Promise<Product[]> {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async getByType(type: string): Promise<Product[]> {
    const res = await fetch(`${API_URL}/type/${encodeURIComponent(type)}`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async getPopular(isPopular: boolean): Promise<Product[]> {
    const res = await fetch(`${API_URL}/popular/${isPopular}`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async getByAvailability(inStock: boolean): Promise<Product[]> {
    const res = await fetch(`${API_URL}/availability/${inStock}`, { headers: {
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByPriceAsc(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/price-asc`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByPriceDesc(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/price-desc`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByName(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/name`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  },

  async sortByRating(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/sort/rating`,{headers:{
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
}});
    const data: Product[] = await res.json();
    return data.map(p => new Product(p));
  }
};
