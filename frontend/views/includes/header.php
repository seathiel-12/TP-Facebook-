<header>
    <div class="flexDivIcon searchZone">
        <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="facecook-logo" width="30">
        <p style="position: relative;">
            <i data-lucide="search" id="search-icon"></i>
            <input type="text" id="search" placeholder="Rechercher sur facebook">
        </p>
    </div>
    <div class="top-nav flexDivIcon" style="gap:0;">
        <div clas="homeIcon"><i data-lucide="home"></i></div>
        <div class="friendsIcon"><i data-lucide="users"></i></div>
        <div class="groupsIcon""><i data-lucide="user-circle"></i></div>
    </div>
    <div class=" flexDivIcon left-nav" style="gap: 0;">
        <p class="find-friends">Trouvez vos ami(e)s</p>
        <div class=""><box-icon type='solid' name='grid' style="transform: scale(1.4);"></box-icon></div>
        <div class="notificationIcon"><box-icon name='bell' type='solid' animation='' style="transform: scale(1.4) translateY(2px);"></box-icon></div>
        <div class="messengerIcon"><i class='bxl bx-messenger'></i></div>
        <div id="disconnect" class="accountIcon"><box-icon type='solid' name='user-circle' style="transform: scale(1.4) translateY(2px);"></box-icon></div> 
   </div>
</header>

<script>
    lucide.createIcons();
    feather.replace();
</script>

<div class="profil-contextuel on-window-click-close">
    <div class='content'>
    <div class="profils">
            <div class="flexDivIcon user">
                <i data-icon="account" width="30" height="30" class="bIcon flexDivIcon"></i> <p><?= $_SESSION['username']??'Unknown' ?></p>
            </div>
            <hr style="width:95%; border:solid 0.3px rgba(79, 79, 79, 0.37); margin: 10px auto;">
            <button style="margin: 10px auto 0; width:100%;">Voir tous les profils</button>
        </div>

        <ul class="accoutDivOptions">
            <li class="flexDivBetween" style="padding-right:0; gap: 170px;"><div class="flexDivIcon"><i data-lucide="settings"></i><p>Paramètres</p></div> <i data-lucide="chevron-right"></i></li>
            <li class="flexDivBetween" style="padding-right:0; "><div class="flexDivIcon"> <i data-lucide="circle-question-mark"></i><p>Aide et assistance</p></div> <i data-lucide="chevron-right"></i></li>
            <li class="flexDivBetween" style="padding-right:0;"><div class="flexDivIcon"> <i data-lucide="moon"></i><p>Accessibilité et affichage</p></div> <i data-lucide="chevron-right"></i></li>
            <li class="flexDivIcon"><i data-lucide="message-square-warning"></i><p>Donnez votre avis</p></li>
            <li class="flexDivIcon disconnect"><i data-lucide="log-out"></i><p>Se déconnecter</p></li>
        </ul>
    </div>
</div>

