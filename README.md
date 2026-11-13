# 🏋️‍♂️ CrossFit WOD & Gym REST API

API RESTful desarrollada con **Node.js**, **Express 5** y **TypeScript** para la gestión de entrenamientos (*Workouts / WODs*), miembros y récords de gimnasio, documentada con **Swagger (OpenAPI 3.0)**.

---

## 🚀 Tecnologías utilizadas

- **Runtime & Lenguaje:** Node.js + TypeScript (`tsx`)
- **Framework Web:** Express 5
- **Documentación interactiva:** Swagger UI (`swagger-jsdoc` + `swagger-ui-express`)
- **Rendimiento y Seguridad:** Caché en rutas con `apicache`, `cors` y `helmet`

---

## 📦 Instalación y puesta en marcha

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MarioOcanaVilchez/Api-Gym.git
   cd Api-Gym
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `src/config/.env` a partir de `src/config/.env.example`:
   ```env
   PORT=3024
   ```

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📚 Documentación Swagger (OpenAPI 3.0)

Con el servidor en marcha, puedes consultar y probar todos los endpoints desde el navegador en:

- **Swagger UI:** `http://localhost:3024/api/v1/docs`
- **Especificación JSON:** `http://localhost:3024/api/v1/docs.json`

---

## 🛣️ Endpoints principales (`/api/v1`)

| Recurso | Ruta base | Descripción |
| :--- | :--- | :--- |
| **Workouts** | `/api/v1/workouts` | CRUD completo de entrenamientos (WODs) y filtrado por modo/equipamiento |
| **Members** | `/api/v1/members` | Gestión de miembros registrados en el gimnasio |
| **Records** | `/api/v1/records` | Consulta y registro de marcas personales por entrenamiento |
| **API Key** | `/api/v1/apiKey` | Generación y validación de claves de acceso a la API |
