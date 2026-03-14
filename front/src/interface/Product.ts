export class Product {
  id: number;
  name: string;
  categoryName: string;
  price: number;
  rating: number;
  volume: string;
  country: string;
  popular: boolean;
  image: string;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.categoryName = data.categoryName;
    this.price = data.price;
    this.rating = data.rating;
    this.volume = data.volume;
    this.country = data.country;
    this.popular = data.popular;
    this.image = data.image;
  }
}
