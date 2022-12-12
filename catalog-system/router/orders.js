var express = require('express');
var router = express.Router();
var ordersQuery = require('../queries/orders')

router.post('/addOrder', function(req, res, next) {

    let {
        recipient, status, products, eta
    } = req.body

    ordersQuery.addOrder(recipient, status, products, eta)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

router.post('/getAllOrdersOfRecipient', function(req, res, next) {

    let {
        id
    } = req.body

    ordersQuery.getAllOrdersOfRecipient(id)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

router.post('/getAllOrders', function(req, res, next) {
    ordersQuery.getAllOrders()
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })
})

router.post('/updateStatus', function(req, res, next) {
    let {
        id, status
    } = req.body

    ordersQuery.updateStatus(id, status)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })
})

router.post('/updateETA', function(req, res, next) {
    let {
        id, eta
    } = req.body

    ordersQuery.updateETA(id, eta)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })
})




module.exports = router;