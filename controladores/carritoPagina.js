
let productos = [];

function obtenerProductos(e) {
    e.preventDefault();

    var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            productos = JSON.parse(this.responseText);
            mostrarProductosHTML(productos);
        }
    }
    xmlhttp.open("GET", "../modelos/carrito.php", true);
    xmlhttp.send();
}



function eliminarProducto(id) {
    var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const resp = JSON.parse(this.responseText);
            console.log(resp);
            if (resp.success) {
                Swal.fire({
                    title: "Producto Eliminado",
                    text: `Has eliminado este producto de tu carrito`,
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log(productos);
                console.log(id);
                productos = productos.filter(producto => producto.ID != id);
                console.log(productos);
                document.querySelector('.productos').innerHTML = '';
                document.querySelector('.list-group-flush').innerHTML = '';
                mostrarProductosHTML(productos);
                mostrarResumenHTML(productos);
            }
        }
    }
    xmlhttp.open("POST", "../modelos/carritoPagina.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id=" + encodeURIComponent(id));
}

function mostrarProductosHTML(resp) {
    if (!resp.length) {
        document.querySelector('.productos').innerHTML = `<h3>No hay productos en tu carrito</h3>`;
        return;
    }
    resp.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('card', 'mb-3', 'shadow');
        div.style = "max-width:1040px";
        div.innerHTML += `
                    
                    <div class="row g-0">
                      <div class="col-md-4">
                        <img src="${product.imagen}" class="img-fluid rounded-start" alt="${product.nombre}">
                      </div>
                      <div class="col-md-8">
                        <div class="card-body">
                          <h5 class="card-title">${product.nombre}</h5>
                          <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                          <p>Precio por unidad: ${product.precio.toFixed(2)} €</p>
                          <p>Cantidad en el carrito: ${product.cantidad} unidades</p>
                          <b>Precio total: ${(product.precio * product.cantidad).toFixed(2)} €</b>

                          <p class="card-text"><small class="text-body-secondary">${product.categoria}</small></p>
                        </div>
                      </div>
                    </div>
                  
                    `;
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar del carrito';
        btnEliminar.classList.add('eliminar', 'btn', 'btn-danger', 'm-3');
        btnEliminar.addEventListener('click', function () {
            eliminarProducto(product.ID);
        });

        div.appendChild(btnEliminar);
        document.querySelector('.productos').appendChild(div);

    });

    mostrarResumenHTML(resp);
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
            document.querySelector('.list-group-flush').appendChild(li);
        });
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'text-center');
        li.innerHTML = `<h4>El coste total del pedido es de ${sumaTotalPrecio.toFixed(2)}€.</h4>`
        document.querySelector('.list-group-flush').appendChild(li);
    }
}

function vaciarCarrito() {
    Swal.fire({
        title: "Vaciar carrito",
        text: "¿Seguro que quieres eliminar todos los productos de tu carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "No",
        confirmButtonText: "Sí",
    }).then((result) => {
        if (result.isConfirmed) {

            var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const resp = JSON.parse(this.responseText);
                    console.log(this.responseText);
                    document.querySelector('.resumen ul').innerHTML = '<li class="list-group-item text-center"><b>Tu carrito está vacío</b></li>';

                }
            }
            xmlhttp.open("POST", "../modelos/carritoPagina.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("accion=eliminar");
        }


    })
}


window.addEventListener('DOMContentLoaded', obtenerProductos);
document.querySelector('.vaciar').addEventListener('click', vaciarCarrito);