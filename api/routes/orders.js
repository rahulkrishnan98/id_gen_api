const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/order");
const Idcard = require("../models/idcard");
const checkAuth = require('../middleware/authenticate');

//Handling incoming requests
router.get('/', checkAuth, (req, res, next) => {
    Order.find().select("_id organizationName").exec().then(docs => {
        const response = {
            order_count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    organizationName: doc.organizationName,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                };
            })
        };
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.post('/', checkAuth, (req, res, next) => {
    const promisedMap = new Promise(function (resolve, reject) {
        var idArray = [];
        req.body.orderItem.map(async product => {
            try {
                const idcard = await Idcard.findById(product)
                //Can return []
                if (!idcard) {
                    reject({
                        status: 404,
                        message: "ID card not in DB"
                    })
                }
                idArray.push(idcard);
                if (idArray.length === req.body.orderItem.length) {
                    resolve(idArray);
                }

            }
            catch (err) {
                console.log(err);
                reject({
                    status: 500,
                    message: "Fetch Failed"
                })
            }
        });


    })
    promisedMap.then(idArray => {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            orderItem: idArray,
            organizationName: req.body.organizationName
        });
        order.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Successfully Added Order',
                result,

            })
        })
    }, function (response) {
        res.status(response.status).json({
            message: response.message
        });
    })

});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Idcard.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'ID deleted from Database',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { organizationName: 'String', orderItem: "idCardArray" }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;