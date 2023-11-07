const Order = require('../models/OrderModel');
const User = require('../models/UserModel');

// GET /api/orders
const getListOrder = (req, res, next) => {
    Order.find()
        .then((orders) => {
            res.json({
                data: orders,
                message: 'success',
            })
        })
}

// GET /api/orders/filter?filter=&value=
const getFilterOrder = (req, res, next) => {

    let filters = [];
    let values = [];

    filters = filters.concat(req.query.filter);
    values = values.concat(req.query.value);


    const query = {};
    for (let i = 0; i < filters.length; i++) {
        isNaN(values[i]) ? query[filters[i]] = values[i] :
            query[filters[i]] = { $lt: Number(values[i]) }
    }

    Order.find(query)
        .then((ordersFilter) => {
            res.json({
                data: ordersFilter,
                message: 'success',
            })
        })
}

// GET /api/orders/:id
const getOneOrder = (req, res, next) => {
    Order.findById(req.params.id)
        .then((order) => {
            res.json({
                data: order,
                message: 'success',
            })
        })
}

// GET /api/orders/:id/detail
const getDetailOrder = (req, res, next) => {
    Order.findById(req.params.id)
        .then((order) => {
            res.json({
                data: order.detail,
                message: 'success',
            })
        })
}

// POST /api/orders
const addOrder = (req, res, next) => {

    let order = new Order({
        id_customer: req.body.id_customer,
        name: req.body.name,
        account: req.body.account,
        phone: req.body.phone,
        address: req.body.address,
        total_pay: Number(req.body.total_pay),
        detail: req.body.detail,
        payments: {
            cod: req.body.payments === "cod",
            shop: req.body.payments === "shop",
        },
    })
        .save()
        .then((order) => {
            User.updateOne({ _id: order.id_customer }, {
                $inc: {
                    total_pay: order.total_pay,
                    total_order: 1,
                    total_point: order.total_pay / 10000
                },
                $push: {
                    list_orders: {
                        id_order: order._id,
                        total_pay: order.total_pay
                    },
                }
            })
                .then(() => {
                    res.status(200).json({
                        message: 'success'
                    });
                })
        })
        .catch(next)
}

// PUT /api/orders/:id
const updateStatusOrder = (req, res, next) => {
    Order.updateOne({ _id: req.params.id }, {
        $set: {
            status: {
                confirmed: true,
                wait_confirm: false
            }
        }
    })
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })
}

module.exports = {
    getListOrder,
    getFilterOrder,
    getOneOrder,
    getDetailOrder,
    addOrder,
    updateStatusOrder
}