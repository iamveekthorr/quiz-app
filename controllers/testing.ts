import { NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

export const testingcatchAsync = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body;
  }
);
