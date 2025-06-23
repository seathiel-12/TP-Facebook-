<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../../assets/styles/root.css" type="text/css">
    <title>Authentification-login</title>
    <style>
        footer{
            padding: 10px;
            box-shadow: 0 0 15px 0 rgba(11, 11, 11, 0.3);
            border-radius: 10px;
        }
        footer ul{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            width: 95%;
            margin: 0 auto;
            font-size: 14px;
        }
        li{
            list-style: none;
        }
        a{
            text-decoration: none;
            color: gray;
        }
        a:hover{
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="facebook logo" width="300" height="100">

    <p style=" font-size:1.5em; font-weight:600; color:black">Avec Facebook, partagez et restez <br> en contact  avec votre entourage.</p>

    <form method="post">
        <input type="hidden" hidden name="csrf" value="csrf_value">
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
        <button type="button" style="background:var(--bg-button-secondary); width:60%; padding:15px;" onclick="fetchPageContent('register.php')">Créer un nouveau compte</button>
    </form>

    <p><strong> Créer une page</strong> pour une célébrité, une marque ou une <br> entreprise. </p>
    
    <?php include '../frontend/views/includes/footer.html'; ?>
    <script>
        lucide.createIcons();
    </script>
    
</body>
</html>