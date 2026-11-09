import { Router } from "express";
import type{Express,Request,Response} from "express";
import { deleteWorkout, getAllWorkouts, getWorkouts, patchWorkout, postWorkout } from "../../controller/controller";
import apicache from "apicache";

const cache = apicache.middleware;
const router:Router = Router();
router.get("/",cache("1 minutes"),getAllWorkouts);
router.get("/:id",getWorkouts);
router.post("/",postWorkout);
router.patch("/:id",patchWorkout);
router.delete("/:id",deleteWorkout)

export default router;

