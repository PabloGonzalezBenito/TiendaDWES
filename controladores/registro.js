const nombre = document.querySelector('#nombre');
const apellidos = document.querySelector('#apellidos');
const email = document.querySelector('#email');
const direccion = document.querySelector('#direccion');
const codigopostal = document.querySelector('#codigopostal');
const telefono = document.querySelector('#telefono');
const contrasenha = document.querySelector('#contrasenha');
const repetircontrasenha = document.querySelector('#repetircontrasenha');
const politica = document.querySelector('#politica');
const formregistro = document.querySelector('#formregistro');

let errorsHTML = "";

formregistro.addEventListener('submit', registro);

function registro(e) {
   e.preventDefault();
   // Crea un objeto FormData
   var formData = new FormData();
   formData.append('nombre', nombre.value);
   formData.append('apellidos', apellidos.value);
   formData.append('email', email.value);
   formData.append('direccion', direccion.value);
   formData.append('codigopostal', codigopostal.value);
   formData.append('telefono', telefono.value);
   formData.append('contrasenha', contrasenha.value);
   formData.append('repetircontrasenha', repetircontrasenha.value);
   formData.append('politica', politica.checked);

   // Realiza la solicitud POST usando XMLHttpRequest
   var xhr = new XMLHttpRequest();
   xhr.open('POST', '../modelos/registro.php', true);

   // Define la función de retorno de llamada
   xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
         // La solicitud fue exitosa, puedes manejar la respuesta aquí
         resp = (JSON.parse(xhr.responseText));
         console.log(resp.mensaje);
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

         } else{
            Swal.fire({
               icon: "success",
               title: "Registro Correcto",
               text: "Redirigiendo...",
               showConfirmButton:false,
               timer:1500
             });
             setTimeout(()=>{
               window.location.href = "../vistas/login.html";
             },1500);
         }
      }
   };
   // Envía la solicitud con los datos del formulario
   xhr.send(formData);
}

