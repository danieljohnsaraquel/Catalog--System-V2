var mysql = require('mysql');

service = {};

service.addOrder = addOrder;
service.getAllOrdersOfRecipient = getAllOrdersOfRecipient;
service.getAllOrders = getAllOrders
service.updateStatus = updateStatus
service.updateETA = updateETA

function addOrder(recipient, status, products, eta) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `INSERT INTO Orders (recipient, status, products, eta)
            VALUES (?, ?, ?, ?);`, 
            [recipient, status, products, eta],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Order Failed"});
                }
                else {
                    resolve({message: "Order Successful!"})
                }
                
            }
        );
           
        connection.end();
    })
}

function getAllOrdersOfRecipient(id) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `SELECT * FROM Orders
            where recipient=?
            order by id DESC`, 
            [id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Orders Loading Failed"});
                }
                else {
                    resolve({data: results, message: "Orders Loading Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function getAllOrders() {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `SELECT * FROM Orders
            order by id DESC`, 
            [],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Orders Loading Failed"});
                }
                else {
                    resolve({data: results, message: "Orders Loading Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function updateStatus(id, status) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `UPDATE Orders
            SET status = ?
            WHERE id = ?;`, 
            [status, id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Update Status Failed"});
                }
                else {
                    resolve({message: "Update Status Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function updateETA(id, eta) {
    return new Promise((resolve, reject) => {
        let date = new Date(eta)
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `UPDATE Orders
            SET eta = ?
            WHERE id = ?;`, 
            [date, id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Update Status Failed"});
                }
                else {
                    resolve({message: "Update Status Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function startMysqlConnectionSequence() {
    var connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port     : process.env.DB_PORT
    });

    return connection
}

module.exports = service;