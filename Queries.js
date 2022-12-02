const mysql = require('mysql2');

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

// loop if fails to connect
function connect() {
    con.connect((err) => {
        if (err) {
            console.error(err);
            console.log('Connection to MySQL failed. Retrying in 2 seconds...');
            // setTimeout(connect, 2*1000);	// try again in 2 seconds
        }
        else console.log(`Connected to MySQL on ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}!`);
    });
}

connect();

con.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connect();
    } else {
        throw err;
    }
});

// Here goes MySQL queries

const db = {
    // Roles
    ROLES: {
        ADMIN: 1,
        DELIVERY: 2,
        CLIENT: 3,
    },
    /**
         * 
               * @param {string} email 
                   * @param {string} password 
                       * @returns {Promise}
                           */
    checkCredentials: (email, password) => {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM User WHERE em_usr = ? AND pwd_usr = ? LIMIT 1', [email, password], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },
    // get all users
    getUsers: () => {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM User', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },
    // get user by id
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM User WHERE id_usr = ? LIMIT 1', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },
    getUSerByEmail: (email) => {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM User WHERE em_usr = ? LIMIT 1', [email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    // create new user with validation
    createUser: (name, email, tel, password, type) => {
        return new Promise((resolve, reject) => {
            // check if email is already in use
            db.getUSerByEmail(email).then((results) => {
                if (results.length > 0) reject('Correo ya en uso');
                else {
                    // create new user
                    con.query('INSERT INTO User VALUES (NULL, ?, ?, ?, ?, ?)', [name, email, tel, password, type], (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
};


// End of queries

module.exports = db;