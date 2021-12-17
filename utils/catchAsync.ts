import { NextFunction } from 'express';

export default <T>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
