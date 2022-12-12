var express = require('express');
var router = express.Router();
var accountsQuery = require('../queries/accounts')

 
router.post('/register', function(req, res, next) {

    let email = req.body.email
    let password = req.body.password
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let type = req.body.type
    let address = req.body.address

    accountsQuery.register(email, password, firstName, lastName, type, address)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

});

router.post('/login', function(req, res, next) {

    let email = req.body.email
    let password = req.body.password

    accountsQuery.login(email, password)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

})

router.post('/updateData', function(req, res, next) {

    let id = req.body.id
    let address = req.body.address
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let cart = req.body.cart

    accountsQuery.updateData(id, firstName, lastName, address, cart)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

})

router.post('/getAllEmployees', function(req, res, next) {

    accountsQuery.getAllEmployees()
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

})

router.post('/deleteEmployee', function(req, res, next) {

    let id = req.body.id

    accountsQuery.deleteEmployee(id)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

})

router.post('/updateCartData', function(req, res, next) {

    let id = req.body.id
    let cart = req.body.cart

    accountsQuery.updateCartData(id, cart)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        console.log(err)
        res.status(400).send(err)
    })

})

router.post('/updateUserProfile', function(req, res, next) {

    let id = req.body.id
    let address = req.body.address
    let firstName = req.body.firstName
    let lastName = req.body.lastName

    accountsQuery.updateUserProfile(id, firstName, lastName, address)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

})

router.post('/getUserData', function(req, res, next) {

    let id = req.body.id

    accountsQuery.getUserData(id)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        res.status(400).send(err)
    })

})

module.exports = router;