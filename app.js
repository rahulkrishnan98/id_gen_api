const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Schemas
const idcardRoutes = require("./api/routes/idcards");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

//DB 
mongoose.connect(
    'mongodb+srv://rahul:' + process.env.MONGO_ATLAS_PW + '@cluster0-bhsht.mongodb.net/test?retryWrites=true&w=majority',
    {
        // useMongoClient: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);

mongoose.Promise = global.Promise;

//Middle-ware
app.use(morgan("dev")); //Logging
app.use('/uploads/', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //Makes JSON data readable

//Which headers to append to all your responses
app.use((req, res, next) => {
    //For our Methods
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept, Authorization'
    );
    //Options req
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({})
    }
    next();
});
//My Routes
app.use('/idcards', idcardRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//Error Handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Handle all errors from everywhere
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;