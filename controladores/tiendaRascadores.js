function obtenerProductos() {

    var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const resp = JSON.parse(this.responseText);

            resp.forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('card', 'col-12','col-md-3', 'h-100', 'm-3', 'text-bg-light', 'shadow-lg');


                div.innerHTML += `
                    <img src="${producto.imagen}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${recortarTexto(producto.descripcion)}.</p>
                        <b>${producto.precio} €</b>
                    </div>
                `;
                const btnAgregar = document.createElement('button');
                btnAgregar.textContent = 'Agregar al carrito';
                btnAgregar.classList.add('agregar', 'btn', 'btn-success', 'm-3');
                btnAgregar.addEventListener('click', function () {
                    agregarProducto(producto.ID);
                });
                div.appendChild(btnAgregar);
                document.querySelector('.productos').appendChild(div);

            });
            console.log(resp);
        }
    }
    xmlhttp.open("GET", "../modelos/tiendaRascadores.php", true);
    xmlhttp.send();
}


function agregarProducto(id) {
    var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(id);
            console.log(this.responseText);
            const resp = JSON.parse(this.responseText);
            console.log(resp);

            Swal.fire({
                title: "Producto Agregado",
                text: `Has añadido este producto a tu carrito`,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });

        }
    }
    xmlhttp.open("POST", "../modelos/agregarAlCarrito.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id=" + encodeURIComponent(id));
}
function recortarTexto(texto) {
    if (texto) {
        if (texto.length > 300) {
            return texto.slice(0, 300) + "[...]";
        }
        return texto;
    }
}

document.addEventListener('DOMContentLoaded', obtenerProductos);
