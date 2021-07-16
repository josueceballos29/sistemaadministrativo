class USER {
	constructor(name,password,roll,date){
		this.name = name;
		this.password = password
		this.roll = roll;
		this.date = date;
		let id = 1 + Math.random() * 9999999999999;
		id = Math.floor(id);
		this.id = id;
	}
}

const btnSubmit = document.querySelector('.sbt');
const userName = document.querySelector('#userName');
const userPass = document.querySelector('#userPass');
const userError = document.querySelector('#userError');

let response = localStorage.getItem('users');

if (response == null) {
	let data = [];
	localStorage.setItem('users',JSON.stringify(data));
}

btnSubmit.addEventListener('click',(e)=>{
	userError.innerHTML = '';
	e.preventDefault();
	userInDataBase(userName.value.toLowerCase(),userError);
	let res = validarDatos(userName.value,userPass.value);

	if (res.length > 0 || userError.innerHTML != '') {
		const errors = document.querySelector('#errors');
		errors.innerHTML = res.join('<br>');
	}
	else {
		let res = getDate();
		addUserDB(userName.value.toLowerCase(),userPass.value,res);
		errors.innerHTML = ''; userName.value = ''; userPass.value = '';
		userError.innerHTML = '';
		alert(`Bienvenido ${userName.value}`);
		asignarAdmin();

		setTimeout(()=>{
			window.location.href = 'login.html';
		},500)
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

function addUserDB(name,pass,date) {
	let users = JSON.parse(localStorage.getItem('users'));
	let conteo = 0;
	// Verificando que  el Usuario no este en la DB
	for (user in users) {
		if (users[user].name != name) {
			conteo++;
		}
	}
	// Añadiendo el usuario si no hay otro usuario ya almacenado
	if (conteo == users.length) {
		users.push(new USER(name,pass,'Usuario',date));
		localStorage.setItem('users',JSON.stringify(users));
	}
}

function userInDataBase(name,error) {
	let userDB = JSON.parse(localStorage.getItem('users'));
	// Si el usuario ya esta en la base tendra que ingresar otro nombre
	for (user in userDB) {
		if (userDB[user].name == name) {
			error.innerHTML = 'Nombre en uso';
		}
	}
}

function asignarAdmin() {
	let users = JSON.parse(localStorage.getItem('users'));
	// Al primer usuario que ingrese a la aplicacion sera el admin
	if (users.length == 1) {
		for (user in users) {
			users[user].roll = 'Admin';
			localStorage.setItem('users',JSON.stringify(users));
		}
	}
}

function getDate() {
    function addZero(n) {
    	if (n.toString().length < 2) {
    		return '0'.concat(n);
    	}
    	return n;
    }

	let date = new Date();
	let dia = date.getDate();
	let mes = date.getMonth() + 1;
	let año = date.getFullYear();
	let hora = `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`
	let completo = `${dia}-${mes}-${año} a las ${hora}`;

	return completo;
}