const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all", async (req, res) => {
  try {
    const sql =
      "Select Pr.ID, Pr.Product_name, Pr.Product_IMG, Pr.Description ,Pr.Price, Pr.Sku, Di.Discount_name, Di.Discount_percent" +
      " from product as Pr" +
      " join discount as Di on Pr.discount_ID = Di.ID" +
      " group by Pr.ID";
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { categoryId, productName, sku, description, productImg, price } = req.body;
    const sql =
      "INSERT INTO vsneaker.product (`Category_ID`, `Discount_ID`, `Product_name`, `Sku`, `Description`, `Product_IMG`, `Price`)" +
      " VALUES (?, ?, ?, ?, ?, ?, ?);";
    const value = [categoryId, 1, productName, sku, description, productImg, price];
    await db.query(sql, value);
    return res.json({ add: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const { categoryId, productName, sku, description, productImg, price } = req.body;
    const sql =
      "UPDATE vsneaker.product SET `Category_ID` = ?, `Product_name` = ?" +
      ", `Sku` = ?, `Description` = ?, `Product_IMG` = ?, `Price` = ?" +
      " WHERE ID = ?;";
    const value = [categoryId, productName, sku, description, productImg, price, req.params.id];
    await db.query(sql, value);
    return res.json({ update: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/add-to-stock/:id", async (req, res) => {
  try {
    const arr = req.body;
    for (let product of arr) {
      var sql = "Select * from variation_size where Product_ID = ? and Size = ?";
      var [result] = await db.query(sql, [req.params.id, product.size]);

      if (result.length > 0) {
        var sql = "UPDATE variation_size SET Quantity = Quantity + ? WHERE Product_ID = ? and Size = ?";
        await db.query(sql, [product.quantity, req.params.id, product.size]);
      } else {
        var sql = "INSERT INTO variation_size (`Product_ID`, `Size`, `Quantity`) VALUES (?, ?, ?)";
        await db.query(sql, [req.params.id, product.size, product.quantity]);
      }
    }
    return res.json({ addToStock: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/show", async (req, res) => {
  try {
    var startFrom = Number(req.query.offset) * 12;
    var sql = "select count(*) as count from product;";
    var [[result]] = await db.query(sql);
    var sql =
      "Select Pr.ID, Pr.Product_name, Pr.Product_IMG, Pr.Description ,Pr.Price, Pr.Sku, Di.Discount_name, Di.Discount_percent" +
      " from product as Pr" +
      " join discount as Di on Pr.discount_ID = Di.ID" +
      " group by Pr.ID order by Pr.ID asc" +
      " limit 12 offset ? ;";
    var [products] = await db.query(sql, [startFrom]);
    return res.json({ countPage: Math.ceil(result.count / 12), products });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/filter", async (req, res) => {
  try {
    var startFrom = Number(req.query.offset) * 12;
    var { brands, price, sizes, sale } = req.body;

    var brandSQL = " and ca.Brand NOT IN (?)";
    if (brands.length > 0) brandSQL = " and ca.Brand IN (?)";
    else brands = "";

    var sizeSQL = " and vs.Size NOT IN (?)";
    if (sizes.length > 0) sizeSQL = " and vs.Size IN (?)";
    else sizes = "";

    // Check xem có giảm giá hay không
    var saleSQL = " and d.Discount_percent>=0";
    if (sale) {
      saleSQL = " and d.Discount_percent>0";
    }
    // Check lọc theo giá
    var priceMax;
    if (price === null) {
      priceMax = 999999999;
    } else {
      priceMax = price;
    }
    var sql =
      "Select p.ID, p.Product_name, p.Product_IMG, p.Description ,p.Price, p.Sku, d.Discount_name, d.Discount_percent" +
      " from product p" +
      " join category ca on ca.ID = p.Category_ID" +
      " join variation_size vs on vs.Product_ID = p.ID" +
      " join discount d on p.discount_ID = d.ID where price <=?" +
      saleSQL +
      brandSQL +
      sizeSQL +
      " group by p.ID order by p.ID asc";

    var sql1 = "Select count(*) as count from (" + sql + ") as fpl;";
    var [[result]] = await db.query(sql1, [priceMax, brands, sizes]);

    var sql2 = sql + " limit 12 offset ? ";
    const [products] = await db.query(sql2, [priceMax, brands, sizes, startFrom]);

    return res.json({ countPage: Math.ceil(result.count / 12), products });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const sql = "CALL vsneaker.product_detail(?);";
    const [[[detail], sizes, fields]] = await db.query(sql, [req.params.id]);
    return res.json({ detail, sizes });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
