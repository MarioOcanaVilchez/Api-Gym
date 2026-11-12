import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

/**
 * Configura la documentación Swagger para la API
 * @param app - Instancia de Express
 * @param port - Puerto donde corre el servidor
 */
const swaggerDocs = (app: Express, port: number): void => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: { title: "Crossfit WOD API", version: "1.0.0" },
      servers: [{ url: `http://localhost:${port}` }],
    },
    apis: ["src/controller/controller.ts", "src/types/workout.ts"],
  } as const;

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/v1/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `📓 Version 1 Docs are available at http://localhost:${port}/api/v1/docs`
  );
};

export { swaggerDocs };