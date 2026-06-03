import express from 'express';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  togglePublishStatus,
  deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

router.route('/')
  .post(createProduct)
  .get(getAllProducts);

router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.route('/:id/toggle-publish')
  .patch(togglePublishStatus);

export default router;