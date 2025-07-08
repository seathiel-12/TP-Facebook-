<?php
    session_start();
    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
</head>
<body id="home">
    <?php require '../includes/header.php'; ?>
    <main>
       <?php require '../includes/sidebar.php';?> 
       <?php require '../includes/chat.php'; ?>
    </main>  
    <input type="hidden" id="csrf_token" value="<?= $_SESSION['csrf_token']; ?>">
    <input type="hidden" id="me" value="<?= $_SESSION['id']; ?>">
</body>
</html>