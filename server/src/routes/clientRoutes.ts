import { Router } from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/clientController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';

const router = Router();

router.use(auth);

router.route('/')
  .get(getClients)
  .post(validate(createClientSchema), createClient);

router.route('/:id')
  .get(getClientById)
  .put(validate(updateClientSchema), updateClient)
  .delete(deleteClient);

export default router;
