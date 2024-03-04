let data;
const email = document.querySelector('#email');
const contrasenha = document.querySelector('#contrasenha');

document.querySelector('#formlogin').addEventListener('submit', login);
window.addEventListener('DOMContentLoaded', obtenerCredencialesStorage)

function login(e) {
  e.preventDefault();
  // Crea un objeto FormData
  var formData = new FormData();
  formData.append('email', email.value);
  formData.append('contrasenha', contrasenha.value);
  // Realiza la solicitud POST usando XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '../modelos/login.php', true);

  // Define la función de retorno de llamada
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // La solicitud fue exitosa, puedes manejar la respuesta aquí
      res = JSON.parse(xhr.responseText);
      if (res.estado) {
        recordarCredencialesStorage();
        Swal.fire({
          icon: "success",
          title: "Login Correcto",
          text: "Redirigiendo...",
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          window.location.href = "../vistas/index.html";
        }, 1500);

        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.mensaje,
      });
    }
  };
  // Envía la solicitud con los datos del formulario
  xhr.send(formData);

}

function recordarCredencialesStorage() {
  console.log('recordar');
  const checkbox = document.querySelector('#recordar');
  if (checkbox.checked) {
    localStorage.setItem('usuario', email.value);
    localStorage.setItem('contrasenha', contrasenha.value);
  } else {
    localStorage.setItem('usuario', '');
    localStorage.setItem('contrasenha', '');
  }

}

function obtenerCredencialesStorage() {
  if (localStorage.getItem('usuario')) {
    email.value = localStorage.getItem('usuario');
    contrasenha.value = localStorage.getItem('contrasenha');
  }
}