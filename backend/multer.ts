import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import config from './config';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, { recursive: true });
    cb(null, config.publicPath);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, 'images/' + randomUUID() + extension);
  },
});

export const imagesUpload = multer({ storage: imageStorage });

const bannersImageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const destDir = path.join(config.publicPath, 'images', 'banners');

    // Проверяем существование директории images/banners
    if (
      !(await fs
        .access(destDir)
        .then(() => true)
        .catch(() => false))
    ) {
      await fs.mkdir(destDir, { recursive: true });
    }

    cb(null, destDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, randomUUID() + extension); // Убрано 'images/banners/' из filename
  },
});

export const bannersImagesUpload = multer({ storage: bannersImageStorage });
