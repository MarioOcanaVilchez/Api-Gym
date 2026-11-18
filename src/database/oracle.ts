import oracledb from "oracledb";
import dotenv from "dotenv";
import { toHttpError } from "../utils/httpError";
import type { Miembro, Workout, WorkoutRecord } from "../types/workout";

dotenv.config({ path: "./src/config/.env" });

interface WorkoutRow {
  ID: string;
  NOMBRE: string;
  MODO: string;
  CREATEDAT: string;
  UPDATEDAT: string;
}

interface ChildRow {
  NOMBRE: string;
  WORKOUT: string;
}

interface MemberRow {
  ID: string;
  NAME: string;
  GENDER: string;
  DATEOFBIRTH: string;
  EMAIL: string;
  PASSWORD: string;
}

interface RecordRow {
  ID: string;
  WORKOUT: string;
  RECORD: string;
  MEMBERID: string | null;
}

export async function connectDB() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1,
      poolTimeout: 60,
      poolPingInterval: 60
    });

    console.log("Conectado a Oracle Cloud correctamente");
  } catch (error) {
    console.error("Error conectando a Oracle:", error);
  }
}

export async function getWorkouts(): Promise<Workout[]> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };    
    const workoutsRes = await conexion.execute<WorkoutRow>(
      "SELECT id, nombre, modo, createdAt, updatedAt FROM workout",
      [],
      options
    );
    const equipmentRes = await conexion.execute<ChildRow>(
      "SELECT nombre, workout FROM equipment",
      [],
      options
    );
    const exercisesRes = await conexion.execute<ChildRow>(
      "SELECT nombre, workout FROM exercises",
      [],
      options
    );
    const trainerTipsRes = await conexion.execute<ChildRow>(
      "SELECT nombre, workout FROM trainerTips",
      [],
      options
    );
    const workoutRows = (workoutsRes.rows ?? []) as WorkoutRow[];
    const equipmentRows = (equipmentRes.rows ?? []) as ChildRow[];
    const exercisesRows = (exercisesRes.rows ?? []) as ChildRow[];
    const trainerTipsRows = (trainerTipsRes.rows ?? []) as ChildRow[];
    const workouts: Workout[] = workoutRows.map((row: WorkoutRow) => ({
      id: row.ID,
      name: row.NOMBRE,
      mode: row.MODO,
      equipment: equipmentRows
        .filter((e: ChildRow) => e.WORKOUT === row.ID)
        .map((e: ChildRow) => e.NOMBRE),
      exercises: exercisesRows
        .filter((ex: ChildRow) => ex.WORKOUT === row.ID)
        .map((ex: ChildRow) => ex.NOMBRE),
      createdAt: row.CREATEDAT,
      updatedAt: row.UPDATEDAT,
      trainerTips: trainerTipsRows
        .filter((t: ChildRow) => t.WORKOUT === row.ID)
        .map((t: ChildRow) => t.NOMBRE)
    }));
    
    return workouts;
  } catch (error) {
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function getMembers(): Promise<Miembro[]> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    const membersRes = await conexion.execute<MemberRow>(
      "SELECT id, name, gender, dateOfBirth, email, password FROM member",
      [],
      options
    );
    const memberRows = (membersRes.rows ?? []) as MemberRow[];
    const members: Miembro[] = memberRows.map((row: MemberRow) => ({
      id: row.ID,
      name: row.NAME,
      gender: row.GENDER,
      dateOfBirth: row.DATEOFBIRTH,
      email: row.EMAIL,
      password: row.PASSWORD
    }));
    return members;
  } catch (error) {
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function getMember(id: string): Promise<Miembro | null> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    const membersRes = await conexion.execute<MemberRow>(
      "SELECT id, name, gender, dateOfBirth, email, password FROM member WHERE id = :id",
      { id },
      options
    );
    const memberRows = (membersRes.rows ?? []) as MemberRow[];
    if (memberRows.length === 0) return null;

    const row = memberRows[0]!;
    return {
      id: row.ID,
      name: row.NAME,
      gender: row.GENDER,
      dateOfBirth: row.DATEOFBIRTH,
      email: row.EMAIL,
      password: row.PASSWORD
    };
  } catch (error) {
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function getRecords(): Promise<WorkoutRecord[]> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    const recordsRes = await conexion.execute<RecordRow>(
      "SELECT id, workout, record, memberId FROM record",
      [],
      options
    );
    const recordRows = (recordsRes.rows ?? []) as RecordRow[];
    return recordRows.map((row: RecordRow) => ({
      id: row.ID,
      workout: row.WORKOUT,
      record: row.RECORD,
      ...(row.MEMBERID
        ? {
            memberId: row.MEMBERID,
            member: `/api/v1/members/${row.MEMBERID}`
          }
        : {})
    }));
  } catch (error) {
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function getRecord(id: string): Promise<WorkoutRecord | null> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    const recordsRes = await conexion.execute<RecordRow>(
      "SELECT id, workout, record, memberId FROM record WHERE id = :id",
      { id },
      options
    );
    const recordRows = (recordsRes.rows ?? []) as RecordRow[];
    if (recordRows.length === 0) return null;

    const row = recordRows[0]!;
    return {
      id: row.ID,
      workout: row.WORKOUT,
      record: row.RECORD,
      ...(row.MEMBERID
        ? {
            memberId: row.MEMBERID,
            member: `/api/v1/members/${row.MEMBERID}`
          }
        : {})
    };
  } catch (error) {
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function getWorkout(id: string): Promise<Workout | null> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    const workoutsRes = await conexion.execute<WorkoutRow>(
      `SELECT id, nombre, modo, createdAt, updatedAt FROM workout WHERE id = :id`,
      { id },
      options
    );
    const equipmentRes = await conexion.execute<ChildRow>(
      `SELECT nombre, workout FROM equipment WHERE workout = :id`,
      { id },
      options
    );
    const exercisesRes = await conexion.execute<ChildRow>(
      `SELECT nombre, workout FROM exercises WHERE workout = :id`,
      { id },
      options
    );
    const trainerTipsRes = await conexion.execute<ChildRow>(
      `SELECT nombre, workout FROM trainerTips WHERE workout = :id`,
      { id },
      options
    );
    const workoutRows = (workoutsRes.rows ?? []) as WorkoutRow[];
    if (workoutRows.length === 0) return null;

    const equipmentRows = (equipmentRes.rows ?? []) as ChildRow[];
    const exercisesRows = (exercisesRes.rows ?? []) as ChildRow[];
    const trainerTipsRows = (trainerTipsRes.rows ?? []) as ChildRow[];

    const workouts: Workout[] = workoutRows.map((row: WorkoutRow) => ({
      id: row.ID,
      name: row.NOMBRE,
      mode: row.MODO,
      equipment: equipmentRows
        .filter((e: ChildRow) => e.WORKOUT === row.ID)
        .map((e: ChildRow) => e.NOMBRE),
      exercises: exercisesRows
        .filter((ex: ChildRow) => ex.WORKOUT === row.ID)
        .map((ex: ChildRow) => ex.NOMBRE),
      createdAt: row.CREATEDAT,
      updatedAt: row.UPDATEDAT,
      trainerTips: trainerTipsRows
        .filter((t: ChildRow) => t.WORKOUT === row.ID)
        .map((t: ChildRow) => t.NOMBRE)
    }));
    return workouts.at(0) ?? null;
  } catch (error) {
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}


