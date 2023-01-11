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
		if (!req.session.user || req.session.user.type_usr != 1) {
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
		if (!req.session.user || req.session.user.type_usr != 2) {
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
		if (!req.session.user || req.session.user.type_usr != 3) {
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
		console.log('newUser');
		console.log(newUser);
		req.session.user = {
			id: newUser.id,
			nombres: newUser.nam,
			apellidoPaterno: newUser.patsur,
			apellidoMaterno: newUser.matsur,
			numeroCelular: newUser.tel,
			correo: newUser.em,
			type_usr: newUser.type,
			stfnum: newUser.stfnum,
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