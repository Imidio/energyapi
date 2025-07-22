import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionRoute from "./routes/transactionRoute.js";
import job from "./config/cron.js";
// Load environment variables
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// Middleware
app.use(rateLimiter)
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});


app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5001;

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log("Base de dados Inicializada com Sucesso");
    } catch (err) {
        console.error("Falha ao inicializar a base de dados, Detalhes: ", err);
        process.exit(1);
    }
}

app.use("/api/transactions", transactionRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor inicializado com sucesso na porta ${PORT}`);
    });
});
