import express from "express";
import type { Express, Request, Response } from "express";
import { env } from "./src/config/env";
import v1RouterWorkouts from "./src/v1/routesWorkouts";
import v1RouterMembers from "./src/v1/routesMember";
import v1RouterRecords from "./src/v1/routesRecords";
import v1apiKey from "./src/v1/apiKey";
import { swaggerDocs } from "./src/v1/swagger/swagger";
import cors from "cors";

const app: Express = express();
app.use(cors());

app.use(express.json());
app.use("/api/v1/workouts", v1RouterWorkouts);
app.use("/api/v1/members", v1RouterMembers);
app.use("/api/v1/records", v1RouterRecords);
app.use("/api/v1/apiKey", v1apiKey);

// Swagger Documentation
swaggerDocs(app, env.port);

app.listen(env.port, () => console.log(`Servidor en el puerto ${env.port}`));
