const btn = document.querySelector('#btn');
const menu = document.querySelector('.menu');
const body = document.querySelector('.card-body');
const history = document.querySelector('#hUsers');
const pControl = document.querySelector('#pControl');
const bodyRolls = document.querySelector('.bodyRolls');

document.querySelector('#name-user').innerText = `Perfil: ${localStorage.getItem('ingresado')}`;
document.querySelector('.exit').addEventListener('click',()=> window.location.href = 'login.html')

class ADMIN {
	constructor(name){
		this.name = name;
		this.notificacion = null;
	}
}

getDatainHistory();
getData();
editRoll();

let data = localStorage.getItem('admins');

if (data == null) {
	let res = [];
	localStorage.setItem('admins',JSON.stringify(res));
}
else {
	setTimeout(()=>{
		agregarAdmins();
		asignarNotificacion();
		mostrarNotificacion();
	},1000)
}

function agregarAdmins() {
	let name = localStorage.getItem('ingresado');
	let admins = JSON.parse(localStorage.getItem('admins'));
	let prev = [];
	
	if (admins.length == 0) {
		admins.push(new ADMIN(name));
	}
	else {
		let conteo = 0;
		for (admin in admins) {
			if (admins[admin].name != name) {
				conteo++;
			}
		}
		if (conteo == admins.length) {

			admins.push(new ADMIN(name));
			console.log(admins)
			let users = JSON.parse(localStorage.getItem('users'));

			for (let admin in admins) {
				for (let user in users) {
					if (users[user].name == admins[admin].name) {
						if (users[user].roll == 'Admin') {
							prev.push(admins[admin]);
						}
					}
				}
			}
			localStorage.setItem('admins',JSON.stringify(prev));
		}

	}

}

btn.addEventListener('click',()=>{
	menu.classList.toggle('abierto');
})

function getData() {
	let data = JSON.parse(localStorage.getItem('users'));
	document.querySelector('#numUsers').innerText = data.length;
	document.querySelector('#numRolls').innerText = data.length;
}

function asignarNotificacion() {
	let name = localStorage.getItem('ingresado');
	let admins = JSON.parse(localStorage.getItem('admins'));

	for (admin in admins) {
		if (admins[admin].name == name) {
			if (admins[admin].notificacion == null) {
				let res = confirm(`${name}, ¿Deseas activar las notificacion cada vez que un nuevo usuario ingresa a la aplicacion?`);
				if (res) {
				admins[admin].notificacion = true;
				}
				else if (!res) {
					admins[admin].notificacion = false;
				}
			}
		}
	}
	localStorage.setItem('admins',JSON.stringify(admins));
}

function mostrarNotificacion() {
	const admins = JSON.parse(localStorage.getItem('admins'));
	const name = localStorage.getItem('ingresado');
	// Mostrando las notificacion solamente a los que hayan aceptado
	for (admin in admins) {
		if (admins[admin].name == name && admins[admin].notificacion == true) {
			 const numUsers = document.querySelector('#numUsers').innerText;
			 // Obteniendo en tiempo real el numero de usuarios registrados
			 const temporizador = setInterval(()=>{
			 	let users = JSON.parse(localStorage.getItem('users'));
			 	let indexLastUser = users.length - 1;

			 	if (users.length > numUsers) {
			 		for (user in users){
			 			if (user == indexLastUser) {
			 				alert(`Nuevo usuario: ${users[user].name}. Recarga la pagina para ver sus datos`);
			 				setTimeout(()=>{
			 					clearInterval(temporizador);
			 				})
			 			}
			 		}
			 	}
			 },500)
		}
	}
}


function getDatainHistory() {
     let data = JSON.parse(localStorage.getItem('users'));
     let htmlCode = '';
     for (user in data) {
     	if (data[user].roll == 'Usuario') {
     		htmlCode += `<div class="persona ${data[user].id}">
					<div class="persona-name persona__item">${data[user].name}</div>
					<div class="persona-date persona__item">${data[user].date}</div>
					<div class="persona-opcion persona__item"><input type="button" value="Delete" class="btnDelete"></div>
				</div>`;
     	}
     	else {
     		htmlCode += `<div class="persona ${data[user].id}">
					<div class="persona-name persona__item">${data[user].name}</div>
					<div class="persona-date persona__item">${data[user].date}</div>
					<div class="persona-opcion persona__item">No se puede eliminar</div>
				</div>`;
     	}
     	body.innerHTML = htmlCode;
     }
     deleteUsers();
}

