

const patterns = {
	nombre: /[a-zA-Zà-ÿÀ-Ÿ]{3,}( [a-zA-Zà-ÿÀ-Ÿ]{2,})? */,
	text: /[a-zA-Zà-ÿÀ-Ÿ]{3,}/,
	tel: /[0-9]{10}/,
	email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/,
	password: /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}/,
	nummerotarjeta: /[0-9]{16}/,
	fechaexpiracion: /[0-9]{2}\/[0-9]{2}/,
	cvv: /[0-9]{3}/,
}

function validateForm(form) {
	return Array.from(form.elements)
		.every((element) => element.checkValidity() )
}

function validatePassword(form) {
	if (form.elements['contrasena-verificacion']) {
		if (form.elements['contrasena'].value !== form.elements['contrasena-verificacion'].value) {
			form.elements['contrasena-verificacion'].setCustomValidity('Las contraseñas no coinciden');
			return false;
		}
		form.elements['contrasena-verificacion'].setCustomValidity('');
	}
	return true;
}

(() => {
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.needs-validation')	

	// Loop over them and prevent submission
	Array.from(forms).forEach(form => {
		Array.from(form.elements).forEach((element) => {
			// set pattern
			if (element.pattern === '') {
				console.log(element.name, element.name in patterns, element.type, element.type in patterns);
				if (element.name in patterns)
					element.setAttribute('pattern', patterns[element.name].source)
				else if (element.type in patterns)
					element.setAttribute('pattern', patterns[element.type].source)
			}

			element.addEventListener('keypress', event => 
				form.classList.remove('was-validated'));
		});

		form.addEventListener('submit', event => {
			event.preventDefault();
			event.stopPropagation();

			if (!validatePassword(form) || !validateForm(form)) {
				for(let element of form.elements) {
					let parent = element.parentElement;
					
					let feedback = parent.querySelector('.invalid-feedback');
					if (!element.checkValidity() || element.type === 'password')
						if (element.validity.valueMissing) {
							Swal.fire(
								'Campos vacíos.',
								'Es necesario que todos los campos obligatorios no estén vacíos.',
								'error'
							)
							break;
						}  else if (element.validity.patternMismatch) {
							Swal.fire(
								'Datos incorrectos.',
								'Los datos ingresados no están registrados en el sistema.',
								'error'
							)
							break;
						} else if (element.validity.customError) {
							Swal.fire(
								'Contraseña no validada.',
								'La contraseña y la validación son diferentes.',
								'error'
							)
							break;
						} else {
							Swal.fire(
								'Error.',
								element.validationMessage,
								'error'
							)
							break;
						}

				}
			}
			else {
				let action = form.getAttribute('action'),
					method = form.getAttribute('method'),
					urlencoded = new URLSearchParams();
					
				Array.from(form.elements)
					.filter(element => element.name !== '')
					.forEach(element => {
						console.log(element.name, element.value);
						urlencoded.append(element.name, element.value)
					});
				
				fetch(action, {
					method: method,
					body: urlencoded
				})
				.then(res => res.json())
				.then(data => {
					if (data.response == 'OK')
						if (data.redirect)
							window.location.href = data.redirect;
						else{
							console.log(data);
							Swal.fire(
								`¡${data.title || data.response}!`,
								data.message,
								'success'
							)
						}
					else {
						form.classList.remove('was-validated');
						console.log(data);
						Swal.fire(
							data.title || `¡${data.status}!`,
							data.message,
							'error'
						)
						
					}
					
				})
				.catch(err => {
					console.log(err);
					Swal.fire(
						'Error en el formato.',
						'Los datos ingresados no tienen el formato especificado.',
						'error'
					)
				});
			}

			form.classList.add('was-validated');
		}, false)
	})
})()