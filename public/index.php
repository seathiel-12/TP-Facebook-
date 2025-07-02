<?php 
    use App\ApiCall;
    require '../vendor/autoload.php';
    $uri=explode('/',$_SERVER['REQUEST_URI']);
    if(in_array('api',$uri)){
       new ApiCall()->requestTreatment(); 
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentification-login</title>
    <link rel="stylesheet" href="../assets/styles/root.css" type="text/css">
    <link rel="stylesheet" href="../assets/styles/login.css" type="text/css">
    <link rel="stylesheet" href="../assets/styles/home.css" type="text/css">
    <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>   
    <link href='https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css' rel='stylesheet'>
    
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="https://unpkg.com/lucide@latest">lucide.createIcons();</script>
    <script src="https://code.iconify.design/3/iconify.min.js"></script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    <script src="../assets/js/main.js" defer></script>
</head>
<body id="register">
       <?php /*require '../frontend/views/includes/header.html' ?>
    <main>
       <?php require '../frontend/views/includes/sidebar.html'?> 
       <?php require '../frontend/views/includes/chat.html'; ?>
    </main> ?>

    <?php require '../frontend/views/usersClients/auth.php'*/; 
    // echo (new DateTime('11:32:05')->diff(new DateTime('10:45:50')))->format('%h heures et %i minutes.').'<br>';
    // echo new DateTime(date('H:i:s'))->getTimestamp() - new DateTime('09:15:05')->getTimestamp();
    // echo '<pre>';
    // print_r($_SERVER);
    // echo '</pre>';
    echo new DateTime(date('H:i:s'))->getTimestamp()
    // require 'frontend/views/usersClients/register.php';

    ?>

</body>
</html>

