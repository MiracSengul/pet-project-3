import { Router } from "express"
import ctrlWrapper  from "../utils/ctrlWrapper.js";
import { getNearestStore } from "../controller/store.js"

const router = Router()

router.get("/nearest", ctrlWrapper(getNearestStore));


export default router