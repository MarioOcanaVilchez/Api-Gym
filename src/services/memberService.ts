import { loadDB,saveToDatabase,createWorkout,deleteWorkout as eliminarWorkout, updateWorkout } from "../database/ficheros";
import { toHttpError } from "../utils/httpError";


export function getAllMembers(){
    return loadDB().members;
}

export function getMember(id:string){
    try{
    return loadDB().members.find((member) => member.id == id) ?? null;
    }catch(error){
        throw toHttpError(error);
    }
}