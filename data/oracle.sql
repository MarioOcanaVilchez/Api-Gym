-- Script para ejecutar en el SQL Worksheet de Oracle Cloud (Autonomous Database)

CREATE TABLE workout (
    id VARCHAR2(100),
    nombre VARCHAR2(100),
    modo VARCHAR2(50),
    createdAt VARCHAR2(25),
    updatedAt VARCHAR2(25),
    CONSTRAINT PK_Workout PRIMARY KEY (id)
);

CREATE TABLE equipment (
    nombre VARCHAR2(100),
    workout VARCHAR2(100),
    CONSTRAINT PK_equipment PRIMARY KEY (nombre, workout),
    CONSTRAINT FK_equipment_workout FOREIGN KEY (workout) REFERENCES workout(id) ON DELETE CASCADE
);

CREATE TABLE exercises (
    nombre VARCHAR2(100),
    workout VARCHAR2(100),
    CONSTRAINT PK_exercises PRIMARY KEY (nombre, workout),
    CONSTRAINT FK_exercises_workout FOREIGN KEY (workout) REFERENCES workout(id) ON DELETE CASCADE
);

CREATE TABLE trainerTips (
    nombre VARCHAR2(100),
    workout VARCHAR2(100),
    CONSTRAINT PK_trainerTips PRIMARY KEY (nombre, workout),
    CONSTRAINT FK_trainerTips_workout FOREIGN KEY (workout) REFERENCES workout(id) ON DELETE CASCADE
);

CREATE TABLE member (
    id VARCHAR2(100),
    name VARCHAR2(100),
    gender VARCHAR2(20),
    dateOfBirth VARCHAR2(25),
    email VARCHAR2(100),
    password VARCHAR2(255),
    CONSTRAINT PK_Member PRIMARY KEY (id)
);

CREATE TABLE record (
    id VARCHAR2(100),
    workout VARCHAR2(100),
    record VARCHAR2(100),
    memberId VARCHAR2(100),
    CONSTRAINT PK_Record PRIMARY KEY (id),
    CONSTRAINT FK_record_workout FOREIGN KEY (workout) REFERENCES workout(id) ON DELETE CASCADE,
    CONSTRAINT FK_record_member FOREIGN KEY (memberId) REFERENCES member(id) ON DELETE CASCADE
);

INSERT INTO workout (id, nombre, modo, createdAt, updatedAt)
VALUES ('61dbae02-c147-4e28-863c-db7bd402b2d6', 'Tommy V', 'For Time', '2022-04-20', '2022-04-20');

INSERT INTO equipment (nombre, workout) VALUES ('barbell', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO equipment (nombre, workout) VALUES ('rope', '61dbae02-c147-4e28-863c-db7bd402b2d6');

INSERT INTO exercises (nombre, workout) VALUES ('21 thrusters', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO exercises (nombre, workout) VALUES ('12 rope climbs, 15 ft', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO exercises (nombre, workout) VALUES ('15 thrusters', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO exercises (nombre, workout) VALUES ('9 rope climbs, 15 ft', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO exercises (nombre, workout) VALUES ('9 thrusters', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO exercises (nombre, workout) VALUES ('6 rope climbs, 15 ft', '61dbae02-c147-4e28-863c-db7bd402b2d6');

INSERT INTO trainerTips (nombre, workout) VALUES ('Split the 21 thrusters as needed', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO trainerTips (nombre, workout) VALUES ('Try to do the 9 and 6 thrusters unbroken', '61dbae02-c147-4e28-863c-db7bd402b2d6');
INSERT INTO trainerTips (nombre, workout) VALUES ('RX Weights: 115lb/75lb', '61dbae02-c147-4e28-863c-db7bd402b2d6');

INSERT INTO member (id, name, gender, dateOfBirth, email, password)
VALUES (
    '12a410bc-849f-4e7e-bfc8-4ef283ee4b19',
    'Jason Miller',
    'male',
    '23/04/1990',
    'jason@mail.com',
    '$2b$10$0000000000000000000000.fakehashparaejemplo0000000000000000'
);

INSERT INTO record (id, workout, record, memberId)
VALUES (
    'ad75d475-ac57-44f4-a02a-8f6def58ff56',
    '61dbae02-c147-4e28-863c-db7bd402b2d6',
    '160 reps',
    '12a410bc-849f-4e7e-bfc8-4ef283ee4b19'
);

COMMIT;
