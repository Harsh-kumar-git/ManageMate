import { Request, Response } from 'express';
import Client from '../models/Client';

export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const clients = await Client.find();
    res.json(clients);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clients.' });
    return;
  }
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      res.status(404).json({ message: 'Client not found.' });
      return;
    }
    res.json(client);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch client.' });
    return;
  }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to create client.', error });
    return;
  }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) {
      res.status(404).json({ message: 'Client not found.' });
      return;
    }
    res.json(client);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to update client.', error });
    return;
  }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      res.status(404).json({ message: 'Client not found.' });
      return;
    }
    res.json({ message: 'Client deleted.' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete client.' });
    return;
  }
};
