export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  price: number;
  rating: number;
  volume: string;
  country: string;
  image: string;
  inStock: boolean;
  popular: boolean;
}

export class Product {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  price: number;
  rating: number;
  volume: string;
  country: string;
  image: string;
  inStock: boolean;
  popular: boolean;
  

  constructor(data: ProductDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.categoryName = data.categoryName;
    this.price = data.price;
    this.rating = data.rating;
    this.volume = data.volume;
    this.country = data.country;
    this.image = data.image;
    this.inStock = data.inStock;
    this.popular = data.popular;
  }
}
