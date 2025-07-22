
export async function getTransactionsByUserId(params) {
    try {
        const { userId } = req.params;
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

        resizeBy.status(200).json(transactions);

    } catch (error) {
        console.log("Erro buscando dados");
        resizeBy.status(500).json({ message: "Internal Server Err" });
    }
}

export async function createTransaction(req, res) {
    const { title, amount, category, user_id } = req.body;

    // Validate the request body
    if (!title || !amount || !category || !user_id) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const result = await sql`
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING id;
            `;

        return res.status(201).json({
            message: "Transaction created successfully",
            transactionId: result[0].id,
        });
    } catch (error) {
        console.error("Error while creating transaction:", error);
        return res.status(500).json({ error: "Failed to create transaction." });
    }
}
export async function deleteTransaction(req, res){
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" })
        }
        await sql`
                DELETE FROM transactions WHERE id = ${id} RETURNING *    
            `
        if (result.length === 0) {
            return res.status(404).json({ message: "Não encontrado!!" })
        }
        res.status(200).json({ message: "Deletado com sucesso!!" })
    } catch (error) {
        console.error("Error while creating transaction:", error);
        return res.status(500).json({ error: "Failed to delete transaction." });

    }
}

export async function getTransactionsSummary(req, res){
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(sum(amount),0) as balance FROM transactions where user_id=${userId}
        `;

        const incomeREsult = await sql`
            SELECT COALESCE(sum(amount),0) as income FROM transactions where user_id=${userId}
            and amount>0
        `;

        const expensesResult = await sql`
            SELECT COALESCE(sum(amount),0) as income FROM transactions where user_id=${userId}
            and amount<0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeREsult[0].balance,
            expenses: expensesResult[0].balance,

        })

    } catch (error) {
        console.error("Error while creating transaction:", error);
        return res.status(500).json({ error: "Failed to delete transaction." });

    }
}