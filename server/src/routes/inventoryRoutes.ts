import { Router } from 'express';
import {
  getInventory,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '../controllers/inventoryController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createInventorySchema, updateInventorySchema } from '../schemas/inventory.schema';

const router = Router();

router.use(auth);

router.route('/')
  .get(getInventory)
  .post(validate(createInventorySchema), createInventoryItem);

router.route('/:id')
  .get(getInventoryItemById)
  .put(validate(updateInventorySchema), updateInventoryItem)
  .delete(deleteInventoryItem);

export default router;
