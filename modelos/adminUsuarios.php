<?php
include 'db.php';
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');

class Usuario
{
  public $nombre;
  public $apellidos;
  public $email;
  public $direccion;
  public $codigopostal;
  public $telefono;

  public $tipo;

  public function __construct($nombre, $apellidos, $email, $direccion, $codigopostal, $telefono, $tipo)
  {
    // Inicializa las propiedades con los valores proporcionados
    $this->nombre = $nombre;
    $this->apellidos = $apellidos;
    $this->email = $email;
    $this->direccion = $direccion;
    $this->codigopostal = $codigopostal;
    $this->telefono = $telefono;
    $this->tipo = $tipo;
  }
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

  $usuarios = [];
  $query = "SELECT * FROM usuarios";
  //mysqli_query es la funcion PHP que realiza consultas.
  //Tiene 2 parametros, la primera es la variable que contiene la info de la conexion
  //La segunda es la consulta a realizar
  $result_tasks = mysqli_query($conn, $query);

  //se recogen los registros en un array. Mientras no se llegue al final del array,
  //se sigue iterando en el while
  while ($row = mysqli_fetch_assoc($result_tasks)) {
    $usuario = new Usuario($row['nombre'], $row['apellidos'], $row['email'], $row['direccion'], $row['codigopostal'], $row['telefono'], $row['tipo']);

    array_push($usuarios, $usuario);
  }
  echo json_encode($usuarios);
}

//Eliminar a un usuario

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  if (isset($_POST['email'])) {
    $email = $_POST['email'];

    // Comprobar si el producto ya existe en el carrito del usuario
    $sql = "DELETE FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $resultado = $stmt->execute();
    $stmt->close();


    // Cerrar la conexión y liberar recursos
    $conn->close();

    // Devolver el resultado de la operación
    echo json_encode(['success' => $resultado]);
  }
}
