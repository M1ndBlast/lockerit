const debug = require('debug')('lockerit:router:index');
const express = require('express');
const router = express.Router();
const db = require('../Queries');
const mailer = require('../Mailer');
const MSG = require('../Messages');
const Auth = require('../Auth');
const Validator = require('../Validator');

/* GET home page. */
router.route('/')
.get(Auth.onlyGuests, (req, res, next) => {
	res.render('main');
});

router.route('/iniciarSesion')
.get(Auth.onlyGuests, (req, res, next) => {
	res.render('iniciarSesion', { title: req.session.user?.name });
})
.post(Auth.onlyGuests, Validator.signin, (req, res, next) => {
	let {correo, contrasena} = req.body;

	db.checkCredentials(correo, contrasena).then((results) => {
		debug('results', results);
		if (results.length) {
			Auth.createSession(req, results[0]);
			res.json({
				response: 'OK',
				message: 'Usuario creado correctamente',
				redirect: '/Dashboard',
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
.get(Auth.onlyGuests, (req, res, next) => {
	res.render('RegistroCliente', { title: req.session.user?.name });
})
.post(Auth.onlyGuests, Validator.signup, (req, res, next) => {
	let {nombre, apellidoP, apellidoM, telefono, correo, contrasena} = req.body;
	// create new user
	db.createClient(nombre, apellidoP, apellidoM, telefono, correo, contrasena, db.ROLES.CLIENT).then((results) => {
		if (results.insertId > 0) {
			console.log('creado');
			// get user by id
			db.getClientById(results.insertId).then((results2) => {
				if (results2.length > 0) {
					console.log('enviando correo');
					mailer.mailVerification(correo, results.insertId).then(_ => {
						console.log('correo enviado');
						res.json({
							response: 'OK',
							title: 'Usuario creado correctamente',
							message: 'Verifique su correo para activar su cuenta',
						});
					}).catch((err) => {
						console.log(err);
						res.status(402).json({response:'ERROR', message:err});
					});
				} else {
					res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
				}
			}).catch((err) => {
				res.status(402).json({response:'ERROR', ...err});
			});
		} else {
			res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
		}
	}).catch((err) => {
		res.status(402).json({response:'ERROR', ...err});
	});
}); 

router.route('/activacion/:id([0-9]{1,})')
.get(Auth.onlyGuests, (req, res, next) => {
	console.log('activacion');
	let idUser = req.params.id;
	db.getClientById(idUser).then((results) => {
		if (results[0]) {
			Auth.createSession(req, results[0]);
			res.send("<h1>Cuenta Activada </h1><a href='/'>Inicio</a>")
		}
		else 
			res.send("<h1>Cuenta Desconocida</h1><h5>No existe ningún registro de la página</h5><a href='/'>Inicio</a>")
	});
});

router.route('/recuperarContrasena')
.get((req, res, next) => {
	res.render('recuperarContrasena');
});

router.route('/cerrarsesion')
.get(Auth.onlyUsers, (req, res, next) => {
	Auth.deleteSession(req, res);
});

router.route('/Dashboard')
.get(Auth.onlyUsers, (req, res, next) => {
	res.render('AccesoMain', { user: req.session.user }); 
});

router.route('/editarDatosUsuario')
.get(Auth.onlyClients, (req, res, next) => {
	res.render('editarDatosUsuario', { user: req.session.user });
})
.post(Auth.onlyClients, Validator.updatePersonalData, (req, res, next) => {
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
.get(Auth.onlyClients, (req, res, next) => {
	res.render('agregarmetodoPago2');
})
.post(Auth.onlyClients, Validator.creditCard, (req, res, next) => {
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
.get(Auth.onlyClients, (req, res, next) => {
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
.post(Validator.cotizacion, async (req, res, next) => {
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


router.route('/envios')
.get(Auth.onlyClients, (req, res, next) => {
	res.render('envios', { user: req.session.user });
});

router.route('/realizarEnvio')
.get(Auth.onlyClients, async(req, res, next) => {
	let alcaldias = await db.getAlcaldias(),
		tipoEnvio = await db.getTipoEnvio(),
		metodosPago = await db.getMetodosPago(req.session.user.id),
		tamanios = await db.getTamanios();

	res.render('realizarEnvio', {
		user: req.session.user,
		alcaldias: alcaldias,
		tipoEnvio: tipoEnvio,
		tamanios: tamanios,
		metodosPago: metodosPago
	});
})
.post(Validator.realizarEnvio, async (req, res, next) => {
	console.log('req.body KEJEJ');
	console.log(req.body);
	let {origen, destino, paquete, tipo, inputName, inputMail, inputNumber, listGroupRadio} = req.body;
	let tamanios = await db.getTamanios();
	let tamanio = tamanios.find(t => t.id_tamanio == paquete);
	let precio= tamanio.Precio+(25.6*(100/27.5))

	console.log(tamanio);
	console.log(tipo);
	console.log(origen);
	console.log(destino);
	
	req.session.newShipping = {
		origen: origen,
		destino: destino,
		tamanio: tamanio,
		tipo: tipo,
		inputName: inputName,
		inputMail: inputMail, 
		inputNumber: inputNumber,
		listGroupRadio: listGroupRadio,
		//Precio del tamaño del paquete + (25.6*(Distancia entre origen y destino/27.5))
		precio: tamanio.Precio+(25.6*(100/27.5))
	};

	console.log(req.session.newShipping);
	db.createShipping(req.session.user.id, tipo, paquete, inputName, inputMail, inputNumber, listGroupRadio, origen, destino, precio).then((results) => {
		res.json({
			response: 'OK', 
			message: 'Solicitud de envío generada con éxito. Recibirá un correo electronico con todos los estados para continuar con su envío',
			title: 'Envío Generado',
		});
	}).catch((err) => {
		console.log(err);
		res.json({
			response: 'ERROR', 
			message: 'No se pudo generar la solicitud de envío, intente más tarde',
			title: 'Error',
		});
	});

	
});

router.route('/consultarEnvio')
.get(Auth.onlyClients,async (req, res, next) => {
	let envios = await db.getShippings(req.session.user.id);
	res.render('consultarEnvio', { 
		user: req.session.user,
		envios: envios
	 });
});

router.route('/ticketEnvios')
.get(Auth.onlyClients, (req, res, next) => {
	res.render('ticketEnvios', { user: req.session.user });
});

router.route('/estatusEnvio')
.get(Auth.onlyClients, (req, res, next) => {
	res.render('estatusEnvio', { user: req.session.user });
});

router.get('/:file', (req, res, next) => {
	let file = req.params.file;
	console.log(file);
	res.render(file, { user: req.session.user });
});

module.exports = router;