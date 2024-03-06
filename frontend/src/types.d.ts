export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  token?: string;
  favorites: string[];
  isVerified: boolean;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface RegisterMutation extends LoginMutation {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface GlobalError {
  error: string;
}

export interface GlobalSuccess {
  message: {
    ru: string;
    en: string;
  };
}

export interface CategoriesType {
  _id: string;
  name: string;
  ID: string;
  ownerID?: string;
  productsHave: boolean;
}

export interface ProductType {
  _id: string;
  name: string;
  article: string;
  goodID: string;
  measureCode: string;
  measureName: string;
  ownerID: string;
  images: string[];
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

export interface ImgType {
  image: File | null;
}

export interface ProductTypeMutation {
  _id: string;
  name: string;
  article: string;
  goodID: string;
  measureCode: string;
  measureName: string;
  ownerID: string;
  images?: File[];
  quantity: {
    name: string;
    stockID: string;
    quantity: number;
  }[];
  price: number;
}

export interface ProductBasketType extends ProductType {
  quantity: number;
}

export interface CabinetState {
  [key: string]: boolean;
}

export interface BasketTypeToServer {
  user_id?: string;
  session_key?: string;
  items: {
    product: string;
    quantity: number;
  }[];
  totalPrice: number;
}

export interface BasketTypeOnServerMutation {
  _id: string;
  user_id?: string;
  session_key?: string;
  items: {
    _id: string;
    product: ProductType;
    quantity: number;
  }[];
  totalPrice: number;
}

export interface BasketUpdateRequest {
  sessionKey?: string;
  product_id?: string;
  action: 'increase' | 'decrease' | 'remove' | 'clear';
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface ProductsSearchPreview {
  results: ProductType[];
  hasMore: boolean;
}

export interface OrderSendType {
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

export interface OrderFromServerType {
  _id: string;
  orderArt: string;
  user_id?: User;
  admin_id?: User;
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
    product: ProductType;
    quantity: number;
  }[];
}

export interface ChatIdAdminType {
  _id: string;
  chat_id: string;
  user_id: string;
}

export interface BestsellerType {
  _id: string;
  bestseller_id: string;
}

export interface BannerType {
  _id: string;
  title: string;
  desk: string;
  image: string;
}

export interface BannerToServerType {
  title: string;
  desk: string;
  image: File | null;
}

// export interface ProductForType {
//   _id: string;
//   category: CategoriesType;
//   products: ProductType[];
// }

export interface ProductForType {
  _id: string;
  categoryID: CategoriesType;
  categoryForID: CategoriesType[];
}

export interface ProductForOneType {
  _id: string;
  categoryID: CategoriesType;
  categoryForID: ProductType[];
}

export interface ProductForOneCategoryType {
  _id: string;
  categoryID: CategoriesType;
  categoryForID: CategoriesType[];
}

export interface ProductForToServer {
  categoryID: string;
  categoryForID: string[];
}
