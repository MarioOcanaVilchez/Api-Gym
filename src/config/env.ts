import dotenv from "dotenv";

dotenv.config({ path: "./src/config/.env" });

export const env = {
    port:Number(process.env.PORT || 3002)
}