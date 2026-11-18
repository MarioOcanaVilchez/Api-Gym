import { FiltrosWorkout, Workout } from "../types/workout";
import {v4 as uuid} from "uuid";
import { toHttpError } from "../utils/httpError";
import { getWorkouts, getWorkout as getWorkoutBD, createWorkout, updateWorkout, deleteWorkout as eliminarWorkout } from "../database/oracle";

export async function getAllWorkouts(){
    return await getWorkouts();
}
    
export async function getWorkout(id:string){
    try{
    return await getWorkoutBD(id);
    }catch(error){
        throw toHttpError(error);
    }
}

export async function postWorkout(workout:Workout){
    try{
    const id:string = uuid();
    const fechaCreacion = Date.now();
    const fechaActualizacion = Date.now();
    workout.id = id;
    workout.createdAt = fechaCreacion.toString();
    workout.updatedAt = fechaActualizacion.toString();
    return await createWorkout(workout);
    }catch(error){
        throw toHttpError(error);
    }
}
export async function patchWorkout(workout:Workout):Promise<Workout | undefined | boolean>{
    try{
    workout.updatedAt = Date.now().toString();
    let workoutAnt:Workout | null= await getWorkout(workout.id)!;
    if (workoutAnt == null) return false;
    if(workout.equipment == null) workout.equipment = workoutAnt!.equipment;
    if(workout.exercises == null) workout.exercises = workoutAnt!.exercises;
    if(workout.name == null) workout.name = workoutAnt!.name;
    if(workout.mode == null) workout.mode = workoutAnt!.mode;
    if(workout.trainerTips == null) workout.trainerTips = workoutAnt!.trainerTips;
    workout.createdAt = workoutAnt!.createdAt;
    return await updateWorkout(workout);
    } catch(error){
        throw toHttpError(error);
    }
}
export async function deleteWorkout(id:string){
    try{
    return await eliminarWorkout(id);
    }catch(error){
        throw toHttpError(error);
    }
}