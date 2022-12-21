const Auth = {
	// Allow only logged users (ADMIN, CLIENT, DELIVERER)
	onlyUsers: (req, res, next) => {
		console.log('onlyUsers', !req.session.user);
		if (!req.session.user) {
			if (req.method == 'GET')
				res.redirect('/');
			else if (req.method == 'POST')
				req.json({
					response: 'ERROR',
					message: 'No tienes los permisos necesarios para realizar esta acción'
				})
		} 
		else next();
	},
	// Allow only logged users (ADMIN)
	onlyAdmins: (req, res, next) => {
		if (!req.session.user || req.session.user.id_tipoUsuario != 1) {
			if (req.method == 'GET')
				res.redirect('/');
			else if (req.method == 'POST')
				req.json({
					response: 'ERROR',
					message: 'No tienes los permisos necesarios para realizar esta acción'
				})
		} 
		else next();
	},
	// Allow only logged users (DELIVERER)
	onlyDeliverers: (req, res, next) => {
		if (!req.session.user || req.session.user.id_tipoUsuario != 2) {
			if (req.method == 'GET')
				res.redirect('/');
			else if (req.method == 'POST')
				req.json({
					response: 'ERROR',
					message: 'No tienes los permisos necesarios para realizar esta acción'
				})
		} 
		else next();
	},
	// Allow only logged users (CLIENT)
	onlyClients: (req, res, next) => {
		if (!req.session.user || req.session.user.id_tipoUsuario != 3) {
			if (req.method == 'GET')
				res.redirect('/');
			else if (req.method == 'POST')
				req.json({
					response: 'ERROR',
					message: 'No tienes los permisos necesarios para realizar esta acción'
				})
		} 
		else next();
	},
	// Allow not logged users (GUEST)
	onlyGuests: (req, res, next) => {
		console.log('onlyGuests', req.session.user);
		if (req.session.user) {
			if (req.method == 'GET')
				res.redirect('/Dashboard');
			else if (req.method == 'POST')
				req.json({
					response: 'ERROR',
					message: 'No tienes los permisos necesarios para realizar esta acción'
				})
		} 
		else next();
	},

	createSession: (req, newUser) => {
		req.session.user = {
			id: newUser.id_cliente,
			nombres: newUser.nombres,
			apellidoPaterno: newUser.apellidoPaterno,
			apellidoMaterno: newUser.apellidoMaterno,
			numeroCelular: newUser.numeroCelular,
			correo: newUser.correo,
			id_tipoUsuario: newUser.id_tipoUsuario
		};
	},

	deleteSession: (req, res) => {
		req.session.destroy((err) => {
			if (err)
				return res.status(500).send({ error: 'No se pudo cerrar la sesión' });

			if (req.method == 'GET')
				res.redirect('/');
			else if (req.method == 'POST')
				req.json({
					response: 'ERROR',
					message: 'No tienes los permisos necesarios para realizar esta acción'
				})
		});
	}
};

module.exports = Auth;