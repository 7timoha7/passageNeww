import express from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { promises as fs } from 'fs';

const productRouter = express.Router();

productRouter.post('/', async (req, res, next) => {
  try {
    const product = new Product({
      categoryId: req.body.categoryId,
      name: req.body.name,
      desc: req.body.desc,
      unit: req.body.unit,
      vendorCode: parseInt(req.body.vendorCode),
      group: req.body.group,
      cod: req.body.cod,
      dimensions: req.body.dimensions,
      weight: req.body.weight,
      image: req.files ? (req.files as Express.Multer.File[]).map((file) => file.filename) : null,
      price: parseFloat(req.body.price),
    });

    await product.save();
    return res.send({ message: 'Product created successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

productRouter.get('/', async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = 20;

    let query = {};

    if (req.query.category) {
      query = { ownerID: req.query.category };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await Product.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.send({
      products,
      pageInfo: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalProducts,
      },
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

productRouter.get('/news', async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = 20;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await Product.find()
      .sort({ article: -1 }) // Сортируем по убыванию значения поля article
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.send({
      products,
      pageInfo: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalProducts,
      },
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

productRouter.get('/:id', async (req, res, next) => {
  try {
    const productRes = await Product.findById(req.params.id);
    return res.send(productRes);
  } catch (e) {
    return next(e);
  }
});

productRouter.get('/get/favorites', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const favoriteProductsId = user.favorites;

    // Добавляем пагинацию
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const products = await Product.find({ goodID: { $in: favoriteProductsId } })
      .skip(skip)
      .limit(pageSize);

    if (!products || products.length === 0) {
      return res.send({ message: 'You do not have favorite Products' });
    }

    // Добавляем информацию о пагинации в ответ
    const totalProducts = await Product.countDocuments({ goodID: { $in: favoriteProductsId } });
    const totalPages = Math.ceil(totalProducts / pageSize);

    return res.json({
      products,
      pageInfo: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalProducts,
      },
    });
  } catch (e) {
    return next(e);
  }
});

// productRouter.patch('/:id', auth, permit('admin', 'director'), imagesUpload.array('images'), async (req, res, next) => {
//   try {
//     const product: HydratedDocument<IProduct> | null = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).send({ message: 'Not found product!' });
//     }
//
//     product.name = req.body.name;
//     product.article = req.body.article;
//     product.goodID = req.body.goodID;
//     product.measureCode = req.body.measureCode;
//     product.measureName = req.body.measureName;
//     product.ownerID = req.body.ownerID;
//     product.quantity = JSON.parse(req.body.quantity);
//     product.price = JSON.parse(req.body.price);
//
//     if (req.files) {
//       if (product.images) {
//         const uploadedImages = (req.files as Express.Multer.File[]).map((file) => file.filename);
//         product.images.push(...uploadedImages);
//       } else {
//         product.images = (req.files as Express.Multer.File[]).map((file) => file.filename);
//       }
//     }
//
//     await Product.findByIdAndUpdate(req.params.id, {
//       name: product.name,
//       article: product.article,
//       goodID: product.goodID,
//       measureCode: product.measureCode,
//       measureName: product.measureName,
//       ownerID: product.ownerID,
//       quantity: product.quantity,
//       price: product.price,
//       images: product.images,
//     });
//
//     return res.send({
//       message: {
//         en: 'Product updated successfully',
//         ru: 'Продукт успешно изменен',
//       },
//     });
//   } catch (error) {
//     if (error instanceof mongoose.Error.ValidationError) {
//       return res.status(400).send(error);
//     }
//     return next(error);
//   }
// });

productRouter.delete('/:id/images/:index', auth, permit('admin', 'director'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ message: 'Not found product!' });
    }

    if (user.role === 'admin' || user.role === 'director') {
      const index = parseInt(req.params.index);
      if (product.images && index >= 0 && index < product.images.length) {
        const deletingImage = product.images[index];
        product.images.splice(index, 1);
        await product.save();
        await fs.unlink('public/' + deletingImage);
        res.send({
          message: {
            en: 'Image deleted successfully',
            ru: 'картинка успешно удалена',
          },
        });
      } else {
        return res.status(404).send({ message: 'Not found image!' });
      }
    } else {
      return res.status(403).send({ message: 'You do not have permission!' });
    }
  } catch (e) {
    return next(e);
  }
});

productRouter.get('/search/get', async (req, res, next) => {
  try {
    const searchTerm: string = req.query.text as string;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = 20;
    if (searchTerm.length < 3) {
      return res.status(400).send('Search term should be at least 3 characters long');
    }
    const regex = new RegExp(searchTerm, 'i');
    const skip = (page - 1) * pageSize;
    const products = await Product.find({ name: { $regex: regex } })
      .skip(skip)
      .limit(pageSize);
    const totalProducts = await Product.countDocuments({ name: { $regex: regex } });
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.send({
      products,
      pageInfo: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalProducts,
      },
    });
  } catch (e) {
    return next(e);
  }
});

productRouter.get('/search/preview', async (req, res, next) => {
  try {
    const searchTerm: string = req.query.text as string;
    if (searchTerm.length < 3) {
      return res.status(400).send('Search term should be at least 3 characters long');
    }
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      $or: [{ name: { $regex: regex } }, { article: { $regex: regex } }],
    }).limit(20);
    const hasMore = products.length === 20;
    res.send({
      results: products,
      hasMore,
    });
  } catch (e) {
    return next(e);
  }
});

export default productRouter;
