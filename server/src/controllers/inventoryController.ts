import { Request, Response } from 'express';
import InventoryItem from '../models/InventoryItem';

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory.' });
    return;
  }
};

export const getInventoryItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }
    res.json(item);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item.' });
    return;
  }
};

export const createInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = new InventoryItem(req.body);
    await item.save();
    res.status(201).json(item);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to create item.', error });
    return;
  }
};

export const updateInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }
    res.json(item);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item.', error });
    return;
  }
};

export const deleteInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }
    res.json({ message: 'Item deleted.' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item.' });
    return;
  }
};
