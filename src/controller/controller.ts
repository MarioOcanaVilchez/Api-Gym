import type{Express,Request,Response} from "express";
import * as workoutService from "../services/workoutService.ts";
import * as memberService from "../services/memberService.ts";
import * as recordService from "../services/recordsService.ts";
import type { FiltrosMember, FiltrosRecord, FiltrosWorkout, Miembro, Workout, WorkoutRecord } from "../types/workout.ts";

/**
 * @swagger
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - mode
 *         - equipment
 *         - exercises
 *         - createdAt
 *         - updatedAt
 *         - trainerTips
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           example: "Fran"
 *         mode:
 *           type: string
 *           example: "For Time"
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Barbell", "Pull-up bar"]
 *         exercises:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Thrusters", "Pull-ups"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         trainerTips:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Mantén el core activo", "Rompe las series temprano"]
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         data:
 *           type: string
 *           example: "not found"
 *     WorkoutRecord:
 *       type: object
 *       required:
 *         - id
 *         - workout
 *         - record
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         workout:
 *           type: string
 *           example: "Fran"
 *         record:
 *           type: string
 *           example: "2:15"
 *         memberId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         member:
 *           type: string
 *           example: "Juan Pérez"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *     Miembro:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - gender
 *         - dateOfBirth
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         name:
 *           type: string
 *           example: "Juan Pérez"
 *         gender:
 *           type: string
 *           example: "Male"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-05-15"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "********"
 */


/**
 * @swagger
 * /api/v1/apiKey:
 *   get:
 *     summary: Obtiene la API key
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: API key obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: string
 *                   example: "la api key es mario"
 */
export function getApiKey(request:Request,response:Response){
    response.send({
    status: 'ok',
    data: 'la api key es mario'
    });
}

