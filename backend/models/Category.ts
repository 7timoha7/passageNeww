import mongoose from 'mongoose';
import { ICategory } from '../types';

const Schema = mongoose.Schema;

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  ID: {
    type: String,
    required: true,
    unique: true,
  },
  ownerID: {
    type: String,
  },
  productsHave: {
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
