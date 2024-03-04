<?php
include 'db.php';
session_start();

if (isset($_POST['id'])) {
    $idProducto = $_POST['id'];
    // Realizar la operación que necesitas con $idProducto
    // Preparar y ejecutar la consulta para eliminar el producto
    $sql = "DELETE FROM carritos WHERE id_producto = ? AND email=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $idProducto, $_SESSION['email']);


    $resultado = $stmt->execute();

    // Cerrar la conexión y liberar recursos
    $stmt->close();
    $conn->close();

    // Devolver el resultado de la operación
    echo json_encode(['success' => $resultado]);
} else if (isset($_POST['accion']) && ($_POST['accion'] == "eliminar")) {

    $sql = "DELETE FROM carritos WHERE email=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_SESSION['email']);


    $resultado = $stmt->execute();

    // Cerrar la conexión y liberar recursos
    $stmt->close();
    $conn->close();

    // Devolver el resultado de la operación
    echo json_encode(['success' => $resultado]);
} else {
    // Si el índice "id" no está presente en $_POST, devolver un error
    echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
}
