import axios from 'axios';
import express from 'express';
import {
  ICategoryFromApi,
  IProductFromApi,
  IProductPriceFromApi,
  IProductQuantityFromApi,
  IProductQuantityStocksFromApi,
} from '../types';
import path from 'path';
import * as fs from 'fs';
import Product from '../models/Product';
import Category from '../models/Category';
import mongoose from 'mongoose';
import config from '../config';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const productFromApiRouter = express.Router();

const fetchData = async (method: string) => {
  const apiUrl = 'https://fresh-test.1c-cloud.kg/a/edoc/hs/ext_api/execute';
  const username = 'AUTH_TOKEN';
  const password = 'jU5gujas';

  try {
    const response = await axios.post(
      apiUrl,
      {
        auth: {
          clientID: '422ba5da-2560-11ee-8135-005056b73475',
        },
        general: {
          method,
          deviceID: '00000001-0001-0001-0001-000000015941',
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')}`,
          configName: 'AUTHORIZATION',
          configVersion: 'Basic Auth',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Ошибка при выполнении запроса:', error);

    if (error.response) {
      console.error('Error details:', error.response.data);
    } else {
      console.error('Error details:', error.message);
    }

    throw error;
  }
};

const processDescription = (description: string): { size: string; thickness: string; description: string } => {
  const parts = description.split('\\\\').map((part) => part.trim());

  if (parts.length > 1) {
    return {
      size: parts[0] || '',
      thickness: parts[1] || '',
      description: parts.slice(2).join('\\\\') || '',
    };
  } else {
    return {
      size: '',
      thickness: '',
      description: parts[0] || '',
    };
  }
};

const calculateArea = (size: string): number => {
  const [width, height] = size.split('*').map(Number);
  return (width * height) / 1000000;
};

const calculatePricePerSquareMeter = (price: number, area: number): number => {
  return price * area;
};

const createProducts = async (
  products: IProductFromApi[],
  prices: IProductPriceFromApi[],
  quantities: IProductQuantityFromApi[],
  quantitiesStocks: IProductQuantityStocksFromApi[],
): Promise<void> => {
  try {
    const updatedProducts = [];

    for (const productData of products) {
      const quantityDataArray = quantities.filter((q) => q.goodID === productData.goodID);

      if (quantityDataArray.length === 0 || !quantityDataArray.every((q) => q.quantity > 0) || !productData.article) {
        continue;
      }

      const priceData = prices.find((p) => p.goodID === productData.goodID);
      if (!priceData || !priceData.price) {
        continue;
      }

      const imageFolder = path.join(process.cwd(), 'public/images/imagesProduct', productData.goodID);

      if ((productData.imageBase64 || productData.imagesBase64.length > 0) && !fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder, { recursive: true });
      }

      const productImages = [];

      if (productData.imageBase64) {
        const mainImageName = 'image_main.jpg';
        const mainImagePath = path.join(imageFolder, mainImageName);

        fs.writeFileSync(mainImagePath, productData.imageBase64, 'base64');
        productImages.push(path.join('/images/imagesProduct', productData.goodID, mainImageName));
      }

      if (productData.imagesBase64 && productData.imagesBase64.length > 0) {
        productData.imagesBase64.forEach((imageBase64, index) => {
          const imageName = `image${index + 1}.jpg`;
          const imagePath = path.join(imageFolder, imageName);

          fs.writeFileSync(imagePath, imageBase64, 'base64');
          productImages.push(path.join('/images/imagesProduct', productData.goodID, imageName));
        });
      }

      const { size, thickness, description } = processDescription(productData.description);

      let recalculatedPrice = priceData.price;

      if (
        productData.measureName &&
        (productData.measureName.toLowerCase() === 'м2' || productData.measureName.toLowerCase() === 'm2') &&
        size
      ) {
        const area = calculateArea(size);
        recalculatedPrice = calculatePricePerSquareMeter(priceData.price, area);
      }

      const product = new Product({
        name: productData.name,
        article: productData.article,
        goodID: productData.goodID,
        measureCode: productData.measureCode,
        measureName: productData.measureName,
        ownerID: productData.ownerID,
        quantity: quantityDataArray.map((quantityData) => {
          const stock = quantitiesStocks.find((qs) => qs.stockID === quantityData.stockID);
          return {
            name: stock ? stock.name : '',
            stockID: quantityData.stockID,
            quantity: quantityData.quantity,
          };
        }),
        price: recalculatedPrice,
        images: productImages,
        size,
        thickness,
        description,
        originCountry: productData.originCountry,
      });

      await product.save();
      updatedProducts.push(product);
    }

    await Product.bulkWrite(
      updatedProducts.map((product) => ({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { images: product.images } },
        },
      })),
    );

    console.log('Товары успешно созданы и обновлены в базе данных.');
  } catch (error) {
    console.error('Ошибка при создании товаров:', error);
  }
};

const createCategories = async (categoriesData: ICategoryFromApi[]): Promise<void> => {
  try {
    for (const categoryData of categoriesData) {
      const productsForCategory = await Product.find({ ownerID: categoryData.ID });
      if (productsForCategory.length > 0) {
        const newCategory = new Category({
          name: categoryData.name,
          ID: categoryData.ID,
          ownerID: categoryData.ownerID,
          productsHave: true,
        });
        await newCategory.save();
      }
    }

    for (const categoryData of categoriesData) {
      const ownerCategory = categoriesData.find((item) => item.ID === categoryData.ownerID);

      if (ownerCategory && !(await Category.exists({ ID: ownerCategory.ID }))) {
        const newCategory = new Category({
          name: ownerCategory.name,
          ID: ownerCategory.ID,
          ownerID: ownerCategory.ownerID,
        });
        await newCategory.save();
      }
    }

    console.log('Все категории успешно созданы в базе данных.');
  } catch (error) {
    console.error('Ошибка при создании категорий:', error);
  }
};

const deleteFolderImagerProduct = async () => {
  const imageFolder = path.join(process.cwd(), 'public/images/imagesProduct');

  if (fs.existsSync(imageFolder)) {
    deleteFolderRecursive(imageFolder);
    console.log('Папка успешно удалена');
  } else {
    console.log('Папка не существует');
  }

  function deleteFolderRecursive(folderPath: string) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }
};

productFromApiRouter.get('/', auth, permit('director'), async (req, res, next) => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    console.log('Загрузка данных...');
    await deleteFolderImagerProduct();
    await db.dropCollection('categories');
    await db.dropCollection('products');
    console.log('Коллекции успешно удалены');

    const responseProducts = await fetchData('goods-get');
    const responseQuantity = await fetchData('goods-quantity-get');
    const responsePrice = await fetchData('goods-price-get');

    const products: IProductFromApi[] = responseProducts.result.goods;
    const quantity = responseQuantity.result;
    const quantityGoods: IProductQuantityFromApi[] = quantity.goods;
    const quantityStocks: IProductQuantityStocksFromApi[] = quantity.stocks;
    const price: IProductPriceFromApi[] = responsePrice.result.goods;
    const categories: ICategoryFromApi[] = responseProducts.result.goodsGroups;

    await createProducts(products, price, quantityGoods, quantityStocks);
    await createCategories(categories);

    console.log('Загрузка завершена успешно!');

    return res.send({
      message: {
        en: 'Updating the database from "1C" was successful!',
        ru: 'Обновление базы данных с "1С" прошло успешно!',
      },
    });
  } catch (e) {
    return next(e);
  } finally {
    await mongoose.disconnect();
    console.log('Отключение от базы данных.');
  }
});

export default productFromApiRouter;
