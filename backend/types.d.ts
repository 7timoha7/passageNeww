import { ObjectId } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  token: string;
  favorites: string[];
  googleId?: string;
  isVerified: boolean;
  verificationToken: string | null;
  createdAt: string;
}

export interface ICategory {
  name: string;
  ID: string;
  ownerID?: string;
  productsHave: boolean;
}

export interface ICategoryFromApi {
  name: string;
  ID: string;
  ownerID?: string;
}

export interface IProduct {
  name: string;
  article: string;
  goodID: string;
  measureCode: string;
  measureName: string;
  ownerID: string;
  images: string[] | null;
  quantity: {
    name: string;
    stockID: string;
    quantity: number;
  }[];
  price: number;
  description: string;
  size: string;
  thickness: string;
  originCountry: string;
}

export interface IProductQuantityFromApi {
  name: string;
  goodID: string;
  stockID: string;
  quantity: number;
}

export interface IProductQuantityStocksFromApi {
  name: string;
  stockID: string;
}

export interface IProductPriceFromApi {
  name: string;
  goodID: string;
  typeID: string;
  date: string;
  price: number;
}

export interface IProductFromApi {
  name: string;
  article: string;
  sku: string;
  goodID: string;
  type: number;
  vat: string;
  st: string;
  barcode: string;
  markType: number;
  measureCode: string;
  measureName: string;
  ownerID: string;
  imageBase64: string;
  imagesBase64: [];
  description: string;
  originCountry: string;
}

export interface IBasket {
  user_id?: ObjectId;
  session_key?: string;
  created_at: Date;
  updated_at: Date;
  items: {
    product: string;
    quantity: number;
  }[];
  totalPrice: number;
}

export interface IOrder {
  orderArt: string;
  user_id: ObjectId | undefined;
  admin_id: ObjectId | undefined;
  createdAt: string;
  status: string;
  totalPrice: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  paymentMethod: string;
  deliveryMethod: string;
  orderComment: string;
  products: {
    product: string;
    quantity: number;
  }[];
}

export interface IChatIdAdmin {
  user_id: ObjectId;
  chat_id: string;
}

export interface IBestseller {
  bestseller_id: string;
}

export interface IBanner {
  title: string;
  desk: string;
  image: string;
}

export interface IProductFor {
  categoryID: string;
  categoryForID: string[];
}
