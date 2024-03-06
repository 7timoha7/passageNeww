import mongoose, { Types } from 'mongoose';
import { IChatIdAdmin } from '../types';
import User from './User';

const Schema = mongoose.Schema;

const ChatIdAdminSchema = new Schema<IChatIdAdmin>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'User not found!',
    },
  },
  chat_id: {
    type: String,
    required: true,
  },
});

const ChatIdAdmin = mongoose.model('ChatIdAdmin', ChatIdAdminSchema);
export default ChatIdAdmin;
