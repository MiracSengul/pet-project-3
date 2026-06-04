import { Router } from "express";
import { fetchProductsController } from "../controller/products.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/", ctrlWrapper(fetchProductsController));


export default router;