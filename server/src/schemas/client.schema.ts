import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(8, 'Phone number is required'),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  totalSpent: z.number().min(0).optional(),
  lastPurchase: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const updateClientSchema = createClientSchema.partial();
