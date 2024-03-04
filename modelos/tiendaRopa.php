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
$productos = [];
$query = "SELECT * FROM productos WHERE categoria='Ropa'";
//mysqli_query es la funcion PHP que realiza consultas.
//Tiene 2 parametros, la primera es la variable que contiene la info de la conexion
//La segunda es la consulta a realizar
$result_tasks = mysqli_query($conn, $query);

//se recogen los registros en un array. Mientras no se llegue al final del array,
//se sigue iterando en el while
while ($row = mysqli_fetch_assoc($result_tasks)) {
    $producto = new Producto($row['ID'], $row['nombre'], $row['categoria'], $row['imagenurl'], $row['precio'], $row['descripcion']);

    array_push($productos, $producto);
}
echo json_encode($productos);
