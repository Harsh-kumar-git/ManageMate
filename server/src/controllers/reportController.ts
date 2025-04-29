import { Request, Response } from 'express';
import Report from '../models/Report';

export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await Report.find();
    res.json(reports);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports.' });
    return;
  }
};

export const getReportById = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ message: 'Report not found.' });
      return;
    }
    res.json(report);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report.' });
    return;
  }
};

export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to create report.', error });
    return;
  }
};

export const updateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) {
      res.status(404).json({ message: 'Report not found.' });
      return;
    }
    res.json(report);
    return;
  } catch (error) {
    res.status(400).json({ message: 'Failed to update report.', error });
    return;
  }
};

export const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      res.status(404).json({ message: 'Report not found.' });
      return;
    }
    res.json({ message: 'Report deleted.' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete report.' });
    return;
  }
};
