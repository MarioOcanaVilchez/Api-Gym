import type{Express,Request,Response} from "express";
import * as workoutService from "../services/workoutService.ts";
import * as memberService from "../services/memberService.ts";
import * as recordService from "../services/recordsService.ts";
import type { FiltrosRecord, FiltrosWorkout, Miembro, Workout, WorkoutRecord } from "../types/workout.ts";


export function getAllWorkouts(request:Request,response:Response){
    const {mode} = request.query;
    const {equipment} = request.query;
    const {name} = request.query;
    const {exercise} = request.query;
    const {limit} = request.query;
    let workouts:Workout[] = workoutService.getAllWorkouts();
    let filtros:FiltrosWorkout = {mode,equipment,name,exercise,limit} as FiltrosWorkout;
    if (filtros.name != undefined) workouts = workouts.filter((workout) => workout.name.includes(filtros.name));
    if (filtros.mode != undefined) workouts = workouts.filter((workout) => workout.mode.toLowerCase() == filtros.mode.toLowerCase());
    if (filtros.equipment != undefined ) workouts =  workouts.filter((workout) => workout.equipment.some((equipment) => equipment == filtros.equipment));
    if (filtros.exercise != undefined) workouts =  workouts.filter((workout) => workout.exercises.some((exercise) => exercise.includes(filtros.exercise)));
    if (filtros.limit != undefined){
    let limite = Number.parseInt(filtros.limit);
    if (limite <= 0){ 
        response.status(400).send({
        status: 'fail',
        data: 'Bad request'
        });
        return;
    }

    if (limite > 0 && workouts.length > limite) workouts.splice(limite - 1, workouts.length - limite);
    }
    response.send({
    status: 'ok',
    data: workouts
    });
}

export function getAllMembers(request:Request,response:Response){
    let members:Miembro[] = memberService.getAllMembers();
    response.send({
    status: 'ok',
    data: members
    });
}

export function getAllRecords(request:Request,response:Response){
    const {workout} = request.query;
    let filtros:FiltrosRecord = {workout} as FiltrosRecord;
    let records:WorkoutRecord[] = recordService.getAllRecords();
    if (filtros.workout != undefined) records = records.filter((record) => record.workout == filtros.workout);
    response.send({
    status: 'ok',
    data: records
    });
}

export function getWorkouts(request:Request,response:Response){
    const id = request.params.id;
    if (id == undefined){
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    }else {
        response.send({
            status:200,
            data: workoutService.getWorkout(id.toString())
        });
    }
}

export function getMember(request:Request,response:Response){
    const id = request.params.id;
    if (id == undefined){
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    }else {
        response.send({
            status:200,
            data: memberService.getMember(id.toString())
        });
    }
}

export function getRecord(request:Request,response:Response){
    const id = request.params.id;
    if (id == undefined){
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    }else {
        response.send({
            status:200,
            data: recordService.getRecord(id.toString())
        });
    }
}

export function postWorkout(request:Request,response:Response){
    const body:Workout = request.body ?? {};
    if (body.name == null || body.exercises == null ||  body.equipment == null || body.mode == null || body.trainerTips == null) {
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    } else {
    response.status(201).send({
        status: 'ok',
        data: workoutService.postWorkout(body)
    });
}
}
export function postRecord(request:Request,response:Response){
    const body:WorkoutRecord = request.body ?? {};
    if (body.workout == null || body.record == null) {
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    } else {
    response.status(201).send({
        status: 'ok',
        data: recordService.postRecord(body)
    });
}
}

export function patchWorkout(request:Request,response:Response){
    const id = request.params.id;
    if (id == undefined){
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    } else{
        const body:Workout = request.body ?? {};
        if (body.id != null || body.createdAt != null){
            response.status(400).send({
            status: 'fail',
            data: 'Bad request'
            });
        } else {
            body.id = id.toString();
            response.status(201).send({
                status: 'ok',
                data: workoutService.patchWorkout(body)
            });
        }
    }
}

export function patchRecord(request:Request,response:Response){
    const id = request.params.id;
    if (id == undefined){
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    } else{
        const body:WorkoutRecord = request.body ?? {};
        if (body.id != null){
            response.status(400).send({
            status: 'fail',
            data: 'Bad request'
            });
        } else {
            body.id = id.toString();
            response.status(201).send({
                status: 'ok',
                data: recordService.patchRecord(body)
            });
        }
    }
}


export function deleteWorkout(request:Request,response:Response){
    const id = request.params.id;
    if (id == undefined){
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    } else{
        response.send({
            status:200,
            data: workoutService.deleteWorkout(id.toString())
        });
    }
}

export function deleteRecord(request:Request,response:Response){
    const id = request.params.id;
    if (id == undefined){
        response.status(400).send({
            status: 'fail',
            data: 'Bad request'
        });
    } else{
        response.send({
            status:200,
            data: recordService.deleteRecord(id.toString())
        });
    }
}