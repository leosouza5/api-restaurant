import { ProductController } from "@/controllers/products-controllers";
import { Router } from "express";


const productsRoutes = Router();
const productController = new ProductController()


productsRoutes.get("/", productController.index)
productsRoutes.post("/", productController.create)

export { productsRoutes }