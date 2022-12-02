var debug = require('debug')('lockey:router:index');
var express = require('express');
var router = express.Router();
var bd = require('../Queries');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('main', { title: 'expres' });
});

//Below showing to alternatives to redirect to another page
// Fer, elige el que mejor quieras

router.route('/iniciarSesion')
	.get((req, res, next) => {
		let user = req.session.user
		res.render('iniciarSesion', { title: user?.name });
	})
	.post((req, res, next) => {
		debug(req.body);
		let { email, pwd } = req.body;

		bd.iniciarSesion(email, pwd).then((results) => {
			debug('results', results);
			if (results.length > 0) {
				req.session.user = {
					name: results[0].nm_usr,
					email: results[0].em_usr,
					type: results[0].tp_usr
				};

				res.status(200).json({
					response: 'OK',
					message: 'Usuario autenticado',
					redirect: '.'
				});
			} else {
				// res.redirect(401, '/identificacion');
				res.status(401).json({ response: 'OK', message: 'Correo o contraseña incorrectos' });
			}
		}).catch((err) => {
			debug(err);
			// res.redirect(402, '/identificacion');
			res.status(402).json({ response: 'OK', message: err });
		});
	});

router.route('/RegistroCliente')
	.get((req, res, next) => {
		let user = req.session.user
		res.render('RegistroCliente', { title: user?.name });
	})
	.post((req, res, next) => {
		debug(req.body);
		let { name, email, tel, pwd } = req.body;

		bd.crearCuenta(name, email, tel, pwd, bd.ROL_CLIENTE).then((results) => {
			debug('results', results);
			if (results.affectedRows > 0) {
				bd.usuarioId(results.insertId).then((results) => {
					debug('results', results);
					if (results.length > 0) {
						req.session.user = {
							name: results[0].nm_usr,
							email: results[0].em_usr,
							type: results[0].tp_usr
						};
						res.status(200).json({
							response: 'OK',
							message: 'Usuario creado correctamente',
							redirect: '.'
						});
					} else {
						res.status(401).json({ response: 'ERROR', message: 'Usuario no encontrado tras registro' });
					}
				}).catch((err) => {
					debug(err);
					res.status(402).json({ response: 'ERROR', message: err });
				});
			} else {
				res.status(401).json({ response: 'ERROR', message: 'No se pudo crear el usuario' });
			}
		}).catch((err) => {
			debug(err);
			res.status(402).json({ response: 'ERROR', message: err });
		});
	});

router.route('/recuperarContrasena')
	.get((req, res, next) => {
		res.render('recuperarContrasena');
	});


module.exports = router;