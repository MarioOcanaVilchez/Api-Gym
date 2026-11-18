import {
  getRecords,
  getRecord as getRecordBD,
  createRecord,
  updateRecord,
  deleteRecord as eliminarRecord
} from "../database/oracle";
import { WorkoutRecord } from "../types/workout";
import { toHttpError } from "../utils/httpError";
import { v4 as uuid } from "uuid";

export async function getAllRecords() {
  return await getRecords();
}

export async function getRecord(id: string) {
  try {
    return await getRecordBD(id);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function postRecord(record: WorkoutRecord) {
  try {
    const id: string = uuid();
    record.id = id;
    if (record.memberId != null) record.member = `/api/v1/members/${record.memberId}`;
    return await createRecord(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function patchRecord(record: WorkoutRecord) {
  try {
    const recordAnt: WorkoutRecord | null = await getRecord(record.id);
    if (recordAnt == null) return false;
    if (record.workout == null) record.workout = recordAnt.workout;
    if (record.memberId == null) record.memberId = recordAnt.memberId;
    if (record.memberId != null) record.member = `/api/v1/members/${record.memberId}`;
    if (record.record == null) record.record = recordAnt.record;
    return await updateRecord(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function deleteRecord(id: string) {
  try {
    return await eliminarRecord(id);
  } catch (error) {
    throw toHttpError(error);
  }
}