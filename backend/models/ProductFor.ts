import mongoose from 'mongoose';
import { IProductFor } from '../types';

const Schema = mongoose.Schema;

const ProductForSchema = new Schema<IProductFor>({
  categoryID: {
    type: String,
    required: true,
  },
  categoryForID: {
    type: [String],
    default: [],
  },
});

const ProductFor = mongoose.model('ProductFor', ProductForSchema);
export default ProductFor;
