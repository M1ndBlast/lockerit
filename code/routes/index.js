const debug = require('debug')('lockerit:router:index');
const express = require('express');
const router = express.Router();
const db = require('../Queries');
const mailer = require('../Mailer');
const MSG = require('../Messages');

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.session.user) 
		res.redirect('/Dashboard');
	else 
		res.render('main');
});

router.route('/iniciarSesion')
	.get((req, res, next) => {
		if (req.session.user) 
			res.redirect('/');
		else 
			res.render('iniciarSesion', { title: req.session.user?.name });
	})
	.post((req, res, next) => {
		console.log('iniciarSesion', req.body);
		let {correo, contrasena} = req.body;

		db.checkCredentials(correo, contrasena).then((results) => {
			debug('results', results);
			if (results.length) {
				req.session.user = {
					id: results[0].id_cliente,
					nombres: results[0].nombres,
					apellidoPaterno: results[0].apellidoPaterno,
					apellidoMaterno: results[0].apellidoMaterno,
					numeroCelular: results[0].numeroCelular,
					correo: results[0].correo,
					id_tipoUsuario: results[0].id_tipoUsuario
				};
				
				res.status(200).json({
					response: 'OK',
					message: 'Usuario autenticado',
					redirect: '/Dashboard'
				});
			} else {
				// res.redirect(401, '/identificacion');
				res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE2});
			}
		}).catch((err) => {
			debug(err);
			// res.redirect(402, '/identificacion');
			res.status(402).json({response:'ERROR', message:err});
		});
	});

router.route('/RegistroCliente')
	.get((req, res, next) => {
		if (req.session.user) 
			res.redirect('/');
		else 
			res.render('RegistroCliente', { title: req.session.user?.name });
	})
	.post((req, res, next) => {
		console.log('RegistroCliente', req.body);
		let {nombre, apellidoP, apellidoM, telefono, correo, contrasena} = req.body;

		// create new user
		db.createClient(nombre, apellidoP, apellidoM, telefono, correo, contrasena, db.ROLES.CLIENT).then((results) => {
			if (results.affectedRows > 0) {
				// get user by id
				db.getClientById(results.insertId).then((results) => {
					if (results.length > 0) {
						req.session.user = {
							id: results[0].id_cliente,
							nombres: results[0].nombres,
							apellidoPaterno: results[0].apellidoPaterno,
							apellidoMaterno: results[0].apellidoMaterno,
							numeroCelular: results[0].numeroCelular,
							correo: results[0].correo,
							id_tipoUsuario: results[0].id_tipoUsuario
						};
						res.status(200).json({
							response: 'OK',
							message: 'Usuario creado correctamente',
							redirect: '/Dashboard'
						});
					} else {
						res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
					}
				}).catch((err) => {
					res.status(402).json({response:'ERROR', message:err});
				});
			} else {
				res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
			}
		}).catch((err) => {
			res.status(402).json({response:'ERROR', message:err});
		});
	});

router.route('/recuperarContrasena')
	.get((req, res, next) => {
		res.render('recuperarContrasena');
	});

router.route('/cerrarsesion')
	.get((req, res, next) => {
		if (req.session.user) {
			req.session.destroy();
			res.redirect('/');
		} else {
			res.redirect('/');
		}
	});

router.route('/Dashboard')
	.get((req, res, next) => {
		if (req.session.user) 
			res.render('AccesoMain', { user: req.session.user });
		else 
			res.redirect('/');
	});

