const mysql = require('mysql2');

var con = mysql.createConnection({
	host:		process.env.MYSQL_HOST,
	port:		process.env.MYSQL_PORT,
	user: 		process.env.MYSQL_USER,
	password:	process.env.MYSQL_PASSWORD,
	database:	process.env.MYSQL_DATABASE,
});

// loop if fails to connect
function connect() {
	con.connect((err) => {
		if (err) {
			console.error(err);
			console.log('Connection to MySQL failed. Retrying in 2 seconds...');
			setTimeout(connect, 2*1000);	// try again in 2 seconds
		} 
		else console.log(`Connected to MySQL on ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}!`);
	});
}

connect();

con.on('error', function(err) {
	console.log('db error', err);
	if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') 
		connect();
	else
		throw err;
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
			con.query('SELECT * FROM Cliente WHERE correo = ? AND password = ? LIMIT 1', [email, password], (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	},
	getClientById: (id) => {
		return new Promise((resolve, reject) => {
			con.query('SELECT * FROM Cliente WHERE id_cliente = ? LIMIT 1', [id], (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	},

	getClientByEmail: (correo) => {
		return new Promise((resolve, reject) => {
			con.query('SELECT * FROM Cliente WHERE correo = ? LIMIT 1', [correo], (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	},
	
	// create new user with validation
	createClient: (nombre, apellidoP, apellidoA, celular, correo, password, id_tipoUsuario) => {
		return new Promise((resolve, reject) => {
			// check if email is already in use
			db.getClientByEmail(correo).then((results) => {
				if (results.length > 0) reject('Correo ya en uso');
				else {
					// create new user
					con.query('INSERT INTO Cliente VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidoP, apellidoA, celular, correo, password, id_tipoUsuario], (err, results) => {
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