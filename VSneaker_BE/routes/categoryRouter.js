const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all", async (req, res) => {
    try {
        const sql =
            "Select ID, Category_name" +
            " from vsneaker.category";
        const [rows] = await db.query(sql);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;