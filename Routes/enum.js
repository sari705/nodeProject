import { Router } from "express";
import { getTagsEnum, getCategiriesEnum } from "../Controllers/enum.js";

const router = Router()

router.get("/categories", getCategiriesEnum)
router.get("/tags", getTagsEnum)
router.get("/colors", getTagsEnum)

export default router