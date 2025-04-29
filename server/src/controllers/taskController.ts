import { Response } from 'express';
import Task, { ITask } from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.userId
    });
    await task.save();
    res.status(201).json(task);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
    return;
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority } = req.query;
    const query: any = { userId: req.userId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
    return;
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
    return;
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
    return;
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
    return;
  }
};
