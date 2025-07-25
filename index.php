<?php 
    use App\ApiCall;
    require_once 'headers.php';
    session_start();

    // var_dump($_SESSION);
    //     exit();
    $uri=explode('/',$_SERVER['REQUEST_URI']);
    if(in_array('api',$uri)){
       new ApiCall()->requestTreatment(); 
       exit();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta description="Site clone de facebook, ">

    <title>Authentification-login</title>
    <link rel="stylesheet" href="/assets/styles/root.css" type="text/css">
    <link rel="stylesheet" href="/assets/styles/login.css" type="text/css">
    <link rel="stylesheet" href="/assets/styles/home.css" type="text/css">
    <link rel="stylesheet" href="/assets/styles/friends.css" type="text/css">
    <link rel="stylesheet" href="/assets/styles/profil.css" type="text/css">
    <link rel="stylesheet" href="/assets/styles/messenger.css" type="text/css">

    <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>   
    <link href='https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css' rel='stylesheet'>
    
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="https://code.iconify.design/3/iconify.min.js"></script> 
    <script src="https://unpkg.com/lucide@latest">lucide.createIcons();</script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    <script src="/assets/js/modules/auth.js" defer type="module"></script>
    <script src="/assets/js/icons.js" defer></script>
    <script src="/assets/js/main.js" defer></script>
</head>

<body>
    <?php 
        if(isset($_SESSION['id'])&& isset($_SESSION['connect']) && $_SESSION['connect'])
            require_once 'frontend/views/includes/header.php';
    ?>
    <main>

    </main>
</body>

</html>