<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');


include('db.php');
session_start();

class Producto
{
    public $ID;
    public $nombre;
    public $categoria;
    public $imagen;
    public $precio;
    public $cantidad;

    public function __construct($ID, $nombre, $categoria, $imagen, $precio,$cantidad)
    {
        $this->ID =$ID;
        $this->nombre = $nombre;
        $this->categoria = $categoria;
        $this->imagen = $imagen;
        $this->precio = $precio;
        $this->cantidad = $cantidad;
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

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_SESSION['email'])) {
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Sentencia SQL preparada
    $sql = "SELECT productos.ID, productos.nombre, productos.categoria, productos.imagenurl, productos.precio, IFNULL(carritos.cantidad, 0) as cantidad 
    FROM productos
    LEFT JOIN carritos ON productos.ID = carritos.ID_producto AND carritos.email = ?
    WHERE IFNULL(carritos.cantidad, 0) > 0";


    // Prepara la consulta
    $stmt = $conn->prepare($sql);

    // Vincula el parámetro
    $stmt->bind_param("s", $_SESSION['email']);

    // Ejecuta la consulta
    if ($stmt->execute()) {
        // Vincular variables de resultado
        $stmt->bind_result($resultado_ID, $resultado_nombre, $resultado_categoria, $resultado_imagenurl, $resultado_precio, $resultado_cantidad);

        // Inicializar un array para almacenar los productos
        $productos = [];

        // Recorrer todos los resultados
        while ($stmt->fetch()) {
            // Crear un objeto Producto y añadirlo al array
            $producto = new Producto($resultado_ID, $resultado_nombre, $resultado_categoria, $resultado_imagenurl, $resultado_precio, $resultado_cantidad);
            array_push($productos, $producto);
        }

        // Verificar si se encontraron resultados
        if (!empty($productos)) {
            // Se encontraron productos en el carrito
            echo json_encode($productos);
        } else {
            // No se encontraron productos en el carrito
            $resp = new Respuesta(false, 'No se encontraron productos en el carrito');
            echo json_encode($resp);
        }

        // Cierra la conexión
        $stmt->close();
        $conn->close();
    } else {
        // Error al ejecutar la consulta
        $resp = new Respuesta(false, 'Error al ejecutar la consulta');
        echo json_encode($resp);
    }
} else {
    echo "no esta definido la variable de sesion";
}
