import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthenticationError, ValidationError, DuplicateError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

interface UserResponse {
  _id: string;
  name: string;
  email: string;
  password?: string;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ValidationError('Please provide name, email and password');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new DuplicateError('Email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    }) as IUser;

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password') as IUser;
    if (!user || !(await user.comparePassword(password))) {
      throw new AuthenticationError('Incorrect email or password');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};
