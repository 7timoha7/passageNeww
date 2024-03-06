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
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ETIMEDOUT') {
                console.error('Превышен таймаут при выполнении запроса:', error);
            } else {
                console.error('Ошибка при выполнении запроса:', error.message, error.response?.data);
            }
        } else {
            console.error('Не удалось выполнить запрос:', error);
        }
        throw error;
    }
};

// Функция для обработки строки description и извлечения размера, толщины и описания
const processDescription = (description: string): { size: string; thickness: string; description: string } => {
    const parts = description.split('\\\\').map((part) => part.trim());

    if (parts.length > 1) {
        return {
            size: parts[0] || '', // Если size не указан, установите пустую строку
            thickness: parts[1] || '', // Если thickness не указан, установите пустую строку
            description: parts.slice(2).join('\\\\') || '', // Используем оставшуюся часть как description
        };
    } else {
        return {
            size: '', // Разделители отсутствуют, size пуст
            thickness: '', // Разделители отсутствуют, thickness пуст
            description: parts[0] || '', // Используем весь текст как description
        };
    }
};

// Функция для расчета площади на основе размера
const calculateArea = (size: string): number => {
    const [width, height] = size.split('*').map(Number);
    return (width * height) / 1000000; // Переводим из мм² в м²
};

// Функция для пересчета цены на квадратный метр
const calculatePricePerSquareMeter = (price: number, area: number): number => {
    return price * area; // Исправим на умножение
};

