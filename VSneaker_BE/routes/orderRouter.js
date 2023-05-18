const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/submit-order", async (req, res) => {
    try {
        const { userId, customerName, phone, shippingAddress, shippingMethodId, products } =
            req.body;
        var sql =
            "INSERT INTO vsneaker.order_table (Order_date, User_ID, Customer_name, Phone" +
            " ,Shipping_address, Shipping_method_ID, Order_status_ID, Payment_method)" +
            " VALUES (NOW(), ?, ?, ?, ?, ?, '1', 'Thanh toán khi nhận hàng');";
        var value = [userId, customerName, phone, shippingAddress, shippingMethodId];
        const [rows] = await db.query(sql, value);
        const orderId = rows.insertId;

        for (product of products) {
            var sql =
                "INSERT INTO vsneaker.order_line (Product_ID, Order_ID, Quantity, Price, Size)" +
                " VALUES (?, ?, ?, ?, ?); ";
            var value = [product.ID, orderId, product.Quantity, product.discountedPrice, product.Size];
            await db.query(sql, value);
        }

        return res.json({ order: true });
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get("/orderdetail/:orderId", async (req, res) => {
    try {
        var sql =
            "SELECT p.Product_name, p.Sku, p.Product_IMG, ol.Quantity, ol.Price, ol.Size" +
            " FROM vsneaker.order_line ol" +
            " JOIN vsneaker.product p on p.ID = ol.Product_ID" +
            " WHERE ol.Order_ID = ?;";
        const [rows] = await db.query(sql, [req.params.orderId]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// show tat ca cac don hang theo Id cua user
router.get("/:userId", async (req, res) => {
    try {
        var sql =
            "SELECT ol.ID, p.Product_name, p.Product_IMG, ol.Order_ID, ol.Quantity, ol.Price, ol.Size" +
            " FROM vsneaker.order_line ol" +
            " JOIN vsneaker.order_table ot ON ot.ID = ol.Order_ID" +
            " JOIN vsneaker.product p ON p.ID = ol.Product_ID" +
            " WHERE ot.User_ID = ?;";
        const [rows] = await db.query(sql, [req.params.userId]);

        const result = rows.reduce((orders, obj) => {
            const orderId = obj.Order_ID;
            const foundIndex = orders.findIndex((item) => item.orderId === orderId);
            if (foundIndex === -1) {
                orders.push({ orderId, detail: [obj] });
            } else {
                orders[foundIndex].detail.push(obj);
            }
            return orders;
        }, []);

        return res.json(result);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//api cho admin
router.get("/:userId/all", async (req, res) => {
    try {
        var sql =
            "SELECT ot.ID, ot.Order_date, ot.Customer_name, ot.Phone, ot.Shipping_address, sm.Name, ot.Total" +
            " FROM vsneaker.order_table ot" +
            " JOIN vsneaker.shipping_method sm on sm.ID = ot.Shipping_method_ID" +
            " WHERE ot.User_ID = ?;";
        const [rows] = await db.query(sql, [req.params.userId]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
