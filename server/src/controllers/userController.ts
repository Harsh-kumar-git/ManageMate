import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
    return;
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
    res.json(users);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
    return;
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user' });
    return;
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
    return;
  }
};
