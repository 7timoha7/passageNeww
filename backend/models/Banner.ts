import mongoose from 'mongoose';
import { IBanner } from '../types';

const Schema = mongoose.Schema;

const BannerSchema = new Schema<IBanner>({
  title: {
    type: String,
    required: true,
  },
  desk: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Banner = mongoose.model('Banner', BannerSchema);
export default Banner;
