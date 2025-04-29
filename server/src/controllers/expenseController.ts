import { Request, Response } from 'express';
import Expense from '../models/Expense';

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses.' });
    return;
  }
};

export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      res.status(404).json({ message: 'Expense not found.' });
      return;
    }
    res.json(expense);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expense.' });
    return;
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to create expense.', error });
    return;
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) {
      res.status(404).json({ message: 'Expense not found.' });
      return;
    }
    res.json(expense);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to update expense.', error });
    return;
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      res.status(404).json({ message: 'Expense not found.' });
      return;
    }
    res.json({ message: 'Expense deleted.' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense.' });
    return;
  }
};
