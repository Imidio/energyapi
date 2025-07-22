import express from "express"
import { sql } from "../config/db.js";
import {getTransactionsByUserId, createTransaction, deleteTransaction, getTransactionsSummary} from "../controllers/transactionsController.js"

const router = express.Router()

router.get("/:userId", getTransactionsByUserId);
/* router.get("/:userId", async (req, res) => {
    try {

        const { userId } = req.params
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} order by created_at DESC
        `;
        res.status(200).json(transactions);

    } catch (error) {
        console.error("Error while creating transaction:", error);
        return res.status(500).json({ error: "Failed to select transaction." });

    }
}) */

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId",getTransactionsSummary)

router.post("/", createTransaction);

export default router