router.route('/editarDatosUsuario')
	.get((req, res, next) => {
		if (req.session.user) 
			res.render('editarDatosUsuario', { user: req.session.user });
		else 
			res.redirect('/');
	})
	.post((req, res, next) => {
		console.log('id', req.session.user.id);
		console.log('editarDatosUsuario', req.body);

		let {nombre, apellidoP, apellidoM, telefono, correo} = req.body;

		// create new user
		db.updateClient(req.session.user.id, nombre, apellidoP, apellidoM, telefono, correo).then((results) => {
			console.log('updateClient', results);
			if (results.affectedRows > 0) {
				// get user by id
				db.getClientById(req.session.user.id).then((results) => {
					if (results.length > 0) {
						req.session.user = {
							id: results[0].id_cliente,
							nombres: results[0].nombres,
							apellidoPaterno: results[0].apellidoPaterno,
							apellidoMaterno: results[0].apellidoMaterno,
							numeroCelular: results[0].numeroCelular,
							correo: results[0].correo,
							id_tipoUsuario: results[0].id_tipoUsuario
						};
						res.status(200).json({
							response: 'OK',
							message: 'Usuario actualizado correctamente'
						});
					} else {
						res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
					}
				}).catch((err) => {
					res.status(402).json({response:'ERROR', message:err});
				});
			} else {
				res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
			}
		}).catch((err) => {
			res.status(402).json({response:'ERROR', message:err});
		});
	});

router.route('/agregarmetodoPago')
	.get((req, res, next) => {
		if (req.session.user) 
			res.render('agregarmetodoPago2');
		else 
			res.redirect('/');
	})
	.post((req, res, next) => {
		console.log(req.body);
		let {nummerotarjeta, fechaexpiracion} = req.body;
		db.addMetodoPago(req.session.user.id, nummerotarjeta, fechaexpiracion).then((results) => {
			if (results.affectedRows > 0) {
				res.status(200).json({
					response: 'OK',
					message: 'Metodo de pago agregado correctamente',
					redirect: '/metodosPago'
				});
			} else {
				res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
			}
		}).catch((err) => {
			res.status(402).json({response:'ERROR', message:err});
		});
	});

router.route('/metodosPago')
	.get((req, res, next) => {
		if (req.session.user) {
			// obtener metodos de pago
			db.getMetodosPago(req.session.user.id).then((results) => {
				if (results.length > 0) {
					res.render('metodosPago2', { user: req.session.user, metodosPago: results });
				} else {
					res.render('metodosPago2', { user: req.session.user, metodosPago: [] });
				}
			}).catch((err) => {
				res.status(402).json({response:'ERROR', message:err});
			});
		}
		else 
			res.redirect('/');
	});

router.route('/cotizarEnvio')
	.get(async(req, res, next) => {
		let alcaldias = await db.getAlcaldias(),
			tipoEnvio = await db.getTipoEnvio(),
			tamanios = await db.getTamanios();
		res.render('cotizarEnvio', { 
			user: req.session.user, 
			alcaldias: alcaldias, 
			tipoEnvio: tipoEnvio, 
			tamanios: tamanios 
		});
	})
	.post(async (req, res, next) => {
		console.log(req.body);
		let {origen, destino, paquete, tipo} = req.body;
		let tamanios = await db.getTamanios();
		let tipoEnvio = await db.getTipoEnvio();
		let alcaldias = await db.getAlcaldias();
		// get tamanio by id from tipo
		let tamanio = tamanios.find(t => t.id_tamanio == paquete);
		tipo = tipoEnvio.find(t => t.id_tipoEnvio == tipo);
		origen = alcaldias.find(a => a.id_Alcaldias == origen);
		destino = alcaldias.find(a => a.id_Alcaldias == destino);

		console.log(tamanio);
		console.log(tipo);
		console.log(origen);
		console.log(destino);
		
		req.session.newShipping = {
			origen: origen,
			destino: destino,
			tamanio: tamanio,
			tipo: tipo,
			//Precio del tamaño del paquete + (25.6*(Distancia entre origen y destino/27.5))
			precio: tamanio.Precio+(25.6*(100/27.5))
		};

		console.log(req.session.newShipping);
		res.redirect('/resumenCotizacion');
	});


router.route('/resumenCotizacion')
	.get((req, res, next) => {
		res.render('resumenCotizacion', { user: req.session.user, ...req.session.newShipping });
	});


module.exports = router;