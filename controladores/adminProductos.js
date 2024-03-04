function obtenerProductos() {

    var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const resp = JSON.parse(this.responseText);
            mostrarProductosHTML(resp);
        }
    }
    xmlhttp.open("GET", "../modelos/adminProductos.php", true);
    xmlhttp.send();
}


function mostrarProductosHTML(productos) {
    while (document.querySelector('.productos').firstChild) {
        document.querySelector('.productos').firstChild.remove();
    }
    productos.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'shadow-lg', 'd-flex', 'justify-content-between', 'align-items-center', 'p-3');
        const { ID, imagen, nombre, categoria, precio, descripcion } = producto;
        li.innerHTML = `
                    <span class='col'><img class='img-fluid' src="${imagen}"></span><span class='col'><b>${nombre}</b> - ${categoria}</span> <span class='col h3'>${precio} €</span><span class='col-7'>${descripcion}</span>
                `;

        const btnBorrar = document.createElement('button');
        btnBorrar.textContent = 'X';
        btnBorrar.classList.add('agregar', 'btn', 'btn-danger', 'm-3');
        btnBorrar.addEventListener('click', function () {
            borrarProducto(ID);
        });
        li.appendChild(btnBorrar);

        document.querySelector('.productos').appendChild(li);

    });

}
function borrarProducto(ID) {
    Swal.fire({
        title: "Borrar producto",
        text: "¿Seguro que quieres borrar el producto?",
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

                    obtenerProductos();
                }
            }
            xmlhttp.open("POST", "../modelos/adminProductos.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("ID=" + encodeURIComponent(ID));
        }
    });
}

function registrarProducto(event) {
    event.preventDefault();
    console.log("registrarProducto");

    ////////////////////////////

    const nombre = document.querySelector('#nombre');
    const categoria = document.querySelector('#categoria');
    const imagen = document.querySelector('#imagen');
    const precio = document.querySelector('#precio');
    const descripcion = document.querySelector('#descripcion');

    console.log({
        nombre: nombre.value,
        categoria: categoria.value,
        imagen: imagen.value,
        precio: precio.value,
        descripcion: descripcion.value
    });
    var formData = new FormData();
    formData.append('nombre', nombre.value);
    formData.append('categoria', categoria.value);
    formData.append('imagen', imagen.value);
    formData.append('precio', precio.value);
    formData.append('descripcion', descripcion.value);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../modelos/adminProductos.php', true);


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // La solicitud fue exitosa, puedes manejar la respuesta aquí
            resp = (JSON.parse(xhr.responseText));
            if (!resp.estado) {
                errorsHTML = '';
                resp.mensaje.forEach(error => {
                    console.log(error);
                    errorsHTML += `<p style='color:red'>${error}</p>`;
                    console.log(errorsHTML);
                });
                console.log(errorsHTML);
                alert = Swal.fire({
                    icon: "error",
                    title: "Error",
                    html: errorsHTML,
                });

            } else {
                Swal.fire({
                    icon: "success",
                    title: "Registro Correcto",
                    text: "Nuevo registro creado",
                    showConfirmButton: false,
                    timer: 1500
                });
                obtenerProductos();
            }
        };
        // Envía la solicitud con los datos del formulario
    }
    xhr.send(formData);
}

document.addEventListener('DOMContentLoaded', obtenerProductos);
document.querySelector('#formregistro').addEventListener('submit', registrarProducto);
