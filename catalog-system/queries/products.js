var mysql = require('mysql');

service = {};

service.addItem = addItem;
service.deleteItem = deleteItem;
service.editItem = editItem;
service.getAllItems = getAllItems;
service.getItemById = getItemById

function addItem(name, brand, type, quantity, price, image) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `INSERT INTO Products (name, brand, type, quantity, price, image)
            VALUES (?, ?, ?, ?, ?, ?);`, 
            [name, brand, type, quantity, price, image],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Adding Product Failed"});
                }
                else {
                    resolve({message: "Adding Product Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function deleteItem(id) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `DELETE FROM Products
            where id=?`, 
            [id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Product Delete Failed"});
                }
                else {
                    resolve({message: "Product Delete Successful"})
                }
                
            }
        );
        connection.end();
    })
}

function editItem(id, name, brand, type, quantity, price, image) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `UPDATE Products
            SET name = ?, brand = ?, type = ?, quantity = ?, price = ?, image = ?
            WHERE id = ?;`, 
            [name, brand, type, quantity, price, image, id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Update Failed"});
                }
                else {
                    resolve({message: "Update Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `SELECT * FROM Products`, 
            [],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Products Loading Failed"});
                }
                else {
                    resolve({data: results, message: "Products Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `SELECT * FROM Products
            where id=?`, 
            [id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Product Loading Failed"});
                }
                else {
                    resolve({data: results.length > 0 ? results[0] : null, message: "Product Loading Successful"})
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