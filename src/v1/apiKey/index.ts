import { Router } from "express";
import type{Express,Request,Response} from "express";
import { getApiKey } from "../../controller/controller";


const router:Router = Router();
router.get("/",getApiKey);

export default router;