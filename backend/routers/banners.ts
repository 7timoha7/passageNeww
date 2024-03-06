import express from 'express';
import Banner from '../models/Banner';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import { bannersImagesUpload } from '../multer';
import path from 'path';
import config from '../config';
import * as fs from 'fs';

const bannersRouter = express.Router();

bannersRouter.post('/', auth, permit('admin'), bannersImagesUpload.single('image'), async (req, res, next) => {
  try {
    const { title, desk } = req.body;
    const imagePath = req.file ? `/images/banners/${req.file.filename}` : '';

    const newBanner = new Banner({
      title,
      desk,
      image: imagePath,
    });

    await newBanner.save();

    return res.send({
      message: {
        en: 'Banner successfully created!',
        ru: 'Баннер успешно создан!',
      },
    });
  } catch (error) {
    return next(error);
  }
});

bannersRouter.get('/', async (_req, res, next) => {
  try {
    const banners = await Banner.find();
    res.send(banners);
  } catch (error) {
    next(error);
  }
});

// DELETE запрос для удаления баннера
bannersRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).send({
        message: {
          en: 'Banner not found!',
          ru: 'Баннер не найден!',
        },
      });
    }

    // Удаляем связанный файл изображения
    const imagePath = path.join(config.publicPath, banner.image);
    fs.unlinkSync(imagePath);

    // Удаляем баннер из базы данных
    await banner.deleteOne();

    return res.send({
      message: {
        en: 'Banner successfully removed!',
        ru: 'Баннер успешно удален!',
      },
    });
  } catch (error) {
    next(error);
  }
});
export default bannersRouter;
