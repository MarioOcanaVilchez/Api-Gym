import { getMembers, getMember as getMemberBD } from "../database/oracle";
import { toHttpError } from "../utils/httpError";


export async function getAllMembers(){
    return await getMembers();
}

export async function getMember(id:string){
    try{
    return await getMemberBD(id);
    }catch(error){
        throw toHttpError(error);
    }
}