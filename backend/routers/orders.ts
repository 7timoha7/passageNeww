import express from 'express';
import mongoose, { HydratedDocument } from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import Order from '../models/Order';
import { calculateTotalPrice } from './baskets';
import axios from 'axios';
import permit from '../middleware/permit';
import { IOrder } from '../types';
import User from '../models/User';
import Product from '../models/Product';
import ChatIdAdmin from '../models/ChatIdAdmin';

const ordersRouter = express.Router();

ordersRouter.post('/', async (req, res, next) => {
  try {
    const order = new Order({
      createdAt: new Date().toISOString(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      email: req.body.email,
      paymentMethod: req.body.paymentMethod,
      deliveryMethod: req.body.deliveryMethod,
      orderComment: req.body.orderComment,
      products: req.body.products,
    });

    order.totalPrice = await calculateTotalPrice(order.products);
    await order.save();

    const message = `Новый - Заказ №: ${order.orderArt.toUpperCase()} Ожидает обработки!`;

    //Этот код выбирает все объекты ChatIdAdmin, проецирует только поле chat_id
    const chatIds = await ChatIdAdmin.find({}, { _id: 0 });
    const chatIdNumbers: string[] = Array.from(chatIds, (chatIdAdmin) => chatIdAdmin.chat_id);

    if (chatIdNumbers.length) {
      await sendMessageToTelegram(message, chatIdNumbers);
    }

    return res.send({
      message: {
        en: 'OrderForm created successfully',
        ru: 'Заказ успешно создан',
      },
    });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

ordersRouter.post('/user', auth, async (req, res, next) => {
  const user = (req as RequestWithUser).user;

  try {
    if (user) {
      const order = new Order({
        user_id: user._id,
        createdAt: new Date().toISOString(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        email: req.body.email,
        paymentMethod: req.body.paymentMethod,
        deliveryMethod: req.body.deliveryMethod,
        orderComment: req.body.orderComment,
        products: req.body.products,
      });

      order.totalPrice = await calculateTotalPrice(order.products);
      await order.save();

      const message = `Новый - Заказ №: ${order.orderArt.toUpperCase()} Ожидает обработки!`;

      //Этот код выбирает все объекты ChatIdAdmin, проецирует только поле chat_id
      const chatIds = await ChatIdAdmin.find({}, { _id: 0 });
      const chatIdNumbers: string[] = Array.from(chatIds, (chatIdAdmin) => chatIdAdmin.chat_id);

      if (chatIdNumbers.length) {
        await sendMessageToTelegram(message, chatIdNumbers);
      }

      return res.send({
        message: {
          en: 'OrderForm created successfully',
          ru: 'Заказ успешно создан',
        },
      });
    } else {
      return res.send({ message: 'User & sessionKey not found' });
    }
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

ordersRouter.get('/', auth, async (req, res, next) => {
  const user = (req as RequestWithUser).user;

  try {
    let query = {};

    switch (user.role) {
      case 'admin':
        query = {
          admin_id: req.query.admin,
          ...(req.query.admin ? {} : { status: 'open', admin_id: undefined }),
        };
        break;
      case 'director':
        query = {
          admin_id: req.query.admin,
          ...(req.query.admin ? { status: 'closed' } : { status: 'closed' }),
        };
        break;
      case 'user':
        query = { user_id: user.id };
        break;
      default:
        return res.status(403).send('Unauthorized');
    }

    // Добавляем пагинацию
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 }) // Сортировка по убыванию даты создания (от новых к старым)
      .skip(skip)
      .limit(pageSize)
      .populate('user_id', '-token')
      .populate('admin_id', '-token')
      .exec();

    if (!orders || orders.length === 0) {
      return res.send({ message: 'No orders found' });
    }

    // Добавляем информацию о пагинации в ответ
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / pageSize);

    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const productsWithDetails = await Promise.all(
          order.products.map(async (productData) => {
            const product = await Product.findOne({ goodID: productData.product }).exec();
            return {
              product: product,
              quantity: productData.quantity,
            };
          }),
        );

        return {
          _id: order._id,
          orderArt: order.orderArt,
          user_id: order.user_id,
          admin_id: order.admin_id,
          createdAt: order.createdAt,
          status: order.status,
          totalPrice: order.totalPrice,
          firstName: order.firstName,
          lastName: order.lastName,
          phoneNumber: order.phoneNumber,
          address: order.address,
          email: order.email,
          paymentMethod: order.paymentMethod,
          deliveryMethod: order.deliveryMethod,
          orderComment: order.orderComment,
          products: productsWithDetails,
        };
      }),
    );

    return res.send({
      orders: formattedOrders,
      pageInfo: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalOrders,
      },
    });
  } catch (e) {
    return next(e);
  }
});

ordersRouter.patch('/:id', auth, permit('admin'), async (req, res, next) => {
  const user = (req as RequestWithUser).user;

  try {
    // Находим заказ по ID
    const order: HydratedDocument<IOrder> | null = await Order.findOne({ _id: req.params.id });

    if (!order) {
      return res.status(404).send({ message: { en: 'cant find order', ru: 'заказ не найден' } });
    }

    // Проверяем, есть ли админ в ордере
    if (order.admin_id && req.body.status === 'in progress') {
      const claimingAdmin = await User.findById(order.admin_id);
      if (!claimingAdmin) {
        return res.status(500).send({
          message: {
            en: 'Error retrieving claiming admin information',
            ru: 'Ошибка при получении информации о забирающем админе',
          },
        });
      }

      return res.send({
        message: {
          en: `Order already claimed by admin: ${claimingAdmin.firstName} ${claimingAdmin.lastName}`,
          ru: `Заказ уже взят администратором: ${claimingAdmin.firstName} ${claimingAdmin.lastName}`,
        },
      });
    }

    // Продолжаем обновление заказа
    const updatedFields = { ...req.body };
    updatedFields.admin_id = user._id;

    const updatedOrder: HydratedDocument<IOrder> | null = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updatedFields },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).send({ message: { en: 'cant find order', ru: 'заказ не найден' } });
    }

    if (req.body.status === 'closed') {
      const orderOwner = await User.findById(order.user_id);
      if (!orderOwner) {
        return res.status(403).send({
          message: {
            en: 'Cant find order owner',
            ru: 'Владельца заказа нет в системе',
          },
        });
      }
    }

    let message = '';

    if (req.body.status === 'in progress') {
      message = `Оформление - Заказ №: ${updatedOrder.orderArt.toUpperCase()} , забрал(а) ${user.firstName} ${
        user.lastName
      } для оформления`;
    } else if (req.body.status === 'closed') {
      message = `Закрыт - Заказ №: ${updatedOrder.orderArt.toUpperCase()} , оформлен и закрыт. администратором - ${
        user.firstName
      } ${user.lastName}`;
    } else if (req.body.status === 'canceled') {
      message = `Отменен - Заказ №: ${updatedOrder.orderArt.toUpperCase()} , отменен. администратором - ${
        user.firstName
      } ${user.lastName}`;
    }

    // Этот код выбирает все объекты ChatIdAdmin, проецирует только поле chat_id
    const chatIds = await ChatIdAdmin.find({}, { _id: 0 });
    const chatIdNumbers: string[] = Array.from(chatIds, (chatIdAdmin) => chatIdAdmin.chat_id);

    if (chatIdNumbers.length) {
      await sendMessageToTelegram(message, chatIdNumbers);
    }

    return res.send({
      message: {
        en: 'OrderForm updated successfully',
        ru: 'Заказ успешно изменен',
      },
    });
  } catch (e) {
    return next(e);
  }
});

