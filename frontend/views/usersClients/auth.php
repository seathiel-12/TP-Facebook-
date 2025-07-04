<?php
   require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/assets/styles/root.css" type="text/css">
    <title>Authentification-login</title>
</head>
<body id="auth">
         
    <div class="main-auth-content auth-animate-hidden">
    <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="facebook logo" width="300" height="100">

    <p style=" font-size:1.5em; font-weight:600; color:black">Avec Facebook, partagez et restez <br> en contact  avec votre entourage.</p>

    <form method="post" id="form-auth">
        <div>
            <input type="text" placeholder="Adresse e-mail ou numéro de téléphone" required>
            <i class="fa-solid fa-user"></i>
        </div>
        <p id="error-text" class="flexDivIcon" style="color:red; justify-content:flex-start;"></p>
        <div>
            <input type="password" placeholder="Mot de passe" required>
            <i class="fa-solid fa-lock"></i>
        </div>
        <p id="error-password" class="flexDivIcon" style="color:red; justify-content:flex-start;"></p>

        <button type="submit" style="width:100%; padding:15px;">Se connecter</button>
        <p class="forgot-password">Mot de passe oublié?</p>

        <hr>
        <button type="button" style="background:var(--bg-button-secondary); width:60%; padding:15px;" onclick="fetchPageContent('../frontend/views/usersClients/register.php')">Créer un nouveau compte</button>
    </form>

    <p><strong> Créer une page</strong> pour une célébrité, une marque ou une <br> entreprise. </p>
    
    </div>
    <?php require_once  $_SERVER['DOCUMENT_ROOT'].'/frontend/views/includes/footer.html' ?>

    <script>
        lucide.createIcons();
    </script>
    
</body>
</html>