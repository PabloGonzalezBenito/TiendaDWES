<?php
include 'db.php';
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');

class Producto
{
    public $ID;
    public $nombre;
    public $categoria;
    public $imagen;
    public $precio;
    public $descripcion;

    public function __construct($ID, $nombre, $categoria, $imagen, $precio, $descripcion)
    {
        $this->ID = $ID;
        $this->nombre = $nombre;
        $this->categoria = $categoria;
        $this->imagen = $imagen;
        $this->precio = $precio;
        $this->descripcion = $descripcion;
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

//Obtener todos los productos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $productos = [];
    $query = "SELECT * FROM productos";
    $result_tasks = mysqli_query($conn, $query);

    while ($row = mysqli_fetch_assoc($result_tasks)) {
        $producto = new Producto($row['ID'], $row['nombre'], $row['categoria'], $row['imagenurl'], $row['precio'], $row['descripcion']);

        array_push($productos, $producto);
    }
    echo json_encode($productos);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    //Eliminar un producto
    if (isset($_POST['ID'])) {
        $ID = $_POST['ID'];

        // Comprobar si el producto ya existe en el carrito del usuario
        $sql = "DELETE FROM productos WHERE ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $ID);
        $resultado = $stmt->execute();
        $stmt->close();


        // Cerrar la conexión y liberar recursos
        $conn->close();

        // Devolver el resultado de la operación
        echo json_encode(['success' => $resultado]);

        //Agregar nuevo producto
    } else {

        // Obtiene los datos del formulario
        $nombre = $_POST['nombre'];
        $categoria = $_POST['categoria'];
        $imagen = $_POST['imagen'];
        $precio = $_POST['precio'];
        $descripcion = $_POST['descripcion'];

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        //array de strings con los errores.
        $errores = [];

        //Todos los campos son obligatorios
        if ($nombre == "" | $categoria == "" | $imagen =="" | $precio == 0 | $descripcion == "") {
            array_push($errores, "Todos los campos son obligatorios");
        }

        // Verifica si el producto ya existe en la base de datos
        $productoYaExisteSql = "SELECT * FROM productos WHERE nombre = ?";
        $ProductoYaExisteStmt = $conn->prepare($productoYaExisteSql);
        $ProductoYaExisteStmt->bind_param("s", $nombre);
        $ProductoYaExisteStmt->execute();
        $productoYaExisteResult = $ProductoYaExisteStmt->get_result();

        if ($productoYaExisteResult->num_rows > 0) {
            array_push($errores, "Ya existe un producto con ese nombre");
        }
        $ProductoYaExisteStmt->close();



        if (count($errores) == 0) {
            // Sentencia SQL preparada
            $sql = "INSERT INTO `productos` (`nombre`, `categoria`, `imagenurl`, `precio`, `descripcion`) VALUES (?, ?, ?, ?, ?)";

            // Prepara la consulta
            $stmt = $conn->prepare($sql);

            // Vincula los parámetros
            $stmt->bind_param("sssis", $nombre, $categoria, $imagen, $precio, $descripcion);

            // Ejecuta la consulta
            if ($stmt->execute()) {
                $resp = new Respuesta(true, "Nuevo producto creado.");
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
}

//
