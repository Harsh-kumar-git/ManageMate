import { Router } from 'express';
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale
} from '../controllers/saleController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSaleById)
  .put(updateSale)
  .delete(deleteSale);

export default router;
