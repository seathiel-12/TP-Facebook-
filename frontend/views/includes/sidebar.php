<aside class="sidebar">
    <ul>
        <li class="flexDivIcon profiling" refering="me" style="padding:20px; border-left: solid 5px dimgray; margin:0 5px; width: calc(100% - 60px)!important;">
        <?php session_start();
                if($_SESSION['profile_picture']);  
                echo "<img width='40 height='40' style='border-radius:100%;' src='". $_SESSION['profile_picture'] . "'/>";
        ?>
        </i><?= $_SESSION['username'] ?></li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/meta.png" alt="" width="30" height="30" >Meta AI</li>
        <li onclick="loadThisPage('friends')" class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/amis_home.png" alt="" width="30" height="30" >Ami(e)s</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/facebook-circle.png" alt="" width="28" height="28" > Bienvenue</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/souvenirs.png" alt="" width="30" height="30" >Souvenirs</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/enregistrements.png" alt="" width="30" height="30" >Enregistrements   </li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/groupes.png" alt="" width="30" height="30" >Groupes</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/reels.png" alt="" width="30" height="30" >Reels</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/marketplace.png" alt="" width="30" height="30" >Marketplace</li>
        <li onclick="loadThisPage('messenger')" class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/messenger_logo.png" alt="" width="30" height="30" >Messenger</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/commandes.png" alt="" width="30" height="30" >Commandes et Paiements</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/evenements.png" alt="" width="30" height="30" >Evenements</li>
        <!-- <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/amis_home.png" alt="" width="30" height="30" >scroll</li>
        <li class="flexDivIcon"><img src="/assets/media/images/svgIcon/home/amis_home.png" alt="" width="30" height="30" ></i>scroll</li> -->
        <!-- <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
 -->    <hr>
        <h3 style="text-align: left; padding: 0 30px; color:dimgray;" >Vos raccourcis</h3>
        <li></li>
        <?php
        // foreach($sidebarContent as $item){
        //     echo $item;
        // }
        ?>
    </ul>
</aside>

<script>
    lucide.createIcons();
</script>
