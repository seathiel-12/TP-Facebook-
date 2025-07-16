<?php session_start(); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>


    <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>   
    <link href='https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css' rel='stylesheet'>
    
     <script src="https://unpkg.com/feather-icons"></script>
    <!-- <script src="https://code.iconify.design/3/iconify.min.js"></script> --> 
    <script src="https://unpkg.com/lucide@latest">lucide.createIcons();</script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    <script src="../../../assets/js/modules/auth.js" defer type="module"></script>
    <script src="../../../assets/js/icons.js" defer></script>
    <script src="../../../assets/js/modules/profil.js" defer></script>

</head>
<body id="profil">
    
    <?php require '../includes/header.php'; ?>

    <main>
        <section class="profil-pictures">
                <form class="noFormRootStyle" style="max-width: 100%!important; width:73%; margin:auto; position:relative;">
                    <div class="profil-cover" 
                        <?php 
                        if($_SESSION['cover_picture'])  
                        echo "style='background-image: url(". $_SESSION['cover_picture'] . ");
                            background-size: cover;
                            background-repeat: no-repeat;
                          '  
                        ";
                        ?>
                    ;">
                    
                </div>

                    <div class="profil-photo flexDiv">   
                             <?php 
                                if($_SESSION['profile_picture']);  
                                echo "<img width='170' height='170' id='profile-picture' style='border-radius:100%; background:white;' src='". $_SESSION['profile_picture'] . "'/>";
                            ?>

                        <div class="rounded-icon camera flexDiv standard-hover"><i data-lucide="camera"></i></div>
                    </div>
                </form>

                <div class="username">
                        <h1 id="username">
                            <?= $_SESSION['username'] ?>
                        </h1>

                        <div class="profil-btn">
                            <button class="flexDiv edit-profil" style="background:rgba(136, 136, 136, 0.58); color: black;"> <i data-lucide="pencil" stroke="#d5d5d5" fill="#000" ></i> Modifier votre profil</button>
                        </div>
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

        <section class="main-profil">
            <div class="left"> 
                <div class="card user-info" style="border-radius: 10px; background: white; padding:10px; margin: 0 0 10px !important;">
                    <h2 style="text-align: left;">Intro</h2>
                    <button style="width: calc(100% - 30px); padding: 10px; color: black; background: var(--bg-button-tertiary);">Ajouter une bio</button>
                    <button style="width: calc(100% - 30px); padding: 10px; color: black; background: var(--bg-button-tertiary);">Modifier les infos</button>
                </div>
                <div class="flexDivBetween card" style="border-radius: 10px; background: white; padding:10px 20px; margin:  15px 0 !important; width: calc(100% - 40px);">
                    <h3>Ami(e)s</h3>
                    <a style="color:var(--bg-button-primary);">Tou(te)s les ami(e)s</a>
                </div>
                <div class="">
                    
                </div>
            </div>
            
            <div class="publications flexDiv" style="flex-direction:column;">
                <div class="home-top-post card" style="margin:10px 0;">
                    <div>
                        <div class="noFormRootStyle flexDiv" style="width:95%; padding:0 10px;">
                             <?php 
                                if($_SESSION['profile_picture']);  
                                echo "<img width='50' height='50' style='border-radius:100%; background:white;' src='   ". $_SESSION['profile_picture'] . "'/>";
                            ?>
                            <div style="background-color:rgba(212, 212, 212, 0.74); width:100%; padding: 12px 10px 10px; margin:10px; text-align:left; border-radius:50px;" class="standard-hover createPostBtn">Quoi de neuf, <?= $_SESSION['username'] ?>?</div>
                        </div>
                        <hr style="border-color:rgba(210, 210, 210, 0.32); margin:5px 0; ">
                    </div>
                    <div class="flexDivIcon">
                        <div class="flexDivIcon options standard-hover"><i data-lucide="video" fill="red" stroke="red"></i> <p>Video en direct</p></div>
                        <div class="flexDivIcon options standard-hover"><i data-lucide="images" stroke="rgb(115, 227, 145)" ></i> <p>Photo et Video</p></div>
                        <div class="flexDivIcon options standard-hover"><i data-lucide="smile" stroke="rgb(215, 224, 90)"></i> <p>Humeur/Activité</p></div>
                    </div>
                </div>
                
                <div class="publications-done loaded-posts">

                </div>
            </div>

        </section>
        <input type="hidden" id="me" value="<?= $_SESSION['id']?>">

        <form class="noFormRootStyle modal card on-window-click-close" style="max-width:100%!important;" enctype="multipart/form-data">
    <h2 style="padding:10px; width:calc(100% - 20px); position:relative;">Créer une publication <div class="closeModal"><i data-lucide="x" class="standard-hover cancel-icon"></i></div>
    </h2>
    <hr style="border-color:rgba(210, 210, 210, 0.32); margin-bottom:5px;">

    <div style="padding:0 ; width:100%; max-with:100%;">
        <div class="flexDivStart" style="padding: 0 20px; width: calc(100% - 40px);">
            <i data-icon="account" style="transform:scale(1.2) translateY(2px);"></i>
            <div style="width:max-content; text-align:start;" >
                <p style="width:max-content;"><?= $_SESSION['username'] ?></p>
                <div class="visibility flexDiv" style="transform: translate(-10px) scale(0.8);"><i data-icon="friends" style="transform:scale(0.9) translateY(3px);"></i><p>Ami(e)s</p> <box-icon type='solid' name='down-arrow'></box-icon></div>
            </div>
        </div>

        <div class="file-and-caption">
            <textarea name="caption" id="post-text" placeholder="Quoi de neuf, <?= $_SESSION['username'] ?>?"></textarea>
            <div class="file"></div>
        </div>

        <div class="flexDivBetween color-smile" style="width:calc(100% - 40px); padding: 10px 20px 0;">
            <div class="background flexDivIcon"><p>Aa</p></div>
            <div style="width:max-content;" ><i data-lucide="smile" style="transform: translateY(5px);"></i></div>
        </div>

        <div class="add-type flexDivBetween">
            <strong>Ajouter une publication</strong>
            <div style="width:max-content;" class="flexDiv">
                <label for="file" title="Photo/video"><i data-lucide="images" stroke="rgb(115, 227, 145)" style="transform: translateY(2px); padding:5px;" class="fade-hover"></i></label>
                <input type="file" hidden name="file" id="file" accept="video/*"> 
                <img src="/assets/media/images/svgIcon/mention.svg" title="Identifier des personnes" class="fade-hover" width="35" height="35" style="border-radius:100%;" alt="">
                <div title="Humeur/Activité"><i data-lucide="laugh" stroke="yellow" style="padding:5px; border-radius:100%;" class="fade-hover"></i></div>
                <img src="/assets/media/images/svgIcon/map.svg" title="Je suis là" style="padding:5px; border-radius:100%;" class="fade-hover" width="25" height="25" alt="">
            </div>
        </div>

        <button type="submit" id="submit" style="width:calc(100% - 40px); margin:20px;" disabled>Publier</button>
    </div>
</form>

    </main>

</body>
</html>

<script>
    lucide.createIcons();
</script>