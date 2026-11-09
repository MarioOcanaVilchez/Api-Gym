import { Router } from "express";
import type{Express,Request,Response} from "express";
import { deleteRecord, getAllRecords, getRecord, patchRecord, postRecord } from "../../controller/controller";
import apicache from "apicache";

const cache = apicache.middleware;
const router:Router = Router();
router.get("/",cache("1 minutes"),getAllRecords);
router.get("/:id",getRecord);
router.post("/",postRecord);
router.patch("/:id",patchRecord);
router.delete("/:id",deleteRecord);

export default router;