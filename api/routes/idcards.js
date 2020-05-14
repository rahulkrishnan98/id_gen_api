const express = require('express');
const router = express.Router();
const Idcard = require('../models/idcard');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/authenticate');
// All idCards information - Including count etc
// exec makes it a true promise, in case of save, its 
// Behaviour is promise by default.

router.get('/', checkAuth, (req, res, next) => {
    Idcard.find().select("_id fieldName").exec().then(docs => {
        const response = {
            id_count: docs.length,
            idcards: docs.map(doc => {
                return {
                    _id: doc._id,
                    fieldName: doc.fieldName,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/idcards/' + doc._id
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
    const idcard = new Idcard({
        _id: new mongoose.Types.ObjectId(),
        designFile: req.body.designFile,
        fieldName: req.body.fieldName
    });
    idcard.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created ID card",
            createdID: {
                _id: result._id,
                fieldName: result.fieldName,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/idcards/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Idcard.findById(id)
        .select('_id fieldName')
        .exec()
        .then(doc => {
            console.log("Fetching from Database", doc);
            if (doc) {
                res.status(200).json({
                    idcard: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/idcards/' + doc._id
                    }
                });
            } else {
                res.status(404).json({
                    message: "No entry found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:cardId', checkAuth, (req, res, next) => {
    const id = req.params.cardId;
    const updateOps = {};

    //What attributes need to be updated
    for (const ops of Object.keys(req.body)) {
        console.log(ops);
        updateOps[ops] = req.body[ops];
    }

    Idcard.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Updated id_card info in database',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/idcards/' + id
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:cardId', checkAuth, (req, res, next) => {
    const id = req.params.cardId;
    Idcard.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'ID deleted from Database',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/idcards',
                    body: { fieldName: 'String', designFile: "String" }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;