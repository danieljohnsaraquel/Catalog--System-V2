const express = require('express')
var cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express()

var accounts = require('./router/accounts')
var products = require('./router/products')
var orders = require('./router/orders')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json({ extended: false , limit: '100mb'}));
app.use(express.urlencoded({ extended: false , limit: '100mb'}));
app.use(cookieParser());

app.use('/accounts', accounts);
app.use('/products', products);
app.use('/orders', orders);

app.listen(3001, (req, res) => console.log('running'))