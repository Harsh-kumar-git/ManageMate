import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
