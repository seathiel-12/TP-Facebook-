<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
    header('Referrer-Policy: no-referrer');
    header("X-Content-Type-Options: nosniff");
    require_once $_SERVER['DOCUMENT_ROOT'].'/backend/config.php';
    
    
//     echo '<pre>';
//     print_r($_SERVER);
//     echo '</pre>';
// exit();
