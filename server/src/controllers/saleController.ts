import { Request, Response } from 'express';
import Sale from '../models/Sale';

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await Sale.find().populate('client');
    res.json(sales);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales.' });
    return;
  }
};

export const getSaleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = await Sale.findById(req.params.id).populate('client');
    if (!sale) {
      res.status(404).json({ message: 'Sale not found.' });
      return;
    }
    res.json(sale);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sale.' });
    return;
  }
};

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to create sale.', error });
    return;
  }
};

export const updateSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) {
      res.status(404).json({ message: 'Sale not found.' });
      return;
    }
    res.json(sale);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to update sale.', error });
    return;
  }
};

export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      res.status(404).json({ message: 'Sale not found.' });
      return;
    }
    res.json({ message: 'Sale deleted.' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sale.' });
    return;
  }
};
