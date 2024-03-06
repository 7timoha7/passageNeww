import mongoose from 'mongoose';
import express from 'express';
import ChatIdAdmin from '../models/ChatIdAdmin';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';

const chatIdAdminRouter = express.Router();

chatIdAdminRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const chatIdAdmin = new ChatIdAdmin({
      user_id: user._id,
      chat_id: req.body.chat_id,
    });

    await chatIdAdmin.save();
    return res.send({
      message: {
        en: 'Your chat ID for notifications, successfully added.',
        ru: 'Id вашего чата для оповещений , успешно добавлено.',
      },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

chatIdAdminRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const chatIdAdmin = await ChatIdAdmin.findOne({ user_id: user._id });
    return res.send(chatIdAdmin);
  } catch (e) {
    return next(e);
  }
});

chatIdAdminRouter.get('/chatIdAdmin', auth, permit('admin'), async (req, res, next) => {
  try {
    const chatIdAdmin = await ChatIdAdmin.find();
    return res.send(chatIdAdmin);
  } catch (e) {
    return next(e);
  }
});

chatIdAdminRouter.patch('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;

    const catIdAdmin = await ChatIdAdmin.findOneAndUpdate(
      { user_id: user._id },
      { chat_id: req.body.chat_id },
      { new: true },
    );

    if (!catIdAdmin) {
      return res.send({
        message: {
          en: 'No record found.',
          ru: 'Запись не найдена.',
        },
      });
    }

    return res.send({
      message: {
        en: 'The ID has been successfully changed.',
        ru: 'Id успешно изменен.',
      },
    });
  } catch (e) {
    return next(e);
  }
});

chatIdAdminRouter.delete('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;

    const result = await ChatIdAdmin.deleteOne({ user_id: user._id });

    if (result.deletedCount === 0) {
      return res.send({
        message: {
          en: 'No record found.',
          ru: 'Запись не найдена.',
        },
      });
    }

    return res.send({
      message: {
        en: 'Alert ID successfully deleted!',
        ru: 'ID для оповещений успешно удален!',
      },
    });
  } catch (e) {
    return next(e);
  }
});

export default chatIdAdminRouter;
