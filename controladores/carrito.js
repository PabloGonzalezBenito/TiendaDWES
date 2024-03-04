// const carrito = document.querySelector('.carrito');
// console.log('js carrito');

// function mostrarProductos(e) {
//     e.preventDefault();
//     console.log('raton encima del carrito');

//     var xmlhttp = new XMLHttpRequest(); //Creo un objeto de tipo XMLHttpRequest
//     xmlhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log(this.responseText);
//             const resp = JSON.parse(this.responseText);
//             // if (!resp.estado) {
//             //     document.querySelector(".mostrarCarrito").innerHTML = `<h3>${resp.mensaje}</h3>`
//             //     return;
//             // }
//             if (!document.querySelector('.mostrarCarrito')) {
//                 const div = document.createElement('div');
//                 div.classList.add('mostrarCarrito', 'text-bg-light', 'shadow');
//                 div.innerHTML = `
//                <ul class="list-group p-5">
//                `;
//                 resp.forEach(product => {
//                     div.innerHTML += `
//                     <li class="list-group-item"> <img width="100px" class="img-fluid" src="${product.imagen}"> ${product.nombre} - ${product.categoria} - ${product.precio}</li>
//                     <hr/>
//                     `;
//                 });

//                 div.innerHTML += `</ul>`;

//                 document.querySelector('body').appendChild(div);
//             }
//         }
//     }
//     xmlhttp.open("GET", "../modelos/carrito.php", true);
//     xmlhttp.send();
// }

// function noMostrarProductos() {
//     document.querySelector('.mostrarCarrito').remove();
// }

// document.querySelector('.carrito').addEventListener('mouseover', mostrarProductos);
// document.querySelector('.carrito').addEventListener('mouseleave', noMostrarProductos);
