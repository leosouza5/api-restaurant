import { Response, Request, NextFunction } from "express";
import { knex } from "@/database/knex";
import z from "zod";
import { AppError } from "@/utils/app-error";

class TableSessionsController {

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const sessions = await knex<TablesSessionsRepository>("tables_sessions").orderBy("closed_at")

            return res.json(sessions)
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                table_id: z.number()
            })

            const { table_id } = bodySchema.parse(req.body)

            const table = await knex("tables").where({ id: table_id }).first()
            const session = await knex<TablesSessionsRepository>("tables_sessions").where({ table_id }).orderBy("opened_at", "desc").first()

            if (session && !session.closed_at) {
                throw new AppError("This table is already open")
            }

            if (!table) {
                throw new AppError("Table not found")
            }

            await knex<TablesSessionsRepository>("tables_sessions").insert({ table_id, opened_at: knex.fn.now() })

            return res.status(201).json({ message: "success" })
        } catch (error) {
            next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z
                .string()
                .transform(value => Number(value))
                .refine(value => !isNaN(value), { message: "Id must be a number" })
                .parse(req.params.id)


            const session = await knex<TablesSessionsRepository>("tables_sessions").where({ id }).first()

            if (!session) {
                throw new AppError("Table Session not found")
            }

            if (session.closed_at) {
                throw new AppError("This table session is already closed")
            }


            await knex<TablesSessionsRepository>("tables_sessions").update({ "closed_at": knex.fn.now() }).where({ id })
            return res.json()
        } catch (error) {
            next(error)
        }
    }
}


export { TableSessionsController }