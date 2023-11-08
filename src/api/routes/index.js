const adminRouter = require("./admins");
const userRouter = require("./users");
const productRouter = require("./products");
const categoryRouter = require("./category");
const orderRouter = require("./order");
const evaluateRouter = require("./evaluate")
const promoteRouter = require("./promote")

function route(app) {

    app.use("/api/admins", adminRouter);
    app.use("/api/users", userRouter);
    app.use("/api/products", productRouter);
    app.use("/api/categorys", categoryRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/evaluates", evaluateRouter);
    app.use("/api/promotes", promoteRouter);
}

module.exports = route;
