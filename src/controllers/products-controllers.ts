import { AppError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";
import { z } from "zod"
import { knex } from "@/database/knex";


class ProductController {

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query

      const products = await knex<ProductRepository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name")
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value => !isNaN(value)), { message: "Id must be a number" })
        .parse(req.params.id)

      const bodyScheme = z
        .object({
          name: z.string().trim().min(6),
          price: z.number().gt(0)
        })

      const { name, price } = bodyScheme.parse(req.body)

      const product = await knex<ProductRepository>("products")
        .select()
        .where({ id })
        .first()

      if (!product) {
        throw new AppError("Product not found", 404)
      }

      await knex<ProductRepository>("products")
        .update({ name, price, updated_at: knex.fn.now() })
        .where({ id })

      res.status(201).json({ message: "Product updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value => !isNaN(value)), { message: "Id must be a number" })
        .parse(req.params.id)

      const product = await knex<ProductRepository>("products")
        .select()
        .where({ id })
        .first()

      if (!product) {
        throw new AppError("Product not found", 404)
      }

      await knex<ProductRepository>("products")
        .delete()
        .where({ id })

      res.status(201).json({ message: "Product removed !" })

    } catch (error) {
      next(error)
    }

  }
}

export { ProductController };