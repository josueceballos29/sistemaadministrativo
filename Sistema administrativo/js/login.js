const btnSubmit = document.querySelector('.sbt');
const userName = document.querySelector('#userName');
const userPass = document.querySelector('#userPass');

btnSubmit.addEventListener('click',(e)=>{
	e.preventDefault();

	let res = validarDatos(userName.value,userPass.value);
	let response = userNotInDB(userName.value.toLowerCase(),userPass.value);

	if (res.length > 0) {
		const errors = document.querySelector('#errors');
		errors.innerHTML = res.join('<br>');
	}
	else if (response == false) {
		alert('Datos invalidos')
	}
	else {
		adminOrUser(userName.value.toLowerCase());
		errors.innerHTML = ''; userName.value = ''; userPass.value = '';
	}
})


function validarDatos(name,password) {
	let errors = [];
	if (name == '') {
		errors.push('Nombre obligatorio');
	}
	else if (name.indexOf(' ') != -1) {
		errors.push('Nombre invalido');
	}
	if (password == '') {
		errors.push('Contraseña Obligatoria')
	}
	else if (password.length < 8 || password.length > 32) {
		errors.push('La contraseña debe tener 8-32 caracteres');
	}
	return errors;
}

function userNotInDB(nombre,pass) {
	let users = JSON.parse(localStorage.getItem('users'));
	let conteo = 0;
	let res = false;

	// Si los datos ingresados no son correctos negarle el acceso
	for (let user in users) {
		if (users[user].name == nombre && users[user].password == pass) {
			res = true;
		}
	}

	return res;
}

function adminOrUser(name) {
	let users = JSON.parse(localStorage.getItem('users'));

	for (user in users) {
		if (users[user].name == name) {
			// Si el usuario tiene el roll de admin enviarle al panel principal, sino enviarle al home
			if (users[user].roll == 'Admin') {
				localStorage.setItem('ingresado',name);
				setTimeout(()=>{
					window.location.href = 'panel.html';
				},500);
			}
			else {
				setTimeout(()=>{
					window.location.href = 'home.html';
				},500);
			}
		}
	}
}