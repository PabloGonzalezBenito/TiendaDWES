<?php
include 'db.php';
session_start();

if (isset($_POST['id'])) {
    $idProducto = $_POST['id'];
    $email = $_SESSION['email'];

    // Comprobar si el producto ya existe en el carrito del usuario
    $sql = "SELECT cantidad FROM carritos WHERE email = ? AND id_producto = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $email, $idProducto);
    $stmt->execute();
    $stmt->bind_result($cantidad);
    $stmt->fetch();
    $stmt->close();

    // Si no existe, lo creamos y le asignamos la cantidad 1
    if ($cantidad === null) {
        // Preparar y ejecutar la consulta para insertar el producto en el carrito
        $sql = "INSERT INTO carritos (id_producto, cantidad, email) VALUES (?, 1, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $idProducto, $email);
        $resultado = $stmt->execute();
        $stmt->close();
    } else {
        // Si existe, le sumamos 1 a la cantidad
        $sql = "UPDATE carritos SET cantidad = cantidad + 1 WHERE email = ? AND id_producto = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $email, $idProducto);
        $resultado = $stmt->execute();
        $stmt->close();
    }

    // Cerrar la conexión y liberar recursos
    $conn->close();

    // Devolver el resultado de la operación
    echo json_encode(['success' => $resultado]);
} else {
    // Si el índice "id" no está presente en $_POST, devolver un error
    echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
}
