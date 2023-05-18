const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all-accounts", async (req, res) => {
  try {
    var startFrom = Number(req.query.offset) * 12;
    var sql = "select count(*) as count from vsneaker.user where User_type != 'admin';";
    var [[result]] = await db.query(sql);
    var sql = "Select * from vsneaker.user where User_type != 'admin' limit 12 offset ?;";
    var [accounts] = await db.query(sql, [startFrom]);
    return res.json({ countPage: Math.ceil(result.count / 12), accounts });
  } catch (err) {
    return res.status(500).json("error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    var sql = "SELECT * FROM user WHERE username=? and password=?;";
    const [profile, fields] = await db.query(sql, [username, password]);
    if (profile.length > 0) {
      return res.json({ login: true, profile });
    }
    return res.json({ login: false });
  } catch (err) {
    return res.status(500).json("error");
  }
});

router.post("/logout", (req, res) => res.json({ login: false }));

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    var sql = "SELECT * FROM user WHERE username=?;";
    var [rows, fields] = await db.query(sql, [username]);
    if (rows.length > 0) {
      return res.json({ register: false });
    }
    var sql = "INSERT INTO user (Username, Password, User_type) VALUES (?, ?, 'customer');";
    var [rows, fields] = await db.query(sql, [username, password]);
    return res.json({ register: true });
  } catch (err) {
    return res.status(500).json("error");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { username, password, firstName, lastName, phone, address, role } = req.body;
    var sql =
      "INSERT INTO vsneaker.user (`Username`, `Password`, `First_name`, `Last_name`, `Phone`, `Address`, `User_type`)" +
      " VALUES (?, ?, ?, ?, ?, ?, ?); ";
    var value = [username, password, firstName, lastName, phone, address, role]
    await db.query(sql, value);
    return res.json({ add: true });
  } catch (err) {
    return res.status(500).json("error");
  }
});

router.put("/:id/edit", async (req, res) => {
  try {
    const { username, password } = req.body;
    var sql = "UPDATE user SET Username = ?, Password = ? WHERE ID = ?;";
    const [profile, fields] = await db.query(sql, [username, password, req.params.id]);
    return res.json({ update: true });
  } catch (err) {
    return res.status(500).json("error");
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    var sql = "DELETE FROM vsneaker.user WHERE ID = ?;";
    await db.query(sql, [req.params.id]);
    return res.json({ delete: true });
  } catch (err) {
    return res.status(500).json("error");
  }
});

router.get("/:id/account", async (req, res) => {
  try {
    var sql = "select Username, Password from vsneaker.user where ID = ?;";
    var [[result]] = await db.query(sql, [req.params.id]);
    return res.json(result);
  } catch (err) {
    return res.status(500).json("error");
  }
});

module.exports = router;
