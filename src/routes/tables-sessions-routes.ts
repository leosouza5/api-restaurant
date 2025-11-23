import { Router } from "express";
import { TableSessionsController } from "@/controllers/tables-sessions-controller";


const tableSessionsRoutes = Router()
const tableSessionController = new TableSessionsController()


tableSessionsRoutes.get("/", tableSessionController.index)
tableSessionsRoutes.post("/", tableSessionController.create)
tableSessionsRoutes.patch("/:id", tableSessionController.update)


export { tableSessionsRoutes }