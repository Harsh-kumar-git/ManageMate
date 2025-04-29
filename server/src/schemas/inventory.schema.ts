import { z } from 'zod';

export const createInventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  reorderPoint: z.number().min(0, 'Reorder point cannot be negative'),
  lastRestocked: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  status: z.enum(['in-stock', 'low-stock', 'out-of-stock']),
});

export const updateInventorySchema = createInventorySchema.partial();
