const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');
const discountRouter = require('./discountRouter');
const categoryRouter = require('./categoryRouter');

function route(app) {
    app.use("/product", productRouter);
    app.use("/user", userRouter);
    app.use("/cart", cartRouter);
    app.use("/order", orderRouter);
    app.use("/discount", discountRouter);
    app.use("/category", categoryRouter);
}

module.exports = route;
