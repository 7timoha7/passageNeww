import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import User from './User';
import { IOrder, IUser } from '../types';
import { randomUUID } from 'crypto';

const generateUniqueNumber = () => {
  const uuid = randomUUID();
  const numericValue = parseInt(uuid.replace(/[^0-9]/g, ''), 10);
  return numericValue.toString().slice(0, 8).replace(/\./g, '');
};

const OrderSchema = new Schema<IOrder>({
  orderArt: {
    type: String,
    default: generateUniqueNumber,
    unique: true,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId || undefined,
    ref: 'User',
    default: undefined,
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'User not found!',
    },
  },
  admin_id: {
    type: Schema.Types.ObjectId || undefined,
    ref: 'User',
    default: null,
    validate: {
      validator: async (value: Types.ObjectId) => {
        if (value === null) {
          return true;
        }
        const user: HydratedDocument<IUser> | null = await User.findById(value);
        return user && user.role === 'admin';
      },
      message: 'cant find admin',
    },
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  status: {
    type: String,
    required: true,
    default: 'open',
    enum: ['open', 'in progress', 'closed', 'canceled'],
  },
  products: {
    type: [
      {
        product: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    default: [],
    required: true,
  },
  orderComment: {
    type: String,
  },
  deliveryMethod: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

OrderSchema.pre<IOrder>('save', async function (next) {
  // Проверка на уникальность
  const existingOrder = await Order.findOne({ orderArt: this.orderArt });
  if (existingOrder) {
    // Если номер уже существует, генерируем новый
    this.orderArt = generateUniqueNumber();
  }
  next();
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