ordersRouter.delete('/:id', auth, permit('admin', 'director', 'user'), async (req, res, next) => {
  const user = (req as RequestWithUser).user;
  const order = await Order.findById(req.params.id);
  try {
    if (order) {
      if (!order.user_id) {
        if (user.role === 'admin' || user.role === 'director') {
          await Order.deleteOne({ _id: req.params.id });
          return res.send({
            message: {
              en: 'OrderForm deleted successfully',
              ru: 'Заказ успешно удалён',
            },
          });
        } else {
          return res.send({
            message: {
              en: 'OrderForm deleted successfully',
              ru: 'У заказа есть юзер, удаление запрещено! ',
            },
          });
        }
      }

      if (user.role === 'user') {
        if (order.user_id) {
          if (order.user_id.toString() === user._id.toString()) {
            await Order.deleteOne({ _id: req.params.id, userId: user._id });
            return res.send({
              message: {
                en: 'OrderForm deleted successfully',
                ru: 'Заказ успешно удалён',
              },
            });
          } else {
            return res.send({
              message: {
                en: 'no permission for this action',
                ru: 'нет прав для этого действия',
              },
            });
          }
        }
      }
    } else {
      return res.status(404).send({ message: 'Cant find order' });
    }
  } catch (e) {
    return next(e);
  }
});
export default ordersRouter;

const isChatIdValid = async (chatId: string): Promise<boolean> => {
  const botToken = '6719177853:AAG43TUbzPaH5MtbciFBPse-jhKcvyYw1IQ';

  try {
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getChat`, {
      params: {
        chat_id: chatId,
      },
    });

    // Проверяем, что API Telegram вернуло успешный статус
    return response.data.ok === true;
  } catch (error) {
    // Если возникает ошибка, например, 404 Not Found, то чат не существует
    return false;
  }
};

const sendMessageToTelegram = async (message: string, chatIds: string[]) => {
  const validChatIds = await Promise.all(chatIds.map(isChatIdValid));

  const botToken = '6719177853:AAG43TUbzPaH5MtbciFBPse-jhKcvyYw1IQ';

  try {
    for (let i = 0; i < chatIds.length; i++) {
      if (validChatIds[i]) {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatIds[i],
          text: message,
        });
        console.log(`Message sent to Telegram for chat_id: ${chatIds[i]}`);
      } else {
        console.error(`Invalid or non-existent chat_id: ${chatIds[i]}`);
      }
    }
    console.log('All messages sent successfully.');
  } catch (error) {
    console.error('Error sending messages to Telegram:');
  }
};
