<?php
include 'db.php';
session_start();
session_unset();
session_destroy();
echo "Sesion cerrada";