/**
 * @swagger
 * /api/v1/workouts:
 *   get:
 *     summary: Obtiene todos los workouts con filtros opcionales
 *     tags: [Workouts]
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *         description: API key para autenticación
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del workout (búsqueda parcial)
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *         description: Filtrar por modo
 *       - in: query
 *         name: equipment
 *         schema:
 *           type: string
 *         description: Filtrar por equipamiento
 *       - in: query
 *         name: exercise
 *         schema:
 *           type: string
 *         description: Filtrar por ejercicio (búsqueda parcial)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Límite de resultados
 *     responses:
 *       200:
 *         description: Lista de workouts obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workout'
 *       400:
 *         description: API key inválida o límite inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No se encontraron workouts con los filtros aplicados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export function getAllWorkouts(request:Request,response:Response){
    const {mode} = request.query;
    const {equipment} = request.query;
    const {name} = request.query;
    const {exercise} = request.query;
    const {limit} = request.query;
    const {apiKey} = request.query;
    let filtros:FiltrosWorkout = {mode,equipment,name,exercise,limit,apiKey} as FiltrosWorkout;
    if (filtros.apiKey != 'mario') response.status(400).send({
        status: 'fail',
        data: 'no autorizado'
        });
    let workouts:Workout[] = workoutService.getAllWorkouts();
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
    if (workouts.length == 0) response.status(404).send({
        status: 'fail',
        data: 'not found'
        });
    response.send({
    status: 'ok',
    data: workouts
    });
}

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     summary: Obtiene todos los miembros
 *     tags: [Members]
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *         description: API key para autenticación
 *     responses:
 *       200:
 *         description: Lista de miembros obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Miembro'
 *       400:
 *         description: API key inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export function getAllMembers(request:Request,response:Response){
    const {apiKey} = request.query;
    let filtros:FiltrosMember = {apiKey} as FiltrosMember;
    if (filtros.apiKey != 'mario') response.status(400).send({
        status: 'fail',
        data: 'no autorizado'
        });
    let members:Miembro[] = memberService.getAllMembers();
    response.send({
    status: 'ok',
    data: members
    });
}

/**
 * @swagger
 * /api/v1/records:
 *   get:
 *     summary: Obtiene todos los records con filtro opcional
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *         description: API key para autenticación
 *       - in: query
 *         name: workout
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del workout
 *     responses:
 *       200:
 *         description: Lista de records obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkoutRecord'
 *       400:
 *         description: API key inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No se encontraron records con los filtros aplicados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export function getAllRecords(request:Request,response:Response){
    const {apiKey} = request.query;
    const {workout} = request.query;
    let filtros:FiltrosRecord = {workout,apiKey} as FiltrosRecord;
    if (filtros.apiKey != 'mario') response.status(400).send({
        status: 'fail',
        data: 'no autorizado'
        });
    let records:WorkoutRecord[] = recordService.getAllRecords();
    if (filtros.workout != undefined) records = records.filter((record) => record.workout == filtros.workout);
    if (records.length == 0) response.status(404).send({
        status: 'fail',
        data: 'not found'
        });
    response.send({
    status: 'ok',
    data: records
    });
}

/**
 * @swagger
 * /api/v1/workouts/{id}:
 *   get:
 *     summary: Obtiene un workout por ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del workout
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *         description: API key para autenticación
 *     responses:
 *       200:
 *         description: Workout obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: ID no proporcionado o API key inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export function getWorkouts(request:Request,response:Response){
    const {apiKey} = request.query;
    const id = request.params.id;
    let filtros:FiltrosWorkout = {apiKey} as FiltrosWorkout;
    if (filtros.apiKey != 'mario') response.status(400).send({
        status: 'fail',
        data: 'no autorizado'
        });
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

/**
 * @swagger
 * /api/v1/members/{id}:
 *   get:
 *     summary: Obtiene un miembro por ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del miembro
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *         description: API key para autenticación
 *     responses:
 *       200:
 *         description: Miembro obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Miembro'
 *       400:
 *         description: ID no proporcionado o API key inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export function getMember(request:Request,response:Response){
    const {apiKey} = request.query;
    const id = request.params.id;
    let filtros:FiltrosMember = {apiKey} as FiltrosMember;
    if (filtros.apiKey != 'mario') response.status(400).send({
        status: 'fail',
        data: 'no autorizado'
        });
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

/**
 * @swagger
 * /api/v1/records/{id}:
 *   get:
 *     summary: Obtiene un record por ID
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del record
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *         description: API key para autenticación
 *     responses:
 *       200:
 *         description: Record obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/WorkoutRecord'
 *       400:
 *         description: ID no proporcionado o API key inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export function getRecord(request:Request,response:Response){
    const {apiKey} = request.query;
    const id = request.params.id;
    let filtros:FiltrosRecord = {apiKey} as FiltrosRecord;
    if (filtros.apiKey != 'mario') response.status(400).send({
        status: 'fail',
        data: 'no autorizado'
        });
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

/**
 * @swagger
 * /api/v1/workouts:
 *   post:
 *     summary: Crea un nuevo workout
 *     tags: [Workouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mode
 *               - equipment
 *               - exercises
 *               - trainerTips
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fran"
 *               mode:
 *                 type: string
 *                 example: "For Time"
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Barbell", "Pull-up bar"]
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Thrusters", "Pull-ups"]
 *               trainerTips:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Mantén el core activo", "Rompe las series temprano"]
 *     responses:
 *       201:
 *         description: Workout creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Datos inválidos (faltan campos requeridos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
/**
 * @swagger
 * /api/v1/records:
 *   post:
 *     summary: Crea un nuevo record
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workout
 *               - record
 *             properties:
 *               workout:
 *                 type: string
 *                 example: "Fran"
 *               record:
 *                 type: string
 *                 example: "2:15"
 *               memberId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440002"
 *     responses:
 *       201:
 *         description: Record creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/WorkoutRecord'
 *       400:
 *         description: Datos inválidos (faltan campos requeridos workout, record)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/v1/workouts/{id}:
 *   patch:
 *     summary: Actualiza un workout existente
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del workout a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mode:
 *                 type: string
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: string
 *               trainerTips:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Workout actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: ID no proporcionado, o se intenta modificar id/createdAt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/v1/records/{id}:
 *   patch:
 *     summary: Actualiza un record existente
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del record a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workout:
 *                 type: string
 *               record:
 *                 type: string
 *               memberId:
 *                 type: string
 *               member:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/WorkoutRecord'
 *       400:
 *         description: ID no proporcionado, o se intenta modificar id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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


/**
 * @swagger
 * /api/v1/workouts/{id}:
 *   delete:
 *     summary: Elimina un workout
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del workout a eliminar
 *     responses:
 *       200:
 *         description: Workout eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *       400:
 *         description: ID no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/v1/records/{id}:
 *   delete:
 *     summary: Elimina un record
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del record a eliminar
 *     responses:
 *       200:
 *         description: Record eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *       400:
 *         description: ID no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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