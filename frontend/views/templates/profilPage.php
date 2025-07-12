<?php session_start(); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../../../assets/styles/root.css" type="text/css">
    <link rel="stylesheet" href="../../../assets/styles/login.css" type="text/css">
    <link rel="stylesheet" href="../../../assets/styles/home.css" type="text/css">
    <link rel="stylesheet" href="../../../assets/styles/friends.css" type="text/css">
    <link rel="stylesheet" href="../../../assets/styles/profil.css" type="text/css">


    <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>   
    <link href='https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css' rel='stylesheet'>
    
    <!-- <script src="https://unpkg.com/feather-icons"></script>
    <!-- <script src="https://code.iconify.design/3/iconify.min.js"></script> --> 
    <script src="https://unpkg.com/lucide@latest">lucide.createIcons();</script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    <script src="../../../assets/js/modules/auth.js" defer type="module"></script>
    <script src="../../../assets/js/icons.js" defer></script>

</head>
<body id="profil">
    
    <?php require '../includes/header.php'; ?>

    <main>
        <section class="profil-pictures">
            
                <form class="noFormRootStyle" style="max-width: 100%!important; width:73%; margin:auto; position:relative;">
                    <label for="cover" class="profil-cover">
                        <input type="file" id="cover" hidden>
                    </label>

                    <label for="profile_picture" class="profil-photo flexDiv">
                            <input type="file" hidden id="profile_picture">

                            <img src="../../../assets/media/images/female.png" width="170" height="170" style="border-radius:100%; background:white;" alt="">
                        <div class="rounded-icon camera flexDiv standard-hover"><i data-lucide="camera"></i></div>
                    </label>
                </form>

                <div class="username">
                        <h1><?= $_SESSION['username'] ?></h1>

                        <div><button class="flexDiv" style="background:rgba(136, 136, 136, 0.58); color: black;"> <i data-lucide="pencil" stroke="#d5d5d5" fill="#000" ></i> Modifier votre profil</button></div>
                </div>  

                <hr style="width: 70%; margin:15px auto;">
            
                <nav>
                    <ul class="flexDivStart">
                     <li style="border-bottom: solid 4px var(--bg-button-primary); color: var(--bg-button-primary);">Publications</li>
                        <li>A propos</li>
                        <li>Ami(e)s</li>                
                    </ul>
                </nav>
        
        </section>

        <section class="flexDiv main-profil">
            <div class="left">
                <div class="">
                    <h2 style="text-align: left;">Intro</h2>

                    <button style="width: calc(100% - 30px); padding: 10px; color: black; background: var(--bg-button-tertiary);">Ajouter une bio</button>
                    <button style="width: calc(100% - 30px); padding: 10px; color: black; background: var(--bg-button-tertiary);">Modifier les infos</button>
                </div>
            </div>
            
            <div class="publications">
                <h2>Publi</h2>
            </div>
        </section>
        
    </main>

</body>
</html>

<script>
    lucide.createIcons();
</script>