<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
    header('Referrer-Policy: same-origin');
    header("X-Content-Type-Options: no-referrer");
    require_once $_SERVER['DOCUMENT_ROOT'].'/backend/config.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
    
    

    // session_start();
    // echo '<pre>';
    // print_r($_SESSION);
    // echo '</pre>';
    // exit();

