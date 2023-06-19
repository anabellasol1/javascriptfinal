const productos = document.getElementById("productos");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
	FetchData();

	if(localStorage.getItem("ejemplo")){
		carrito = JSON.parse(localStorage.getItem("ejemplo"))
		mostrarCarrito();
	}
});

items.addEventListener("click", e => {
	btnAccion(e)
	});

// Traer los productos del Json con FetchData

async function FetchData() {
	try {
		const respuesta = await fetch("productos.json");
		const datos = await respuesta.json();
		/* console.log(datos); */
		mostrarCards(datos);
	} catch (error) {
		console.log(error);
	};
};

// Función para mostrar las cards

const mostrarCards = datos => {
	datos.forEach(producto => {
		templateCard.querySelector("h3").textContent = producto.nombre;
		templateCard.querySelector("p").textContent = producto.precio;
		templateCard.querySelector("img").setAttribute("src", producto.img);
		templateCard.querySelector("button").dataset.id = producto.id;

		const clone = templateCard.cloneNode(true);
		fragment.appendChild(clone)
	});

	productos.appendChild(fragment)
};

// Evento Click para capturar elementos

productos.addEventListener("click", e => {
	agregarCarrito(e);
});

const agregarCarrito = e => {
	/* console.log(e.target.classList.contains("btn-dark")); // Validación si la consola toma el botón */
	if (e.target.classList.contains("btn-dark")) {
		armadoCarrito(e.target.parentElement)
	};

	e.stopPropagation(); // Detener la propagación del evento
}

// Armar el carrito en la misma page

const armadoCarrito = objeto => {
	const item = {
		id: objeto.querySelector("button").dataset.id,
		nombre: objeto.querySelector("h3").textContent,
		precio: objeto.querySelector("p").textContent,
		cantidad: 1
	}

	// If + función para aumentar la cantidad de productos en el carrito

	if (carrito.hasOwnProperty(item.id)) {
		item.cantidad = carrito[item.id].cantidad + 1
	}

	carrito[item.id] = { ...item }
	mostrarCarrito();
};

// Contenido que se mostrará en el carrito

const mostrarCarrito = () => {
	items.innerHTML = " ";
	Object.values(carrito).forEach(item => {
		templateCarrito.querySelector("th").textContent = item.id;
		templateCarrito.querySelectorAll("td")[0].textContent = item.nombre;
		templateCarrito.querySelectorAll("td")[1].textContent = item.cantidad;
		templateCarrito.querySelector(".btn-info").dataset.id = item.id;
		templateCarrito.querySelector(".btn-danger").dataset.id = item.id;
		templateCarrito.querySelector("span").textContent = item.cantidad * item.precio;

		const clone = templateCarrito.cloneNode(true)
		fragment.appendChild(clone)
	});

	items.appendChild(fragment);

	mostrarFooter();

localStorage.setItem("ejemplo", JSON.stringify(carrito))
};

// Armado de footer de carrito para mostrar

const mostrarFooter = () => {
	footer.innerHTML = " ";
	if (Object.keys(carrito).length === 0) {
		footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `
		return;
	};

	// Sumar las cantidad del carrito para sacar el total

	const numCantidad = Object.values(carrito).reduce((acum, { cantidad }) => acum + cantidad, 0);
	const numPrecio = Object.values(carrito).reduce((acum, { cantidad, precio }) => acum + cantidad * precio, 0);
	console.log(numPrecio);

	templateFooter.querySelectorAll("td")[0].textContent = numCantidad;
	templateFooter.querySelector("span").textContent = numPrecio;

	const clone = templateFooter.cloneNode(true);
	fragment.appendChild(clone);
	footer.appendChild(fragment);

	// Le agrego funcionalidad al botón de vaciado de carrito. 

	const btnVaciar = document.getElementById("vaciar-carrito")
	btnVaciar.addEventListener("click", () => {
		carrito = {}
		mostrarCarrito();
		footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `
	});

};

// Le agrego funcionalidad al botón para aumentar y disminuir las cantidades.

const btnAccion = e => {	
	if(e.target.classList.contains("btn-info")){
		const item = carrito[e.target.dataset.id];
		item.cantidad++;
		carrito[e.target.dataset.id] = {...item};
		mostrarCarrito();
	}

	if(e.target.classList.contains("btn-danger")){
		const item = carrito[e.target.dataset.id];
		item.cantidad--;
		if(item.cantidad === 0) {
			delete carrito[e.target.dataset.id]

		}
		mostrarCarrito();
		
}
e.stopPropagation();

};