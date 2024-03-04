<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
include('db.php');

class Registro
{
  public $nombre;
  public $apellidos;
  public $email;
  public $direccion;
  public $codigopostal;
  public $telefono;
  public $contrasenha;
  public $repetircontrasenha;
  public $politica;

  public $tipo;

  public function __construct($nombre, $apellidos, $email, $direccion, $codigopostal, $telefono, $contrasenha, $repetircontrasenha, $politica, $tipo)
  {
    // Inicializa las propiedades con los valores proporcionados
    $this->nombre = $nombre;
    $this->apellidos = $apellidos;
    $this->email = $email;
    $this->direccion = $direccion;
    $this->codigopostal = $codigopostal;
    $this->telefono = $telefono;
    $this->contrasenha = $contrasenha;
    $this->repetircontrasenha = $repetircontrasenha;
    $this->politica = $politica;
    $this->tipo = $tipo;
  }
}

class Respuesta
{
  public $estado;
  public $mensaje;

  public function __construct($estado, $mensaje)
  {
    $this->estado = $estado;
    $this->mensaje = $mensaje;
  }
}

// Verifica si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Obtiene los datos del formulario
  $nombre = $_POST['nombre'];
  $apellidos = $_POST['apellidos'];
  $email = $_POST['email'];
  $precio = $_POST['direccion'];
  $codigopostal = $_POST['codigopostal'];
  $telefono = $_POST['telefono'];
  $contrasenha = $_POST['contrasenha'];
  $repetircontrasenha = $_POST['repetircontrasenha'];
  $politica = $_POST['politica'];

  $registro = new Registro($nombre, $apellidos, $email, $precio, $codigopostal, $telefono, password_hash($contrasenha, PASSWORD_DEFAULT), $repetircontrasenha, $politica, 'usuario');


  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  //array de strings con los errores.
  $errores = [];

  //Todos los campos son obligatorios
  if ($nombre == "" | $apellidos == "" | $email == "" | $precio == "" | $codigopostal == "" | $telefono == "" | $contrasenha == "") {
    array_push($errores, "Todos los campos son obligatorios");
  }
  //El codigo postal debe tener 5 caracteres
  if (strlen($codigopostal) != 5) {
    array_push($errores, "El código postal debe ser de 5 dígitos");
  }
//La contraseña debe tener al menos 6 caracteres
  if (strlen($contrasenha) < 6) {
    array_push($errores, "La contraseña debe tener al menos 6 caracteres");
  }
//La contraseña debe ser 
  if ($contrasenha != $repetircontrasenha) {
    array_push($errores, "Las contraseñas introducidas no coinciden entre sí");
  }

  if ($politica == "false") {
    array_push($errores, "Es obligatorio aceptar la política de cookies y protección de datos de la empresa");
  }

  // Verifica si el correo electrónico ya existe en la base de datos
  $productoYaExisteSql = "SELECT * FROM usuarios WHERE email = ?";
  $ProductoYaExisteStmt = $conn->prepare($productoYaExisteSql);
  $ProductoYaExisteStmt->bind_param("s", $registro->email);
  $ProductoYaExisteStmt->execute();
  $productoYaExisteResult = $ProductoYaExisteStmt->get_result();

  if ($productoYaExisteResult->num_rows > 0) {
    array_push($errores, "El correo electrónico ya está registrado");
  }
  $ProductoYaExisteStmt->close();



  if (count($errores) == 0) {
    // Sentencia SQL preparada
    $sql = "INSERT INTO `usuarios` (`nombre`, `apellidos`, `email`, `direccion`, `codigopostal`, `telefono`, `contrasenha`,`tipo`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    // Prepara la consulta
    $stmt = $conn->prepare($sql);

    // Vincula los parámetros
    $stmt->bind_param("ssssisss", $registro->nombre, $registro->apellidos, $registro->email, $registro->direccion, $registro->codigopostal, $registro->telefono, $registro->contrasenha, $registro->tipo);

    // Ejecuta la consulta
    if ($stmt->execute()) {
      $resp = new Respuesta(true, "Nuevo usuario creado.");
      echo json_encode($resp);
    } else {
      echo "Error: " . $sql . "<br>" . $stmt->error;
    }
    // Cierra la conexión
    $stmt->close();
    $conn->close();
  } else {
    $resp = new Respuesta(false, $errores);
    echo json_encode($resp);
  }
}
