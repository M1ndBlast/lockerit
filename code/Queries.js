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
			console.log('Error. Intentando de nuevo...');
			setTimeout(connect, 2*1000);	// try again in 2 seconds
		}
		else console.log(`Conectado a BD!`);
	});
}

connect();

con.on('error', function (err) {
	console.log('Error', err);
	if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
		connect();
	} else {
		throw err;
	}
});

// Here goes MySQL queries

const bd = {
	ROL_ADMIN: 1,
	ROL_REPARTIDOR: 2,
	ROL_CLIENTE: 3,

	/**
	 * @param {string} email 
	 * @param {string} contra 
	 * @returns {Promise}
	 */
	iniciarSesion: (email, contra) => {
		return new Promise((resolve, reject) => {
			con.query('SELECT * FROM User WHERE em_usr = ? AND pwd_usr = ? LIMIT 1', [email, contra], (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	},
	// get all users
	usuarios: () => {
		return new Promise((resolve, reject) => {
			con.query('SELECT * FROM User', (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	},
	// get user by id
	usuarioId: (id) => {
		return new Promise((resolve, reject) => {
			con.query('SELECT * FROM User WHERE id_usr = ? LIMIT 1', [id], (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	},
	usuarioEmail: (email) => {
		return new Promise((resolve, reject) => {
			con.query('SELECT * FROM User WHERE em_usr = ? LIMIT 1', [email], (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	},

	// create new user with validation
	crearCuenta: (nom, email, tel, contra, type) => {
		return new Promise((resolve, reject) => {
			// check if email is already in use
			bd.usuarioEmail(email).then((results) => {
				if (results.length > 0) reject('Correo ya en uso');
				else {
					// create new user
					con.query('INSERT INTO User VALUES (NULL, ?, ?, ?, ?, ?)', [nom, email, tel, contra, type], (err, results) => {
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

module.exports = bd;