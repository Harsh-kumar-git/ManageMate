import { z } from 'zod';

export const createExpenseSchema = z.object({
  expense_number: z.string().min(1),
  vendor: z.string().min(1),
  date: z.string().or(z.date()),
  category: z.string().min(1),
  amount: z.number(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'approved', 'reimbursed']).default('pending'),
});

export const updateExpenseSchema = createExpenseSchema.partial();
