import { AppError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";
import { z } from "zod"
import { knex } from "@/database/knex";


class ProductController {

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query

      const products = await knex<ProductRepository>("products").select().orderBy("name")
      return res.json(products)
    } catch (error) {
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0)
      })

      const { name, price } = bodySchema.parse(req.body)

      await knex<ProductRepository>("products").insert({ name, price })

      res.status(201).json()
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController };