import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import Bestseller from '../models/Bestseller';
import Product from '../models/Product';

const bestsellerRouter = express.Router();

bestsellerRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const addedBestseller = await Bestseller.findOne({ bestseller_id: req.body.bestseller_id });

    if (addedBestseller) {
      return res.send({
        message: {
          en: 'This product has already been added to bestsellers!',
          ru: 'Данный товар уже добавлен в хиты продаж!',
        },
      });
    } else {
      const newBestseller = new Bestseller({
        bestseller_id: req.body.bestseller_id,
      });
      await newBestseller.save();
      return res.send({
        message: {
          en: 'The product has been successfully added to bestsellers!',
          ru: 'Товар успешно добавлен в хиты продаж!',
        },
      });
    }
  } catch (error) {
    return next(error);
  }
});

bestsellerRouter.get('/', async (req, res, next) => {
  try {
    // Найти все бестселлеры
    const bestsellers = await Bestseller.find();

    // Извлечь goodID из бестселлеров
    const goodIDs = bestsellers.map((bestseller) => bestseller.bestseller_id);

    // Найти все продукты, у которых goodID есть в списке
    const products = await Product.find({ goodID: { $in: goodIDs } });

    return res.send(products);
  } catch (e) {
    return next(e);
  }
});

bestsellerRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const result = await Bestseller.deleteOne({ bestseller_id: req.params.id });

    if (result.deletedCount === 0) {
      return res.send({
        message: {
          en: 'Product not found!',
          ru: 'Товар не найден!',
        },
      });
    }

    return res.send({
      message: {
        en: 'The product has been successfully removed from bestsellers!',
        ru: 'Товар успешно удален из хиты продаж!',
      },
    });
  } catch (e) {
    return next(e);
  }
});

export default bestsellerRouter;
