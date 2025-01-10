import { Router } from "express";
import { getTagsEnum, getCategiriesEnum } from "../Controllers/enum.js";

const router = Router()

router.get("/categories", getCategiriesEnum)
router.get("/tags", getTagsEnum)

export default router