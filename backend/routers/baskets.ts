import express from 'express';
import Basket from '../models/Basket';
import mongoose from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import Product from '../models/Product';

const basketRouter = express.Router();

basketRouter.post('/', async (req, res, next) => {
  try {
    const sessionKeyBasket = req.body.sessionKey;

    if (sessionKeyBasket) {
      const basket = await Basket.findOne({ session_key: sessionKeyBasket }).populate('items.product');
      if (basket) {
        return res.send(basket);
      } else {
        const newBasket = new Basket({
          session_key: sessionKeyBasket,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await newBasket.save();
        return res.send(newBasket);
      }
    } else {
      return res.send({ message: 'SessionKey not found' });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

basketRouter.post('/user', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    if (user) {
      const basketUser = await Basket.findOne({ user_id: user });
      if (basketUser) {
        return res.send(basketUser);
      } else {
        const newBasket = new Basket({
          user_id: user._id,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await newBasket.save();
        return res.send(newBasket);
      }
    } else {
      return res.send({ message: 'User & sessionKey not found' });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

basketRouter.get('/', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    if (user) {
      const basket = await Basket.findOne({ user_id: user._id });

      if (basket) {
        const products = await Product.find({ goodID: { $in: basket.items.map((item) => item.product) } });

        const basketToFront = {
          user_id: basket.user_id,
          // session_key: basket.session_key,
          created_at: basket.created_at,
          updated_at: basket.updated_at,
          items: basket.items.map((item) => {
            const productInfo = products.find((product) => product.goodID === item.product);
            return {
              product: productInfo, // Здесь будет полная информация о товаре
              quantity: item.quantity,
            };
          }),
          totalPrice: basket.totalPrice,
        };

        return res.send(basketToFront);
      } else {
        return res.send({ message: 'User basket not found' });
      }
    } else {
      return res.send({ message: 'User not found' });
    }
  } catch (e) {
    return next(e);
  }
});

basketRouter.get('/:sessionKey', async (req, res, next) => {
  try {
    const sessionKeyBasket = req.params.sessionKey;

    if (sessionKeyBasket) {
      const basket = await Basket.findOne({ session_key: sessionKeyBasket });

      if (basket) {
        const products = await Product.find({ goodID: { $in: basket.items.map((item) => item.product) } });

        const basketToFront = {
          _id: basket._id,
          // user_id: basket.user_id,
          session_key: basket.session_key,
          created_at: basket.created_at,
          updated_at: basket.updated_at,
          items: basket.items.map((item) => {
            const productInfo = products.find((product) => product.goodID === item.product);
            return {
              product: productInfo, // Здесь будет полная информация о товаре
              quantity: item.quantity,
            };
          }),
          totalPrice: basket.totalPrice,
        };

        return res.send(basketToFront);
      } else {
        return res.send({ message: 'Session Key not found' });
      }
    }
  } catch (e) {
    return next(e);
  }
});

basketRouter.patch('/', auth, async (req, res, next) => {
  try {
    const { product_id, action } = req.body;
    const user = (req as RequestWithUser).user;
    // Если идентификатор товара и действие равны 'clear', просто очистите корзину
    if (action === 'clear' && product_id === 'clear') {
      const basket = await Basket.findOne({ user_id: user._id });

      if (!basket) {
        return res.status(400).send({ message: 'Basket not found' });
      }

      basket.items = []; // Очищаем корзину
      basket.totalPrice = 0; // Сбрасываем общую стоимость

      await basket.save();

      return res.send({
        message: { en: 'Basket successfully cleared', ru: 'Корзина успешно очищена' },
        total: basket.totalPrice,
      });
    }
    // Если идентификатор товара или действие отсутствуют, возвращаем ошибку
    if (!product_id || !action) {
      return res.status(400).send({ message: 'Product ID and action are required' });
    }

    // Найдите корзину по ключу сессии
    const basket = await Basket.findOne({ user_id: user._id });

    // Если корзина не существует, создайте новую
    if (!basket) {
      const newBasket = new Basket({
        user_id: user._id,
        items: [{ product: product_id, quantity: 1 }],
      });

      // Сохраните новую корзину
      await newBasket.save();

      return res.send({
        message: { en: 'Product successfully added to cart', ru: 'Товар успешно добавлен в корзину' },
        total: newBasket.totalPrice,
      });
    }

    // Проверьте, есть ли товар с таким ID в корзине
    const existingItem = basket.items.find((item) => item.product.toString() === product_id.toString());

    if (!existingItem) {
      // Если товара нет в корзине, добавьте новый элемент
      basket.items.push({
        product: product_id,
        quantity: 1,
      });
    } else {
      // В зависимости от значения action выполните соответствующее действие
      switch (action) {
        case 'increase':
          existingItem.quantity += 1;
          break;
        case 'decrease':
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          }
          // Не удалять товар, если количество равно 1
          break;
        case 'remove':
          // Удалите товар из корзины
          basket.items = basket.items.filter((item) => item.product.toString() !== product_id.toString());
          break;
        default:
          return res.status(400).send({ message: 'Invalid action' });
      }
    }

    // Пересчитайте общую стоимость корзины
    basket.totalPrice = await calculateTotalPrice(basket.items);

    // Сохраните изменения
    await basket.save();

    return res.send({
      message: { en: 'Product successfully updated in cart', ru: 'Товар успешно обновлен в корзине' },
      total: basket.totalPrice,
    });
  } catch (error) {
    return next(error);
  }
});

basketRouter.patch('/:sessionKey', async (req, res, next) => {
  try {
    const { sessionKey } = req.params;
    const { product_id, action } = req.body;

    // Если идентификатор товара и действие равны 'clear', просто очистите корзину
    if (action === 'clear' && product_id === 'clear') {
      const basket = await Basket.findOne({ session_key: sessionKey });

      if (!basket) {
        return res.status(400).send({ message: 'Basket not found' });
      }

      basket.items = []; // Очищаем корзину
      basket.totalPrice = 0; // Сбрасываем общую стоимость

      await basket.save();

      return res.send({
        message: { en: 'Basket successfully cleared', ru: 'Корзина успешно очищена' },
        total: basket.totalPrice,
      });
    }

    // Если идентификатор товара или действие отсутствуют, возвращаем ошибку
    if (!product_id || !action) {
      return res.status(400).send({ message: 'Product ID and action are required' });
    }

    // Найдите корзину по ключу сессии
    const basket = await Basket.findOne({ session_key: sessionKey });

    // Если корзина не существует, создайте новую
    if (!basket) {
      const newBasket = new Basket({
        session_key: sessionKey,
        items: [{ product: product_id, quantity: 1 }],
      });

      // Сохраните новую корзину
      await newBasket.save();

      return res.send({
        message: { en: 'Product successfully added to cart', ru: 'Товар успешно добавлен в корзину' },
        total: newBasket.totalPrice,
      });
    }

    // Проверьте, есть ли товар с таким ID в корзине
    const existingItem = basket.items.find((item) => item.product.toString() === product_id.toString());

    if (!existingItem) {
      // Если товара нет в корзине, добавьте новый элемент
      basket.items.push({
        product: product_id,
        quantity: 1,
      });
    } else {
      // В зависимости от значения action выполните соответствующее действие
      switch (action) {
        case 'increase':
          existingItem.quantity += 1;
          break;
        case 'decrease':
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          }
          // Не удалять товар, если количество равно 1
          break;
        case 'remove':
          // Удалите товар из корзины
          basket.items = basket.items.filter((item) => item.product.toString() !== product_id.toString());
          break;
        default:
          return res.status(400).send({ message: 'Invalid action' });
      }
    }

    // Пересчитайте общую стоимость корзины
    basket.totalPrice = await calculateTotalPrice(basket.items);

    // Сохраните изменения
    await basket.save();

    return res.send({
      message: { en: 'Product successfully updated in cart', ru: 'Товар успешно обновлен в корзине' },
      total: basket.totalPrice,
    });
  } catch (error) {
    return next(error);
  }
});

export const calculateTotalPrice = async (items: { product: string; quantity: number }[]) => {
  let total = 0;

  for (const item of items) {
    const product = await Product.findOne({ goodID: item.product });

    if (product) {
      total += product.price * item.quantity;
    }
  }

  // Ограничение до двух знаков после запятой и преобразование в число
  return parseFloat(total.toFixed(2));
};
export default basketRouter;
