import { Router } from 'express';
import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
} from '../controllers/reportController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .get(getReportById)
  .put(updateReport)
  .delete(deleteReport);

export default router;
