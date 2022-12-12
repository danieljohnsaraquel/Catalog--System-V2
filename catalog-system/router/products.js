var express = require('express');
var router = express.Router();
var productsQuery = require('../queries/products')

router.post('/addItem', function(req, res, next) {

    let {
        name, brand, type, quantity, price, image
    } = req.body

    productsQuery.addItem(name, brand, type, quantity, price, image)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

router.post('/deleteItem', function(req, res, next) {

    let {
        id
    } = req.body

    productsQuery.deleteItem(id)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

router.post('/editItem', function(req, res, next) {

    let {
        id, name, brand, type, quantity, price, image
    } = req.body

    productsQuery.editItem(id, name, brand, type, quantity, price, image)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

router.post('/getAllItems', function(req, res, next) {

    productsQuery.getAllItems()
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

router.post('/getItemById', function(req, res, next) {

    let {
        id
    } = req.body

    productsQuery.getItemById(id)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

module.exports = router;