<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
include('db.php');

class Login
{
    public $email;
    public $contrasenha;
    public $tipo;

    public function __construct($email, $contrasenha, $tipo)
    {
        $this->email = $email;
        $this->contrasenha = $contrasenha;
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
    $email = $_POST['email'];
    $contrasenha = $_POST['contrasenha'];

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Sentencia SQL preparada
    $sql = "SELECT email, contrasenha, tipo FROM usuarios WHERE email=?";

    // Prepara la consulta
    $stmt = $conn->prepare($sql);

    // Vincula el parámetro
    $stmt->bind_param("s", $email);

    // Ejecuta la consulta
    if ($stmt->execute()) {
        // Vincular variables de resultado
        $stmt->bind_result($resultado_email, $resultado_contrasenha, $resultado_tipo);

        // Verifica si se encontraron resultados
        if ($stmt->fetch()) {
            // Verifica la contraseña
            if (password_verify($contrasenha, $resultado_contrasenha)) {
                session_start();
                $login = new Login($email, $contrasenha, $resultado_tipo);
                $_SESSION['email'] = $login->email;
                $_SESSION['tipo'] = $login->tipo;
                $resp = new Respuesta(true, 'Login Correcto');
                echo json_encode($resp);
            } else {
                $resp = new Respuesta(false, 'Contraseña incorrecta');
                echo json_encode($resp);
            }
        } else {
            $resp = new Respuesta(false, 'No se encontró el usuario');
            echo json_encode($resp);
        }

        // Cierra la conexión
        $stmt->close();
        $conn->close();
    } else {
        $resp = new Respuesta(false, 'Error al ejecutar la consulta');
        echo json_encode($resp);
    }
}
