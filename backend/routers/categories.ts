import mongoose from 'mongoose';
import express from 'express';
import Category from '../models/Category';

const categoryRouter = express.Router();

categoryRouter.post('/', async (req, res, next) => {
  try {
    const category = new Category({
      name: req.body.name,
    });

    await category.save();
    return res.send({ message: 'created successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

categoryRouter.get('/', async (req, res, next) => {
  try {
    const categoryRes = await Category.find();
    return res.send(categoryRes);
  } catch (e) {
    return next(e);
  }
});

categoryRouter.get('/:id', async (req, res, next) => {
  try {
    const categoryRes = await Category.findOne({ ID: req.params.id });
    return res.send(categoryRes);
  } catch (e) {
    return next(e);
  }
});

export default categoryRouter;
