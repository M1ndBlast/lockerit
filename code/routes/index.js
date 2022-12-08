var debug = require('debug')('lockerit:router:index');
var express = require('express');
var router = express.Router();
var db = require('../Queries');

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.session.user) 
		res.redirect('/Dashboard');
	else 
		res.render('main');
});

//Below showing to alternatives to redirect to another page
// Fer, elige el que mejor quieras

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
					name: results[0].nombres + ' ' + results[0].apellidoPaterno + ' ' + results[0].apellidoMaterno,
					email: results[0].correo,
					type: results[0].id_tipoUsuario
				};
				
				res.status(200).json({
					response: 'OK',
					message: 'Usuario autenticado',
					redirect: '/Dashboard'
				});
			} else {
				// res.redirect(401, '/identificacion');
				res.status(401).json({response:'ERROR', message:'Correo o contraseña incorrectos'});
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
							name: results[0].nm_usr,
							email: results[0].em_usr,
							type: results[0].type_usr
						};
						res.status(200).json({
							response: 'OK',
							message: 'Usuario creado correctamente',
							redirect: '/panel'
						});
					} else {
						res.status(401).json({response:'ERROR', message:'Usuario no encontrado tras registro'});
					}
				}).catch((err) => {
					res.status(402).json({response:'ERROR', message:err});
				});
			} else {
				res.status(401).json({response:'ERROR', message:'No se pudo crear el usuario'});
			}
		}).catch((err) => {
			res.status(402).json({response:'ERROR', message:err});
		});
	});

router.route('/recuperarContrasena')
	.get((req, res, next) => {
		res.render('recuperarContrasena');
	});

router.route('/Dashboard')
	.get((req, res, next) => {
		if (req.session.user) 
			res.render('AccesoMain');
		else 
			res.redirect('/');
	});


module.exports = router;