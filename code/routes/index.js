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

	db.costumer.getByCredentials(correo, contrasena).then((results) => {
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
		res.status(402).json({response:'ERROR', message:err.message||err});
	});
});

router.route('/RegistroCliente')
.get(Auth.onlyGuests, (req, res, next) => {
	res.render('RegistroCliente', { title: req.session.user?.name, requireToken:req.session.tmpId });
})
.post(Auth.onlyGuests, Validator.signup, (req, res, next) => {
	let {nombre, apellidoP, apellidoM, telefono, correo, contrasena} = req.body,
		token = Math.floor(Math.random() * 1000000)// Random 6-digit number
			.toString().padStart(6, '0'); 
	// create new user
	db.costumer.set(nombre, apellidoP, apellidoM, correo, telefono, contrasena, token, db.ROLES.CLIENT).then(async (results) => {
		if (results.insertId) {
			console.log(`results.insertId: ${results.insertId}`);
			// get user by id
			let costumer = await db.costumer.getById(results.insertId);
			if (costumer.length) {
				console.log('enviando correo');

				await mailer.mailVerification(correo, token);
				req.session.tmpId = results.insertId;
				res.json({
					response: 'OK',
					title: 'Usuario creado correctamente',
					message: 'Verifique su correo para activar su cuenta',
					modal: {
						new: '#staticBackdrop',
						old: 'none'
					},
				});
			} else {
				res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
			}
		} else {
			res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
		}
	}).catch((err) => {
		res.status(402).json({response:'ERROR', message:err.message||err});
	});
}); 

