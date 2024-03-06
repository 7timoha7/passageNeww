import mongoose from 'mongoose';
import { IBestseller } from '../types';

const Schema = mongoose.Schema;

const BestsellerSchema = new Schema<IBestseller>({
  bestseller_id: {
    type: String,
    required: true,
  },
});

const Bestseller = mongoose.model('Bestseller', BestsellerSchema);
export default Bestseller;
