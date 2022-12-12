var mysql = require('mysql');
var bcrypt = require('bcryptjs');

service = {};

service.register = register;
service.login = login;
service.updateData = updateData;
service.getAllEmployees = getAllEmployees
service.deleteEmployee = deleteEmployee
service.updateCartData = updateCartData
service.updateUserProfile = updateUserProfile
service.getUserData = getUserData

module.exports = service;


function register(email, password, firstName, lastName, type, address) {
    
    let hash = bcrypt.hashSync(password, 10);

    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `INSERT INTO Accounts (email, hash, firstName, lastName, type, address)
            VALUES (?, ?, ?, ?, ?, ?);`, 
            [email, hash, firstName, lastName, type, address],
            function (error, results, fields) {
                if (error) {
                    console.log(error)
                    if (error.code === 'ER_DUP_ENTRY') reject({message: "Email already taken"})
                    else {
                        reject({message: "Registration Failed"});
                    }
                }
                else {
                    resolve({message: "Registration Successful"})
                }
                
            }
        );
           
        connection.end();
    })

    
}

function login(email, password) {

    let hash = bcrypt.hashSync(password);

    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `SELECT *
            FROM Accounts
            WHERE email=?`, 
            [email],
            function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    if (results.length > 0) {
                        bcrypt.compare(password, results[0].hash, function(err, result) {
                            // result == true
                            if (result) {
                                resolve({...results[0], message: "Login Successful"})
                            }
                            else {
                                reject({message: "Incorrect Username/Password"})
                            }
                        });
                    }
                    else {
                        reject({message: "Incorrect Username/Password"})
                    }
                }
                
            }
        );
           
        connection.end();
    })

}

function updateData(id, firstName, lastName, address, cart) {

    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `UPDATE Accounts
            SET firstName = ?, lastName = ?, address = ?, cart = ?
            WHERE id = ?;`, 
            [firstName, lastName, address, cart, id],
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

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `SELECT * FROM Accounts
            where type='employee'`, 
            [],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Employees Loading Failed"});
                }
                else {
                    resolve({data: results, message: "Employees Loading Successful"})
                }
                
            }
        );
           
        connection.end();
    })
}

function deleteEmployee(id) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `DELETE FROM Accounts
            where id=?`, 
            [id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Employee Delete Failed"});
                }
                else {
                    resolve({message: "Employee Delete Successful"})
                }
                
            }
        );
        connection.end();
    })
    
}

function updateCartData(id, cart) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `UPDATE Accounts
            SET cart = ?
            WHERE id = ?;`, 
            [cart, id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "Cart Change Failed"});
                }
                else {
                    resolve({message: "Added To Cart!"})
                }
                
            }
        );
           
        connection.end();
    })
}

function updateUserProfile(id, firstName, lastName, address) {

    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `UPDATE Accounts
            SET firstName = ?, lastName = ?, address = ?
            WHERE id = ?;`, 
            [firstName, lastName, address, id],
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

function getUserData(id) {
    return new Promise((resolve, reject) => {
        let connection = startMysqlConnectionSequence()
        connection.connect();
        connection.query(
            `SELECT *
            FROM Accounts
            WHERE id=?`, 
            [id],
            function (error, results, fields) {
                if (error) {
                    reject({message: "User Loading Failed"});
                }
                else {
                    resolve({data: results.length > 0 ? results[0] : null, message: "User Loading Successful"})
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