function deleteUsers() {
	const btnDeletes = document.querySelectorAll('.btnDelete');

	btnDeletes.forEach(btn => {
		btn.addEventListener('click',()=>{
			// Obteniendo el contenedor padre del boton para luego eliminarlo
			let contenedor = btn.closest('.persona');
			let id = contenedor.classList.item("1");
			let data = JSON.parse(localStorage.getItem('users'));
			let prevUsers = [];
			// Añadiendo los datos del array de los usuarios pero sin el usuario eliminado
			for (let user in data) {
				if (data[user].id != id) {
					prevUsers.push(data[user]);
				}
			}
			// Removiendo el contenedor del usuario en el contenedor principal y actualizando los datos
            body.removeChild(contenedor);
			localStorage.setItem('users',JSON.stringify(prevUsers));
			// Cada vez que el usuario presiona el boton de eliminar sumara al conteo 1 usuario
			contarEliminados();
			alert('Recarge la pagina para guardar cambios');
		})
	})
}

let eliminados = localStorage.getItem('eliminados');

if (eliminados == null) {
	document.querySelector('#numDeleted').innerText = 0;
}
else {
	document.querySelector('#numDeleted').innerText = eliminados;
}

function contarEliminados() {
	let eliminados = localStorage.getItem('eliminados');

	if (eliminados == null) {
		localStorage.setItem('eliminados','1');
		document.querySelector('#numDeleted').innerText = 0;
	}
	else {
		eliminados = parseInt(eliminados);
		eliminados++;
		localStorage.setItem('eliminados',`${eliminados}`);
		document.querySelector('#numDeleted').innerText = eliminados;
	}
}

function editRoll() {
	let users = JSON.parse(localStorage.getItem('users'));
	let usersCode = '', adminsCode = '';

	for (user in users) {
		if (users[user].roll == 'Admin') {
			adminsCode += `<div class="persona">
					<div class="persona-name persona__item">${users[user].name}</div>
					<div class="persona-roll persona__item">${users[user].roll}</div>
					<div class="persona-opciones persona__item">
						<button class="modificar">Modificar</button>
						<button class="guardar" hidden="true">Guardar</button>
					</div>
				</div>`;
		}
		else {
			usersCode += `<div class="persona">
					<div class="persona-name persona__item">${users[user].name}</div>
					<div class="persona-roll persona__item">${users[user].roll}</div>
					<div class="persona-opciones persona__item">
						<button class="modificar">Modificar</button>
						<button class="guardar" hidden="true">Guardar</button>
					</div>
				</div>`;
		}
	}
	bodyRolls.innerHTML = adminsCode;
	bodyRolls.innerHTML+= usersCode;

	const modificar = document.querySelectorAll('.modificar');
	modificar.forEach(btnSet =>{
		btnSet.addEventListener('click',()=>{
			// Obteniendo el contenedor padra el boton de modificar para luego iterar sobre sus hijos y conseguir los demas elementos
			const container = btnSet.closest('.persona');
			let hijos = container.children;
			let campRoll, campOptionsContainer, userName;

			for (hijo in hijos) {
				if (hijo == 0) {
					userName = hijos[hijo]
				}
				if (hijo == 1) {
					campRoll = hijos[hijo];
				}
				if (hijo == 2) {
					campOptionsContainer = hijos[hijo];
				}
			}
			
			const btnSave = campOptionsContainer.lastElementChild;
			showElements(btnSave);
			hiddenElementos(btnSet);

			campRoll.setAttribute('contenteditable','true');
			campRoll.classList.add('persona-roll--active')

			// Guardando el nuevo roll en el localStorage
			btnSave.addEventListener('click',()=>{
				campRoll.classList.remove('persona-roll--active');
				let roll = campRoll.innerText;

				if (roll == 'Admin' || roll == 'Usuario') {
					let users = JSON.parse(localStorage.getItem('users'));

					// Modificando el roll desde el localStorage
					for (user in users){
						if (users[user].name == userName.innerText) {
							users[user].roll = roll;
						}
					}
	
					campRoll.removeAttribute('contenteditable');
					localStorage.setItem('users',JSON.stringify(users));
					alert('Recargar la pagina para guardar los cambios')
					showElements(btnSet);
					hiddenElementos(btnSave);
				}
				else {
					alert('Roll incorrecto');
				}
			})
		})
	})
}

function showElements(...elementos) {
	for (elemento of elementos) {
		elemento.removeAttribute('hidden');
	}
}

function hiddenElementos(...elementos) {
	for (elemento of elementos) {
		elemento.setAttribute('hidden','true');
	}
}