<aside class="sidebar">
    <ul>
        <li class="flexDivIcon"><i data-lucide="circle-user-round"></i>Benaiah Isaac</li>
        <li class="flexDivIcon"><i data-lucide="circle"></i>Meta AI</li>
        <li class="flexDivIcon"><i data-lucide="users"></i>Ami(e)s</li>
        <li class="flexDivIcon"><box-icon name='facebook-circle' type='logo' ></box-icon> Bienvenue</li>
        <li class="flexDivIcon"><i data-lucide="clock-arrow-up"></i>Souvenirs</li>
        <li class="flexDivIcon"><i data-lucide="bookmark"></i>Enregistrements   </li>
        <li class="flexDivIcon" style="gap:15px; margin-left: 3px;"><i class='bx bx-community'></i>Groupes</li>
        <li class="flexDivIcon"><i data-lucide="tv-minimal-play"></i>Reels</li>
        <li class="flexDivIcon"><i data-lucide="store"></i>Marketplace</li>
        <li class="flexDivIcon"><i class='bxl bx-messenger'></i>Messenger</li>
        <li class="flexDivIcon"><box-icon name='credit-card'></box-icon>Commandes et Paiements</li>
        <li class="flexDivIcon"><i data-lucide="calendar-check"></i>Evenements</li>
        <!-- <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li>
        <li class="flexDivIcon"><i data-lucide="user"></i>scroll</li> -->

        <?php
        // foreach($sidebarContent as $item){
        //     echo $item;
        // }
        ?>
    </ul>
</aside>

<script>
    lucide.createIcons();
    // document.querySelector('aside').onmouseenter=(e)=> e.target.style.overflowY="scroll";
    // document.querySelector('aside').onmouseleave=(e)=> e.target.style.overflowY="hidden";
</script>
<style>
    .bx{
        transform: scale(1.5);
        border: solid 1.5px ;
        border-radius: 20px;
    }
    li{
        list-style-type: none;
        border-radius: 5px;
        padding: 15px 30px;
        justify-content: start!important;
        cursor: pointer;
    }
    aside.right{
        background-color: var(--bg-secondary);   
        padding-top:15px ;
        right: 0;
        top:70px;
    }

    li:hover{
        background: rgb(207, 207, 207);
    }
    .sidebar{
        left:0;
        top: 80px;
    }
    .flexDivIcon{
        gap:10px;
    }
</style>