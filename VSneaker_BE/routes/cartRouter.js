const express = require("express");
const router = express.Router();
const db = require("../db");

router.delete("/delete/:id", async (req, res) => {
    try {
        const sql = "DELETE FROM vsneaker.shopping_cart_item WHERE ID = ?;";
        await db.query(sql, [req.params.id]);
        return res.json({ delete: true });
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post("/:id/add-to-cart", async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        var sql = "CALL vsneaker.add_to_cart(?, ?, ?, ?);";
        await db.query(sql, [req.params.id, productId, size, quantity]);
        return res.json({ add: true });
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        var sql =
            "SELECT sci.ID as cartItemId, p.ID, p.Product_name, p.Sku, p.Product_IMG, sci.Size, p.Price as originalPrice," +
            " d.Discount_percent, CONVERT(FLOOR(p.Price*(100-d.Discount_percent)/100), UNSIGNED) as discountedPrice, sci.Quantity," +
            " sci.Quantity, CONVERT(FLOOR(p.Price*(100-d.Discount_percent)/100 * sci.Quantity), UNSIGNED) as Amount" +
            " FROM vsneaker.shopping_cart_item sci" +
            " JOIN vsneaker.product p ON p.ID = sci.Product_ID" +
            " JOIN vsneaker.discount d ON d.ID = p.Discount_ID" +
            " WHERE sci.USer_ID = ?;";
        const [rows, fields] = await db.query(sql, [req.params.id]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
