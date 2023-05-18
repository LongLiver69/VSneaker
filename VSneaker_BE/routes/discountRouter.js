const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all", async (req, res) => {
  try {
    const sql = "SELECT * FROM vsneaker.discount;";
    const [discount] = await db.query(sql);
    return res.status(200).json(discount);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { discountName, description, discountPercent, startAt, endAt } = req.body;
    const sql =
      "INSERT INTO vsneaker.discount (`Discount_name`, `Description`, `Discount_percent`, `Start_at`, `End_at`)" +
      " VALUES (?, ?, ?, ?, ?);";
    const value = [discountName, description, discountPercent, startAt, endAt];
    await db.query(sql, value);
    return res.status(200).json({ add: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const { discountName, description, discountPercent, startAt, endAt } = req.body;
    const sql =
      "UPDATE vsneaker.discount SET `Discount_name` = ?, `Description` = ?, `Discount_percent` = ?, `Start_at` = ?, `End_at` = ?" +
      " WHERE ID = ?;";
    const value = [discountName, description, discountPercent, startAt, endAt, req.params.id];
    await db.query(sql, value);
    return res.status(200).json({ update: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    var sql = "UPDATE product SET `Discount_ID` = 1 WHERE Discount_ID = ?;"
    await db.query(sql, [req.params.id]);
    
    var sql = "DELETE FROM vsneaker.discount WHERE ID = ?;";
    await db.query(sql, [req.params.id]);
    return res.json({ delete: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/apply-code", async (req, res) => {
  try {
    const { discountId, products } = req.body;
    const sql = "UPDATE vsneaker.product SET Discount_ID = ? WHERE ID IN (?);";
    const value = [discountId, products];
    await db.query(sql, value);
    return res.status(200).json({ apply: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
