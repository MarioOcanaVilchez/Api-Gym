import { loadDB,deleteRecord as eliminarRecord, createRecord, updateRecord } from "../database/ficheros";
import { WorkoutRecord } from "../types/workout";
import { toHttpError } from "../utils/httpError";
import {v4 as uuid} from "uuid";

export function getAllRecords(){
    return loadDB().records;
}

export function getRecord(id:string){
    try{
    return loadDB().records.find((record) => record.id == id) ?? null;
    }catch(error){
        throw toHttpError(error);
    }
}

export function postRecord(record:WorkoutRecord){
    try{
    const id:string = uuid();
    record.id = id;
    if (record.memberId != null) record.member = `/api/v1/members/${record.memberId}`;
    return createRecord(record);
    }catch(error){
        throw toHttpError(error);
    }
}

export function patchRecord(record:WorkoutRecord){
    try{
    let recordAnt:WorkoutRecord = getRecord(record.id)!;
    if(record.workout == null) record.workout = recordAnt.workout;
    if(record.memberId == null) record.memberId = recordAnt.memberId;
    else record.member = `/api/v1/members/${record.memberId}`;
    if(record.record == null) record.record = recordAnt.record;
    return updateRecord(record);
    } catch(error){
        throw toHttpError(error);
    }
}

export function deleteRecord(id:string){
    try{
    return eliminarRecord(id);
    }catch(error){
        throw toHttpError(error);
    }
}