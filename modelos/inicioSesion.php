<?php
include 'db.php';

class InfoUsuario
{
    public $email;
    public $tipo;

    public function __construct($email, $tipo)
    {
        $this->email = $email;
        $this->tipo = $tipo;
    }
}
session_start();
if (isset($_SESSION['email'])) {
    $info = new InfoUsuario($_SESSION['email'], $_SESSION['tipo']);
    echo json_encode($info);
} else {
    echo false;
}
