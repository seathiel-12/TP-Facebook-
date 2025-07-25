<?php session_start(); ?>

<header id="standard-header">
    <div class="flexDivIcon searchZone">
        <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="facecook-logo" width="30">
        <p style="position: relative;">
            <i data-lucide="search" id="search-icon"></i>
            <input type="text" id="search" placeholder="Rechercher sur facebook">
        </p>
    </div>
    <div class="top-nav flexDivIcon" style="gap:0;">
        <div class="homeIcon"><i data-lucide="home"></i></div>
        <div class="friendsIcon"><i data-lucide="users"></i></div>
        <!-- <div class="groupsIcon""><i data-lucide="user-circle"></i></div> -->
    </div>
    <div class="flexDiv right-nav" style="gap: 0;">
        <!-- <p class="find-friends">Trouvez vos ami(e)s</p> -->
        <!-- <div class=""><box-icon type='solid' name='grid' style="transform: scale(1.4);"></box-icon></div> -->
        <div title="Disclaimer" style="background: rgba(255, 204, 53, 0.2);" class="disclaimerIcon"><i data-lucide="triangle-alert" stroke="rgb(222, 190, 87)"></i></div>
        <div class="messengerIcon"><i class='bxl bx-messenger'></i></div>
        <div class="accountIcon flexDiv">
            <?php
                if($_SESSION['profile_picture']);  
                echo "<img width='50'
                 height='50' style='border-radius:100%;' src='". $_SESSION['profile_picture'] . "'/>";
            ?>
        </div> 
   </div>

   <input type="hidden" id="csrf_token" value="<?= $_SESSION['csrf_token']; ?>">
   <input type="hidden" id="me" value="<?= $_SESSION['id']; ?>">
   <input type="hidden" id="valid" value="<?= $_SESSION['valid']; ?>">

</header>

<script>
    lucide.createIcons();
    feather.replace();
</script>

<div class="card disclaimer">
    <h2>Disclaimer!</h2>
    <p style="font-weight: 500;">Ce site n'est en aucun cas affilié à facebook ou un partenaire de cette entité. Toute utilisation faite des logo, images et elements propres de Facebook ne l'a été que pour couvrir les besoins de travaux pratiques assignés par un cours d'informatique, soit à but éducatif. Merci.</p>
</div>

<div class="profil-contextuel on-window-click-close">
    <div class='content'>
    <div class="profils">
            <div class="flexDivIcon user profiling" refering="me">
                <i data-icon="account" width="30" height="30" class="bIcon flexDivIcon"></i> <p><?= $_SESSION['username']??'Unknown' ?></p>
            </div>
            <hr style="width:95%; border:solid 0.3px rgba(79, 79, 79, 0.37); margin: 10px auto;">
            <button style="margin: 10px auto 0; width:100%;">Voir tous les profils</button>
    </div>

        <ul class="accoutDivOptions">
            <li class="flexDivBetween" style="padding-right:0; ">
                <div class="flexDiv"><i data-lucide="settings"></i><p>Paramètres</p></div>
                <div class="flexDiv"> <i data-lucide="chevron-right"></i></div>
            </li>

            <li class="flexDivBetween" style="padding-right:0; ">
                <div class="flexDivIcon"> <i data-lucide="circle-question-mark"></i><p>Aide et assistance</p></div> 
                <div><i data-lucide="chevron-right"></i></div>
            </li>

            <li class="flexDivBetween" style="padding-right:0;">
                <div class="flexDivIcon"> <i data-lucide="moon"></i><p>Accessibilité et affichage</p></div> <i data-lucide="chevron-right"></i>
            </li>

            <li class="flexDivStart">
                <i data-lucide="message-square-warning"></i><p>Donnez votre avis</p>
            </li>

            <li class="flexDivStart disconnect">
                <i data-lucide="log-out"></i><p>Se déconnecter</p>
            </li>
        </ul>
    </div>
</div>