// const saveProductsToFile = (
//   products: { [x: string]: any; imageBase64: any; imagesBase64: any }[],
//   filePath: fs.PathOrFileDescriptor,
// ) => {
//   // Создаем массив данных для сохранения в файл, исключая ключи imageBase64 и imagesBase64
//   const dataToSave = products.map(({ imageBase64, imagesBase64, ...rest }) => rest);
//
//   // Преобразуем данные в формат JSON
//   const jsonData = JSON.stringify(dataToSave, null, 2);
//
//   // Сохраняем данные в файл
//   fs.writeFileSync(filePath, jsonData);
//
//   console.log(`Данные сохранены в файл: ${filePath}`);
// };

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

            // Проверка, что есть хотя бы один элемент в массиве и все элементы имеют положительное количество
            if (quantityDataArray.length === 0 || !quantityDataArray.every((q) => q.quantity > 0) || !productData.article) {
                // Пропускаем продукты с нулевым количеством, отрицательным количеством или без артикула
                continue;
            }

            const priceData = prices.find((p) => p.goodID === productData.goodID);
            if (!priceData || !priceData.price) {
                // Пропускаем продукты без цены
                continue;
            }

            const imageFolder = path.join(process.cwd(), 'public/images/imagesProduct', productData.goodID);

            // Создаем папку только если у товара есть изображение
            if ((productData.imageBase64 || productData.imagesBase64.length > 0) && !fs.existsSync(imageFolder)) {
                fs.mkdirSync(imageFolder, {recursive: true});
            }

            const productImages = [];

            // Обработаем изображения из imageBase64
            if (productData.imageBase64) {
                const mainImageName = 'image_main.jpg';
                const mainImagePath = path.join(imageFolder, mainImageName);

                fs.writeFileSync(mainImagePath, productData.imageBase64, 'base64');
                productImages.push(path.join('/images/imagesProduct', productData.goodID, mainImageName));
            }

            // Обработаем изображения из imagesBase64
            if (productData.imagesBase64 && productData.imagesBase64.length > 0) {
                productData.imagesBase64.forEach((imageBase64, index) => {
                    const imageName = `image${index + 1}.jpg`;
                    const imagePath = path.join(imageFolder, imageName);

                    fs.writeFileSync(imagePath, imageBase64, 'base64');
                    productImages.push(path.join('/images/imagesProduct', productData.goodID, imageName));
                });
            }

            const {size, thickness, description} = processDescription(productData.description);

            // Новая переменная для хранения пересчитанной цены
            let recalculatedPrice = priceData.price;

            if (
                productData.measureName &&
                (productData.measureName.toLowerCase() === 'м2' || productData.measureName.toLowerCase() === 'm2') &&
                size
            ) {
                // Если единица измерения - "м2" и размер присутствует, то производим расчет новой цены
                const area = calculateArea(size); // Функция для расчета площади
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
                        name: stock ? stock.name : '', // Записываем название склада, если найдено, иначе пустая строка
                        stockID: quantityData.stockID,
                        quantity: quantityData.quantity,
                    };
                }),
                price: recalculatedPrice, // Используем пересчитанную цену
                images: productImages,
                size,
                thickness,
                description,
                originCountry: productData.originCountry,
            });

            await product.save();
            updatedProducts.push(product);
        }

        // Обновляем все продукты одним запросом к базе данных
        await Product.bulkWrite(
            updatedProducts.map((product) => ({
                updateOne: {
                    filter: {_id: product._id},
                    update: {$set: {images: product.images}},
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
        // Шаг 1: Создаем категории, в которых есть товары
        for (const categoryData of categoriesData) {
            const productsForCategory = await Product.find({ownerID: categoryData.ID});
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

        // Шаг 2: Создаем вышестоящие категории
        for (const categoryData of categoriesData) {
            // Находим родительскую категорию
            const ownerCategory = categoriesData.find((item) => item.ID === categoryData.ownerID);

            // Проверяем, есть ли такая родительская категория и создана ли она
            if (ownerCategory && !(await Category.exists({ID: ownerCategory.ID}))) {
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

    // Удаление папки и её содержимого
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
                    // Рекурсивно удалить подпапки
                    deleteFolderRecursive(curPath);
                } else {
                    // Удалить файл
                    fs.unlinkSync(curPath);
                }
            });
            // Удалить саму папку
            fs.rmdirSync(folderPath);
        }
    }
};

productFromApiRouter.get('/', async (req, res, next) => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        console.log('loading...');
        await deleteFolderImagerProduct();
        await db.dropCollection('categories');
        await db.dropCollection('products');
        console.log('Delete collection');

        // const responseProducts = await fetchData('goods-get');
        // const responseQuantity = await fetchData('goods-quantity-get');
        // const responsePrice = await fetchData('goods-price-get');
        //
        // const products: IProductFromApi[] = responseProducts.result.goods;
        //
        // const quantity = responseQuantity.result;
        // const quantityGoods: IProductQuantityFromApi[] = quantity.goods;
        // const quantityStocks: IProductQuantityStocksFromApi[] = quantity.stocks;
        //
        // const price: IProductPriceFromApi[] = responsePrice.result.goods;
        //
        // const categories: ICategoryFromApi[] = responseProducts.result.goodsGroups;
        //
        // await createProducts(products, price, quantityGoods, quantityStocks);
        // await createCategories(categories);


        const filePathProducts = 'productsData.json';
        const filePathQuantity = 'quantityData.json';
        const filePathPrice = 'priceData.json';

        const productsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'info', filePathProducts), 'utf-8'));
        const quantityData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'info', filePathQuantity), 'utf-8'));
        const priceData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'info', filePathPrice), 'utf-8'));

        const products: IProductFromApi[] = productsData.result.goods; // Используем данные из файла
        const quantityGoods: IProductQuantityFromApi[] = quantityData.result.goods; // Используем данные из файла
        const quantityStocks: IProductQuantityStocksFromApi[] = quantityData.result.stocks; // Используем данные из файла
        const price: IProductPriceFromApi[] = priceData.result.goods; // Используем данные из файла

        const categories: ICategoryFromApi[] = productsData.result.goodsGroups; // Используем данные из файла

        await createProducts(products, price, quantityGoods, quantityStocks);
        await createCategories(categories);

        console.log('loadingTRUE ! ! ! ');

        return res.send({
            message: {
                en: 'Updating the database from "1C" was successful!',
                ru: 'Обновление базы данных с "1С" - прошло успешно !',
            },
        });
    } catch (e) {
        return next(e);
    }
});

export default productFromApiRouter;
