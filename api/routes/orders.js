const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/order");
const Idcard = require("../models/idcard");


//Handling incoming requests
router.get('/', (req, res, next) => {

});

router.post('/', (req, res, next) => {
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
module.exports = router;