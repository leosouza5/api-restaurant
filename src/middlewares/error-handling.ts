import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";


function errorHandling(error: any, req: Request, res: Response, _: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Validation Error", issues: error.format() })
  }

  return res.status(500).json({ message: error.message })
}

export { errorHandling }