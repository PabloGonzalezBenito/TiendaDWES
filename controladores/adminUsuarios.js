function obtenerUsuarios() {

    var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const resp = JSON.parse(this.responseText);
            mostrarProductosHTML(resp);
        }
    }
    xmlhttp.open("GET", "../modelos/adminUsuarios.php", true);
    xmlhttp.send();
}


function mostrarProductosHTML(usuarios) {
    while (document.querySelector('.usuarios').firstChild) {
        document.querySelector('.usuarios').firstChild.remove();
    }
    usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'shadow-lg', 'd-flex', 'justify-content-between', 'align-items-center', 'px-3');
        console.log(usuario);
        const { nombre, apellidos, email, direccion, codigopostal, telefono, tipo } = usuario;
        li.innerHTML = `
                    <span><b>${nombre} ${apellidos}</b> - ${email}.</span> <span><b>Dirección:</b> ${direccion}. <b>CP:</b> ${codigopostal}</span><span><b>Teléfono:</b> ${telefono}.</span> <span class='tipo'><i>${tipo}</i></span>
                `;
        if (tipo !== 'admin') {
            const btnBorrar = document.createElement('button');
            btnBorrar.textContent = 'X';
            btnBorrar.classList.add('agregar', 'btn', 'btn-danger', 'm-3');
            btnBorrar.addEventListener('click', function () {
                borrarProducto(email);
            });
            li.appendChild(btnBorrar);
        } else {
            li.classList.add('bg-success', 'py-4');
        }
        document.querySelector('.usuarios').appendChild(li);

    });

}


function borrarProducto(email) {
    Swal.fire({
        title: "Borrar usuario",
        text: "¿Seguro que quieres borrar el usuario?",
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

                    obtenerUsuarios();
                }
            }
            xmlhttp.open("POST", "../modelos/adminUsuarios.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("email=" + encodeURIComponent(email));
        }
    });
}


document.addEventListener('DOMContentLoaded', obtenerUsuarios);
