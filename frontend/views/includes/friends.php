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
<main>
    <aside class="sidebar">
    <div class="flexDivBetween" style="padding:0 0 10px 10px;">
        <h2>Ami(e)s</h2>
        <p class="standard-hover flexDiv" style="background: rgba(192, 192, 192, 0.86); transform: translateY(3px); border-radius: 100%;"><i data-lucide="settings" style="display:block; padding:7px; transform: scale(1.1);"></i></p>
    </div>

    <li class="flexDivStart">
        <div style="padding:10px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
            <img src="/assets/media/images/svgIcon/friends/friends_accueil.png" width="22" height="22" alt="" />
        </div>
        <h3>Acceuil</h3>
    </li>
    
    <li class="flexDivBetween">
        <div class="flexDivStart">
            <div style="padding:10px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/invitations.png" width="22" height="22" alt="" />
            </div>
            <h3>Invitations</h3>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

    <li class="flexDivBetween">
        <div class="flexDivStart">
            <div style="padding:10px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/suggestions.png" width="22" height="22" alt="" />
            </div>
            <h3>Suggestions</h3>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

    <li class="flexDivBetween">
        <div class="flexDivStart">
            <div style="padding:10px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/listes_friends.png" width="22" height="22" alt="" />
            </div>
            <h3>Tou(te)s les ami(e)s</h3>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

    <li class="flexDivStart">
        <div style="padding:10px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
            <img src="/assets/media/images/svgIcon/friends/friends_annif.png" width="22" height="22" alt="" />
        </div>
        <h3>Anniversaires</h3>
    </li>

    <li class="flexDivBetween">
        <div class="flexDivStart">
            <div style="padding:10px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/listes_friends.png" width="22" height="22" alt="" />
            </div>
            <h3>Listes personnalisées</h3>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

</aside>

    <section>
        <h2>Vous connaissez peut être</h2>
    </section>
</main>

<style>
    .sidebar{
        padding: 10px 10px;
        width: 21%!important;
        box-shadow: 0 0 10px 0 rgba(122, 122, 122, 0.79);
        margin: 0 auto;
        position: relative;
    }

    li{
        list-style-type: none;
        border-radius: 5px;
        padding: 7px 5px;
        justify-content: start!important;
        cursor: pointer;
    }
    h3{
        font-weight: 500;
    }

    li:hover{
        background: rgb(207, 207, 207);
    }
    .flexDivIcon{
        gap:10px;
    }   
    main{
        display: flex;
        margin-top:63px;
    }
</style>