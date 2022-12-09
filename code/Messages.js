
const Messages = {
	ERROR: {
		MSE1: {
			title: 'Campos vacíos.',
			message: 'Es necesario que todos los campos obligatorios no estén vacíos.'
		},
		MSE2: {
			title: 'Datos incorrectos.',
			message: 'Los datos ingresados no están registrados en el sistema.'
		},
		MSE3: {
			title: 'Datos asociados a otra cuenta.',
			message: 'El correo electrónico ya se encuentra asociado a otra cuenta.'
		},
		MSE4: {
			title: 'Contraseña no validada.',
			message: 'La contraseña y la validación son diferentes.'
		},
		MSE5: {
			title: 'Error en el formato.',
			message: 'Los datos ingresados no tienen el formato especificado.'
		},
		MSE6: {
			title: 'Tarjeta no valida.',
			message: 'Los datos ingresados no son correctos.'
		},
		MSE7: {
			title: 'Problemas en el servidor.',
			message: 'Se ha presentado una anomalía dentro del servidor, inténtalo más tarde.'
		},
	}
};


// End of queries
module.exports = Messages;