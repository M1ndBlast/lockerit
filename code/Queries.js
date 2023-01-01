const mysql = require('mysql2');
const MSG = require('./Messages');

const con = mysql.createConnection({
	host:		process.env.MYSQL_HOST,
	port:		process.env.MYSQL_PORT,
	user: 		process.env.MYSQL_USER,
	password:	process.env.MYSQL_PASSWORD,
	database:	process.env.MYSQL_DATABASE,
});
const errorDBConnection = new Error('Sin conexión a la base de datos.');
var isConnected = false;

con.on('error', async function(err) {
	isConnected = false;
	console.error('db error', err);
	if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
		console.log('Connection to MySQL failed. Retrying in 5 seconds...');
		setTimeout(() => {console.log('sending again');con.connect()}, 5*1000);	// try again in 2 seconds
	}
	else
		throw err;
}).on('connect', function(err) {
	isConnected = true;
	console.info(`Connected to MySQL on ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}!`)
});

con.connect();

const db = {
	// Roles
	ROLES: {
		ADMIN: 1,
		DELIVER: 2,
		CLIENT: 3,
	},


	/* 
	+------------+-------------+------+-----+---------+----------------+
	| costumer                                                         |
	+------------+-------------+------+-----+---------+----------------+
	| Field      | Type        | Null | Key | Default | Extra          |
	+------------+-------------+------+-----+---------+----------------+
	| id_cos     | int         | NO   | PRI | NULL    | auto_increment |
	| nam_cos    | varchar(45) | NO   |     | NULL    |                |
	| patsur_cos | varchar(45) | NO   |     | NULL    |                |
	| matsur_cos | varchar(45) | NO   |     | NULL    |                |
	| tel_cos    | varchar(10) | NO   |     | NULL    |                |
	| em_cos     | varchar(60) | NO   |     | NULL    |                |
	| pas_cos    | varchar(16) | NO   |     | NULL    |                |
	| tk_cos     | int         | YES  |     | NULL    |                |
	| type_usr   | int         | NO   | MUL | NULL    |                |
	| act_cos    | int         | NO   |     | 0       |                |
	+------------+-------------+------+-----+---------+----------------+
	 */
	costumer: {
		set:  (name, lastnameF, lastnameM, email, tel, password, token, type) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				db.costumer.getByEmail(email).then((results) => {
					if (results.length > 0) reject('Correo ya en uso');
					else {
						con.query('INSERT INTO costumer VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, 3, ?)', [name, lastnameF, lastnameM, tel, email, password, token, type], (err, results) => {
							if (err) reject(err);
							else resolve(results);
						});
					}
				}).catch((err) => {
					reject(err);
				});
			});
		},

		getById: (id) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM costumer WHERE id_cos = ? LIMIT 1', [id], (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},

		getByEmail: (email) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM costumer WHERE em_cos = ? LIMIT 1', [email], (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},

		getByCredentials: (email, password) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM costumer WHERE em_cos = ? AND pw_cos = ? LIMIT 1', [email, password], (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},
		update: (id, name, lastnameF, lastnameM, email, tel) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('UPDATE costumer SET nam_cos=?, patsur_cos=?, matsur_cos=?, tel_cos=?, em_cos=? WHERE id_cos = ?', [name, lastnameF, lastnameM, tel, email, id], (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},

		activate: (id, token) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM costumer WHERE id_cos = ? AND tk_cos = ? LIMIT 1', [id, token], (err, results) => {
					if (err) reject(err);
					else if (results.length > 0) {
						con.query('UPDATE costumer SET tk_cos=NULL, act_cos=1 WHERE id_cos = ?', [id], (err, results) => {
							if (err) reject(err);
							else resolve(results);
						});
					}
					else reject('Código inválido');
				});
			});
		}
	},

	/* 
	+----------+-------------+------+-----+---------+----------------+
	| paymentmethods                                                 |
	+----------+-------------+------+-----+---------+----------------+
	| Field    | Type        | Null | Key | Default | Extra          |
	+----------+-------------+------+-----+---------+----------------+
	| id_pmt   | int         | NO   | PRI | NULL    | auto_increment |
	| num_pmt  | varchar(16) | NO   |     | NULL    |                |
	| date_pmt | date        | NO   |     | NULL    |                |
	| id_cos   | int         | YES  | MUL | NULL    |                |
	+----------+-------------+------+-----+---------+----------------+
	 */
	payment: {
		set: (id, number, date) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('INSERT INTO paymentmethods VALUES (DEFAULT, ?, ?, ?)', [number, date, id], (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},

		getAllByCostumer: (id) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM paymentmethods WHERE id_cos = ?', [id], (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},
	},

	/* 
	+---------------+--------------+------+-----+-------------------+-------------------+
	| shipping                                                                          |
	+---------------+--------------+------+-----+-------------------+-------------------+
	| Field         | Type         | Null | Key | Default           | Extra             |
	+---------------+--------------+------+-----+-------------------+-------------------+
	| trk_shpg      | varchar(18)  | NO   | PRI | NULL              |                   |
	| id_cos        | int          | YES  | MUL | NULL              |                   |
	| id_shpgtype   | int          | NO   | MUL | NULL              |                   |
	| id_shpgstat   | int          | NO   | MUL | NULL              |                   |
	| crtdate_shpg  | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
	| deldate_shpg  | datetime     | NO   |     | NULL              |                   |
	| statdate_shpg | datetime     | NO   |     | NULL              |                   |
	| price_shpg    | double       | NO   |     | NULL              |                   |
	| id_shpgsize   | int          | NO   | MUL | NULL              |                   |
	| id_pmt        | int          | YES  | MUL | NULL              |                   |
	| name_addrs    | varchar(100) | NO   |     | NULL              |                   |
	| em_addrs      | varchar(100) | NO   |     | NULL              |                   |
	| tel_addrs     | varchar(10)  | NO   |     | NULL              |                   |
	| id_orglock    | int          | NO   | MUL | NULL              |                   |
	| id_deslock    | int          | NO   | MUL | NULL              |                   |
	+---------------+--------------+------+-----+-------------------+-------------------+

	select * from shippingtype;
	+-------------+-------------+---------------+
	| id_shpgtype | nm_shpgtype | time_shpgtype |
	+-------------+-------------+---------------+
	|           1 | Tradicional | 06:00:00      |
	|           2 | Express     | 04:00:00      |
	+-------------+-------------+---------------+
	
	select * from shippingstate;
	+-------------+------------------------------------------+
	| id_shpgstat | name_shpgstat                            |
	+-------------+------------------------------------------+
	|           1 | En espera de entrega para recolección    |
	|           2 | En espera de recolección                 |
	|           3 | En traslado                              |
	|           4 | En espera de recepción del destinatario  |
	|           5 | En almacen                               |
	|           6 | Completado                               |
	|           7 | Cancelado                                |
	+-------------+------------------------------------------+

	 select * from shippingsize;
	+-------------+---------+----------------+
	| id_shpgsize | id_size | price_shpgsize |
	+-------------+---------+----------------+
	|           1 |       1 |            150 |
	|           2 |       2 |            200 |
	|           3 |       3 |            250 |
	+-------------+---------+----------------+
	 */
	shipping: {
		// TODO: Generate tracking number
		set: (id_cos, id_shpgtype, price_shpg, id_shpgsize, id_pmt, name_addrs, em_addrs, tel_addrs, id_orglock, id_deslock) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				// generate random tracking number
				let trk_shpg = Date.now().toString().padEnd(18, '0');
				
				con.query(
					'INSERT INTO shipping VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?)', 
					[trk_shpg, id_cos, id_shpgtype, price_shpg, id_shpgsize, id_pmt, name_addrs, em_addrs, tel_addrs, id_orglock, id_deslock], 
					(err, results) => {
						if (err) reject(err);
						else resolve(results);
					});
			});
		},

		getAllByCostumer: (id) => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM shipping WHERE id_cos = ?', [id], (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},
	},


	/* 
	Columnas de la tabla "cityhalls"
	+------------+--------------+
	| id_cityhll | name_cityhll |
	+------------+--------------+

	Columnas de la tabla "size"
	+---------+-----------+-----------+------------+------------+
	| id_size | name_size | high_size | width_size | depth_size |
	+---------+-----------+-----------+------------+------------+

	Columnas de la tabla "shippingsize"
	+-------------+---------+----------------+
	| id_shpgsize | id_size | price_shpgsize |
	+-------------+---------+----------------+

	Columas de la tabla "shippingtype"
	+-------------+-------------+---------------+
	| id_shpgtype | nm_shpgtype | time_shpgtype |
	+-------------+-------------+---------------+

	Columas de la tabla "locker"
	+-----------+-------------+-----------+-----------+-----------+--------------+------------+----------+
	| id_locker | name_locker | nums_door | numm_door | numl_door | addrs_locker | id_cityhll | id_state |
	+-----------+-------------+-----------+-----------+-----------+--------------+------------+----------+

	Columas de la tabla "state"
	+----------+------------+
	| id_state | name_state |
	+----------+------------+
	 */
	lockers : {
		getCityHalls : () => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM cityhalls', (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},

		getShipmentSizes : () => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM shippingsize NATURAL JOIN size', (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},

		getShipmentTypes : () => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM shippingtype', (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},

		getLockers : () => {
			return new Promise((resolve, reject) => {
				if (!isConnected) throw errorDBConnection;

				con.query('SELECT * FROM locker NATURAL JOIN cityhalls NATURAL JOIN state', (err, results) => {
					if (err) reject(err);
					else resolve(results);
				});
			});
		},
	},
};

module.exports = db;