
let sesionIniciada = false;
let tipoUsuario = 'usuario';
function obtenerEmail() {
    try {
        var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const resp = JSON.parse(this.responseText);
                sesionIniciada = true;
                if (resp.tipo == 'admin') tipoUsuario = 'admin';
                mostrarMenuAdmin();
                document.querySelector('.email').innerHTML = resp.email;
                document.querySelector('.iniciarsesion').style = "visibility:hidden;";
                document.querySelector('.registrarse').style = "visibility:hidden;";
                document.querySelector('.cerrarsesion').style = "visibility:visible;";
            }
        }
        xmlhttp.open("GET", "../modelos/inicioSesion.php", true);
        xmlhttp.send();
    } catch (error) {
        console.log('sesion no iniciada', error);
    }
}

function cerrarSesion(e) {
    e.preventDefault();
    Swal.fire({
        title: "Cerrar Sesión",
        text: "¿Seguro que quieres salir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "No, continuar comprando",
        confirmButtonText: "Sí, quiero salir",
    }).then((result) => {
        if (result.isConfirmed) {
            sesionIniciada = false;
            var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                }
            }
            xmlhttp.open("GET", "../modelos/cierreSesion.php", true);
            xmlhttp.send();
            window.location = 'http://localhost/tienda/vistas/index.html';
        }
    });
}

function comprobarSesionIniciadaCarrito(e) {
    e.preventDefault();
    if (!sesionIniciada) {
        window.location = 'http://localhost/tienda/vistas/login.html';
        return;
    }
    window.location = 'http://localhost/tienda/vistas/carrito.html';
}

function comprobarSesionIniciadaTienda(e) {
    e.preventDefault();
    if (!sesionIniciada) {
        window.location = 'http://localhost/tienda/vistas/login.html';
        return;
    }
}

function mostrarMenuAdmin() {
    if (tipoUsuario === 'admin') {
        document.querySelector('.admin').style.visibility = 'visible';
    }
}


window.addEventListener('DOMContentLoaded', obtenerEmail);

window.addEventListener('DOMContentLoaded', document.querySelector('.cerrarsesion').addEventListener('click', cerrarSesion));

document.querySelector('.carrito').addEventListener('click', comprobarSesionIniciadaCarrito);

document.querySelector('.agregar').addEventListener('click', comprobarSesionIniciadaTienda);

