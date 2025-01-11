import { Router } from "express";
import { getTagsEnum, getCategiriesEnum, getColorsEnum } from "../Controllers/enum.js";

const router = Router()

router.get("/categories", getCategiriesEnum)
router.get("/tags", getTagsEnum)
router.get("/colors", getColorsEnum)

export default router