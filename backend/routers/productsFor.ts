import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import ProductFor from '../models/ProductFor';
import Product from '../models/Product';
import Category from '../models/Category';

const productsForRouter = express.Router();

productsForRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const { categoryID, categoryForID } = req.body;

    const productsFo = await ProductFor.findOne({ categoryID: categoryID });

    if (productsFo) {
      return res.status(404).json({
        message: {
          ru: 'Уже существует!',
        },
      });
    }

    // Создаем новый объект сопутствующего товара
    const newProductFor = new ProductFor({
      categoryID,
      categoryForID,
    });

    // Сохраняем объект в базе данных
    await newProductFor.save();

    return res.status(201).send({
      message: {
        en: 'Related products have been successfully created!',
        ru: 'Сопутствующие товары успешно созданы!',
      },
    });
  } catch (error) {
    return next(error);
  }
});

productsForRouter.get('/:categoryID', auth, async (req, res, next) => {
  try {
    const { categoryID } = req.params;
    // Находим соответствующую запись в ProductFor по categoryID
    const productFor = await ProductFor.findOne({ categoryID });
    // const categoryName = await Category.findOne({ ID: categoryID });

    if (!productFor) {
      return res.send(null);
    }

    const { categoryForID } = productFor;
    const randomProducts = [];

    // Для каждого ownerID в categoryForID находим случайный продукт
    for (const ownerID of categoryForID) {
      // Находим все продукты с текущим ownerID
      const products = await Product.find({ ownerID });

      // Если есть продукты, добавляем случайный продукт в массив
      if (products.length > 0) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        randomProducts.push(randomProduct);
      }
    }

    // Находим информацию о категории по categoryID
    const category = await Category.findOne({ ID: categoryID });

    // Возвращаем результат, включая информацию о категории
    return res.json({
      // _id: productFor._id,
      // category: category ? category : [],
      // products: randomProducts,

      _id: productFor._id,
      categoryID: category,
      categoryForID: randomProducts,
    });
  } catch (error) {
    return next(error);
  }
});

productsForRouter.get('/', auth, async (_req, res, next) => {
  try {
    const allProductsFor = await ProductFor.find();
    if (!allProductsFor.length) {
      return res.send(null);
    }

    const productsForCategories = await Promise.all(
      allProductsFor.map(async (productsFor) => {
        const fullCategoryInfo = await Category.findOne({ ID: productsFor.categoryID });

        const fullRelatedCategoriesInfo = await Promise.all(
          productsFor.categoryForID.map(async (relatedCategoryID) => {
            return Category.findOne({ ID: relatedCategoryID });
          }),
        );

        return {
          _id: productsFor._id,
          categoryID: fullCategoryInfo,
          categoryForID: fullRelatedCategoriesInfo,
        };
      }),
    );

    const jsonString = JSON.stringify(productsForCategories);
    return res.send(jsonString);
  } catch (error) {
    return next(error);
  }
});

productsForRouter.get('/one/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productsFor = await ProductFor.findOne({ categoryID: id });

    if (!productsFor) {
      return res.status(404).json({
        message: {
          en: 'No related products found',
          ru: 'Сопутствующие товары не найдены',
        },
      });
    }

    // Получаем полную информацию о категории, включая другие поля
    const fullCategoryInfo = await Category.findOne({ ID: productsFor.categoryID });

    // Получаем полную информацию о сопутствующих категориях
    const fullRelatedCategoriesInfo = await Promise.all(
      productsFor.categoryForID.map(async (relatedCategoryID) => {
        return Category.findOne({ ID: relatedCategoryID });
      }),
    );

    const productForCategories = {
      _id: productsFor._id,
      categoryID: fullCategoryInfo,
      categoryForID: fullRelatedCategoriesInfo,
    };
    // Возвращаем информацию о категории
    return res.send(productForCategories);
  } catch (error) {
    return next(error);
  }
});

// DELETE запрос для удаления записи о сопутствующих товарах
productsForRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли запись с указанным ID
    const productFor = await ProductFor.findById(id);

    if (!productFor) {
      return res.status(404).json({
        message: {
          en: 'ProductFor not found',
          ru: 'Сопутствующие товары не найдены',
        },
      });
    }

    // Удаляем запись о сопутствующих товарах
    await ProductFor.deleteOne({ _id: id });

    return res.json({
      message: {
        en: 'ProductFor deleted successfully',
        ru: 'Сопутствующие товары успешно удалены',
      },
    });
  } catch (error) {
    return next(error);
  }
});

// PATCH запрос для обновления записи о сопутствующих товарах по categoryID
productsForRouter.patch('/:categoryID', auth, permit('admin'), async (req, res, next) => {
  try {
    const { categoryID } = req.params;
    const { categoryForID } = req.body;

    // Проверяем, существует ли запись с указанным categoryID
    const productFor = await ProductFor.findOne({ categoryID });

    if (!productFor) {
      return res.status(404).json({
        message: {
          en: 'ProductFor not found',
          ru: 'Сопутствующие товары не найдены',
        },
      });
    }

    // Обновляем часть записи о сопутствующих товарах
    await ProductFor.updateOne({ categoryID }, { $set: { categoryForID } });

    return res.json({
      message: {
        en: 'ProductFor updated successfully',
        ru: 'Сопутствующие товары успешно обновлены',
      },
    });
  } catch (error) {
    return next(error);
  }
});
export default productsForRouter;
