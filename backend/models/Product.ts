import mongoose from 'mongoose';
import { IProduct } from '../types';

const Schema = mongoose.Schema;

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    // required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        stockID: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
  article: {
    type: String,
    required: true,
  },
  goodID: {
    type: String,
    required: true,
    unique: true,
  },
  measureCode: {
    type: String,
    // required: true,
  },
  measureName: {
    type: String,
    // required: true,
  },
  ownerID: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  size: {
    type: String,
  },
  thickness: {
    type: String,
  },
  originCountry: {
    type: String,
  },
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
