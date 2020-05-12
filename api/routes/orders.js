const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//User Defined
const Order = require("../models/order");
const Idcard = require("../models/idcard");

router.get("/", (req, res, next) => {
    Order.find()
        .select("fieldName status _id")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        fieldName: doc.fieldName,
                        status: doc.status,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post("/", (req, res, next) => {
    // Only create orders on products that exist
    Idcard.findById(req.body.id)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Id Card not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                customerName: req.body.customerName,
                count: req.body.count,
                status: req.body.status
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order stored to Database",
                createdOrder: {
                    _id: result._id,
                    customerName: req.body.customerName,
                    count: req.body.count,
                    status: req.body.status
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:orderId", (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: { productId: "ID", status: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;