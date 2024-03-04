
let productos = [];

function obtenerProductos(e) {
    e.preventDefault();

    var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            productos = JSON.parse(this.responseText);
            mostrarResumenHTML(productos);
        }
    }
    xmlhttp.open("GET", "../modelos/carrito.php", true);
    xmlhttp.send();
}

function validarFormulario() {
    const nombre = document.querySelector('#nombre');
    const numeroTarjeta = document.querySelector('#numeroTarjeta');
    const mes = document.querySelector('#mes');
    const anho = document.querySelector('#anho');

    if (nombre.value === "" || numeroTarjeta.value === "" || mes.value === "" || anho.value === "") {
        return "Todos los campos son obligatorios";
    }

    return "Pedido realizado correctamente";

}


function mostrarResumenHTML(resp) {
    console.log(resp.length);
    if (!resp.length) {
        document.querySelector('.resumen ul').innerHTML = '<li class="list-group-item text-center"><b>Tu carrito está vacío</b></li>';
        return;
    }

    let sumaTotalPrecio = 0;
    if (resp.length > 0) {
        resp.forEach(product => {
            sumaTotalPrecio += product.precio * product.cantidad;
            console.log(sumaTotalPrecio);
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'text-center');
            li.innerHTML += `${product.nombre} - ${product.cantidad} unidades -  ${(product.precio * product.cantidad).toFixed(2)} €.`;
            document.querySelector('.pedido').appendChild(li);
        });
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'text-center');
        li.innerHTML = `<h4>El coste total del pedido es de ${sumaTotalPrecio.toFixed(2)}€.</h4>`
        document.querySelector('.pedido').appendChild(li);
    }
}

function confirmarPedido(e) {
    e.preventDefault();
    const validado = validarFormulario();
    if (validado == "Pedido realizado correctamente") {
        Swal.fire({
            title: "Pedido Confirmado",
            text: validado,
            icon: "success",
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        Swal.fire({
            title: "Error",
            text: validado,
            icon: "error",
            showConfirmButton: false,
            timer: 1500
        });
    }
}


window.addEventListener('DOMContentLoaded', obtenerProductos);
document.querySelector('#formregistro').addEventListener("submit", confirmarPedido);