import { Router } from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createExpenseSchema, updateExpenseSchema } from '../schemas/expense.schema';

const router = Router();

router.use(auth);

router.route('/')
  .get(getExpenses)
  .post(validate(createExpenseSchema), createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(validate(updateExpenseSchema), updateExpense)
  .delete(deleteExpense);

export default router;
