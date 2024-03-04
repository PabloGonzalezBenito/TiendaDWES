<?php

$conn = mysqli_connect(
  'localhost', //servidor
  'root', //usuario
  '', //contraseña
  'tienda' //nombre de la BBDD
) or die(mysqli_error($conn)); //si falla la conexion
