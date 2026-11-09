import { Router } from "express";
import type{Express,Request,Response} from "express";
import { deleteWorkout, getAllMembers, getMember, patchWorkout, postWorkout } from "../../controller/controller";
import apicache from "apicache";

const cache = apicache.middleware;
const router:Router = Router();
router.get("/",cache("1 minutes"),getAllMembers);
router.get("/:id",getMember);
//cambiar
router.post("/",postWorkout);
router.patch("/:id",patchWorkout);
router.delete("/:id",deleteWorkout)

export default router;
