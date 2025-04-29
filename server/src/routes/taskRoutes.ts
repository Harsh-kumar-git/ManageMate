import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  getTaskById,
  updateTask
} from '../controllers/taskController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { taskSchema } from '../schemas/auth.schema';

const router = Router();

// All task routes require authentication
router.use(auth);

router.route('/')
  .get(getTasks)
  .post(validate(taskSchema), createTask);

router.route('/:id')
  .get(getTaskById)
  .put(validate(taskSchema), updateTask)
  .delete(deleteTask);

export default router;
