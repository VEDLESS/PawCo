import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log internal error trace on the server
  console.error('[Error Middleware Caught]:', err);

  if (res.headersSent) {
    return next(err);
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      res.status(409).json({
        success: false,
        error: `A record with this ${target} already exists.`,
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'The requested resource was not found.',
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: 'Database operation failed.',
    });
    return;
  }

  // Handle Custom Application Errors
  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Default internal server error with safe message
  res.status(500).json({
    success: false,
    error: 'An unexpected internal server error occurred. Please try again later.',
  });
};
