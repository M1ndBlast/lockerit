const Auth = {
	// Allow only logged users (ADMIN, CLIENT, DELIVERER)
	onlyUsers: (req, res, next) => {
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
		if (!req.session.user || req.session.user.type != 'ADMIN') {
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
		if (!req.session.user || req.session.user.type != 'DELIVERER') {
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
		if (!req.session.user || req.session.user.type != 'CLIENT') {
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
		req.session.regenerate((err) => {
			if (err)
				throw new Error('No se pudo iniciar sesión')

			req.session.user = {
				id: newUser.id_cliente,
				nombres: newUser.nombres,
				apellidoPaterno: newUser.apellidoPaterno,
				apellidoMaterno: newUser.apellidoMaterno,
				numeroCelular: newUser.numeroCelular,
				correo: newUser.correo,
				id_tipoUsuario: newUser.id_tipoUsuario
			};
		});
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