router.route('/activacion')
.post(Auth.onlyGuests, Validator.token, (req, res, next) => {
	console.log('activacion');
	let id = req.session.tmpId,
		{Num1, Num2, Num3, Num4, Num5, Num6} = req.body,
		token = Num1 + Num2 + Num3 + Num4 + Num5 + Num6;
	console.log(`id: ${id}, token: ${token}`);
	db.costumer.activate(id, token).then((results) => {
		if (results.affectedRows) {
			db.costumer.getById(id).then((results) => {
				if (results[0]) {
					Auth.createSession(req, results[0]);
					res.json({
						response: 'OK',
						message: 'Usuario creado correctamente',
						redirect: '/Dashboard',
					});
				}
				else 
					res.json({response:'ERROR', ...MSG.ERROR.MSE7});
			});
		} else {
			res.json({response:'ERROR', ...MSG.ERROR.MSE7});
		}
	}).catch((err) => {
		res.status(402).json({response:'ERROR', message:err.message||err});
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
	db.costumer.update(req.session.user.id, nombre, apellidoP, apellidoM, correo, telefono).then((results) => {
		console.log('updateClient', results);
		if (results.affectedRows > 0) {
			// get user by id
			db.costumer.getById(req.session.user.id).then((results) => {
				if (results.length > 0) {
					Auth.createSession(req, results[0])
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
	let {nummerotarjeta, fechaexpiracion, cardDate} = req.body;
	db.payment.set(req.session.user.id, nummerotarjeta, cardDate).then((results) => {
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
		db.payment.getAllByCostumer(req.session.user.id).then((results) => {
			if (results.length > 0) {
				res.render('MetodosPago2', { user: req.session.user, metodosPago: results });
			} else {
				res.render('MetodosPago2', { user: req.session.user, metodosPago: [] });
			}
		}).catch((err) => {
			res.status(402).json({response:'ERROR', message:err});
		});
	}
	else 
		res.redirect('/');
}).post(Auth.onlyClients, (req, res, next) => {
	// eliminar metodo de pago with id
	db.payment.delete(req.body.id).then((results) => {
		if (results.affectedRows) {
			res.json({
				response: 'OK',
				message: 'Metodo de pago eliminado correctamente',
				redirect: '/metodosPago'
			});
		} else {
			res.status(401).json({response:'ERROR', ...MSG.ERROR.MSE7});
		}
	}).catch((err) => {
		res.status(402).json({response:'ERROR', message:err});
	});
});

router.route('/cotizarEnvio')
.get(async(req, res, next) => {
	let alcaldias = await db.lockers.getCityHalls(),
		tipoEnvio = await db.lockers.getShipmentTypes(),
		lockers = await db.lockers.getLockers(), 
		tamanios = await db.lockers.getShipmentSizes();
	res.render('cotizarEnvio', { 
		user: req.session.user, 
		alcaldias: alcaldias, 
		tipoEnvio: tipoEnvio, 
		lockers: lockers,
		tamanios: tamanios 
	});
})
.post(Validator.cotizacion, async (req, res, next) => {
	console.log('req.body', req.body);
	let {
		origen:alcaldiaOrgId, lockerOrigen:lockerOrgId,
		destino:alcaldiaDstId, lockerDestino:lockerDstId,
		tipo:tipoEnvioId, paquete:tipoPaqueteId} = req.body,

		alcaldias = await db.lockers.getCityHalls(),
		lockers = await db.lockers.getLockers(),
		tipoEnvios = await db.lockers.getShipmentTypes(),
		tamanios = await db.lockers.getShipmentSizes(),
		
		lockerOrg = lockers.find(l => l.id_locker == lockerOrgId),
		lockerDst = lockers.find(l => l.id_locker == lockerDstId),
		tipoEnvio = tipoEnvios.find(t => t.id_shpgtype == tipoEnvioId),
		tipoPaquete = tamanios.find(t => t.id_shpgsize == tipoPaqueteId),
		//Precio del tamaño del paquete + (25.6*(Distancia entre origen y destino/27.5))
		precio = tipoPaquete.price_shpgsize+(25.6*(100/27.5)).toFixed(2);

	
	req.session.newShipping = {
		lockerOrg: lockerOrg,
		lockerDst: lockerDst,
		tipoEnvio: tipoEnvio,
		tipoPaquete: tipoPaquete,
		precio: precio
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
	let alcaldias = await db.lockers.getCityHalls(),
		tipoEnvio = await db.lockers.getShipmentTypes(),
		tamanios = await db.lockers.getShipmentSizes(),
		lockers = await db.lockers.getLockers(),
		metodosPago = await db.payment.getAllByCostumer(req.session.user.id);

	res.render('realizarEnvio', {
		user: req.session.user,
		alcaldias: alcaldias,
		tipoEnvio: tipoEnvio,
		tamanios: tamanios,
		metodosPago: metodosPago,
		lockers: lockers
	});
})
.post(Validator.realizarEnvio, async (req, res, next) => {
	console.log('req.body KEJEJ');
	console.log(req.body);
	let {lockerOrigen:origen, lockerDestino:destino, paquete, tipo, inputName, inputMail, inputNumber, listGroupRadio} = req.body;
	let tamanios = await db.lockers.getShipmentSizes();
	let tamanio = tamanios.find(t => t.id_shpgsize == paquete);
	console.log("tamanio", tamanio);
	let precio = tamanio.price_shpgsize+(25.6*(100/27.5));
	
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
		precio: tamanio.price_shpgsize+(25.6*(100/27.5))
	};

	console.log(req.session.newShipping);

	db.shipping.set(req.session.user.id, tipo, precio, paquete, listGroupRadio, inputName, inputMail, inputNumber, origen, destino).then((results) => {
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
	let envios = await db.shipping.getAllByCostumer(req.session.user.id);
	console.log(envios);
	res.render('consultarEnvio', { 
		user: req.session.user,
		envios: envios
	 });
});

router.route('/detallesPaquete/:id')
.get(Auth.onlyClients, async (req, res, next) => {
	let id = req.params.id;
	let envio = (await db.shipping.getByTracking(id))[0];
	let lockerOrigen = (await db.lockers.getById(envio.id_orglock))[0];
	let lockerDestino = (await db.lockers.getById(envio.id_deslock))[0];

	console.log(envio);

	res.render('detallesPaquete', {
		user: req.session.user,
		envio: envio,
		lockerOrigen: lockerOrigen,
		lockerDestino: lockerDestino
	});
});

router.route('/estatusEnvio/:id')
.get(Auth.onlyClients, async (req, res, next) => {
	let id = req.params.id;
	let envio = (await db.shipping.getByTracking(id))[0];
	let lockerOrigen = (await db.lockers.getById(envio.id_orglock))[0];
	let lockerDestino = (await db.lockers.getById(envio.id_deslock))[0];

	console.log(envio);

	res.render('estatusEnvio', {
		user: req.session.user,
		envio: envio,
		lockerOrigen: lockerOrigen,
		lockerDestino: lockerDestino
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