export async function createWorkout(workout: Workout) {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();

    await conexion.execute(
      `INSERT INTO workout (id, nombre, modo, createdAt, updatedAt)
       VALUES (:id, :nombre, :modo, :createdAt, :updatedAt)`,
      {
        id: workout.id,
        nombre: workout.name,
        modo: workout.mode,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt
      },
      { autoCommit: false }
    );

    if (workout.equipment.length > 0) {
      await conexion.executeMany(
        `INSERT INTO equipment (nombre, workout) VALUES (:nombre, :workout)`,
        workout.equipment.map((item) => ({ nombre: item, workout: workout.id })),
        { autoCommit: false }
      );
    }

    if (workout.exercises.length > 0) {
      await conexion.executeMany(
        `INSERT INTO exercises (nombre, workout) VALUES (:nombre, :workout)`,
        workout.exercises.map((exercise) => ({ nombre: exercise, workout: workout.id })),
        { autoCommit: false }
      );
    }

    if (workout.trainerTips.length > 0) {
      await conexion.executeMany(
        `INSERT INTO trainerTips (nombre, workout) VALUES (:nombre, :workout)`,
        workout.trainerTips.map((tip) => ({ nombre: tip, workout: workout.id })),
        { autoCommit: false }
      );
    }

    await conexion.commit();
    return workout;
  } catch (error) {
    if (conexion) {
      await conexion.rollback();
    }
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function createRecord(record: WorkoutRecord) {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();

    await conexion.execute(
      `INSERT INTO record (id, workout, record, memberId)
       VALUES (:id, :workout, :record, :memberId)`,
      {
        id: record.id,
        workout: record.workout,
        record: record.record,
        memberId: record.memberId ?? null,
      },
      { autoCommit: false }
    );
    await conexion.commit();
    return record;
  } catch (error) {
    if (conexion) {
      await conexion.rollback();
    }
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function updateRecord(record: WorkoutRecord): Promise<WorkoutRecord | undefined> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    await conexion.execute(
      `UPDATE record
       SET workout = :workout, record = :record, memberId = :memberId
       WHERE id = :id`,
      {
        workout: record.workout,
        record: record.record,
        memberId: record.memberId ?? null,
        id: record.id
      },
      { autoCommit: false }
    );
    await conexion.commit();
    return record;
  } catch (error) {
    if (conexion) {
      await conexion.rollback();
    }
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function deleteRecord(id: string): Promise<boolean> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `DELETE FROM record WHERE id = :id`,
      { id },
      { autoCommit: false }
    );
    await conexion.commit();
    return (result.rowsAffected ?? 0) > 0;
  } catch (error) {
    if (conexion) {
      await conexion.rollback();
    }
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

export async function updateWorkout(workout: Workout): Promise<Workout | undefined> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    await conexion.execute(
      `UPDATE workout
       SET nombre = :nombre, modo = :modo, createdAt = :createdAt, updatedAt = :updatedAt
       WHERE id = :id`,
      {
        nombre: workout.name,
        modo: workout.mode,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt,
        id: workout.id
      },
      { autoCommit: false }
    );
    await conexion.execute(
      `DELETE FROM equipment WHERE workout = :id`,
      { id: workout.id },
      { autoCommit: false }
    );

    if (workout.equipment.length > 0) {
      await conexion.executeMany(
        `INSERT INTO equipment (nombre, workout) VALUES (:nombre, :workout)`,
        workout.equipment.map((item) => ({ nombre: item, workout: workout.id })),
        { autoCommit: false }
      );
    }

    await conexion.execute(
      `DELETE FROM exercises WHERE workout = :id`,
      { id: workout.id },
      { autoCommit: false }
    );

    if (workout.exercises.length > 0) {
      await conexion.executeMany(
        `INSERT INTO exercises (nombre, workout) VALUES (:nombre, :workout)`,
        workout.exercises.map((exercise) => ({ nombre: exercise, workout: workout.id })),
        { autoCommit: false }
      );
    }

    await conexion.execute(
      `DELETE FROM trainerTips WHERE workout = :id`,
      { id: workout.id },
      { autoCommit: false }
    );

    if (workout.trainerTips.length > 0) {
      await conexion.executeMany(
        `INSERT INTO trainerTips (nombre, workout) VALUES (:nombre, :workout)`,
        workout.trainerTips.map((tip) => ({ nombre: tip, workout: workout.id })),
        { autoCommit: false }
      );
    }
    await conexion.commit();
    return workout;
  } catch (error) {
    if (conexion) {
      await conexion.rollback();
    }
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}


export async function deleteWorkout(id: string): Promise<boolean> {
  let conexion: oracledb.Connection | undefined;
  try {
    conexion = await oracledb.getConnection();
    await conexion.execute(
      `DELETE FROM equipment WHERE workout = :id`,
      { id },
      { autoCommit: false }
    );
    await conexion.execute(
      `DELETE FROM exercises WHERE workout = :id`,
      { id },
      { autoCommit: false }
    );
    await conexion.execute(
      `DELETE FROM trainerTips WHERE workout = :id`,
      { id },
      { autoCommit: false }
    );
    const result = await conexion.execute(
      `DELETE FROM workout WHERE id = :id`,
      { id },
      { autoCommit: false }
    );
    await conexion.commit();
    return (result.rowsAffected ?? 0) > 0;
  } catch (error) {
    if (conexion) {
      await conexion.rollback();
    }
    throw toHttpError(error);
  } finally {
    if (conexion) {
      await conexion.close();
    }
  }
}

