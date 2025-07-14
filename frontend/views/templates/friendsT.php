<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../../../assets/styles/root.css" type="text/css">
    <link rel="stylesheet" href="../../../assets/styles/friends.css" type="text/css">
    <script src="https://unpkg.com/lucide@latest">lucide.createIcons();</script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="../../../assets/js/icons.js" defer></script>
    <script src="../../../assets/js/main.js" defer></script>

</head>
<body id="friends" class="friends-home">
    <?php require '../includes/header.php'; ?>
    <main>
    <aside class="sidebar">
    <div class="flexDivBetween" style="padding:0 0 10px 10px;">
        <h2>Ami(e)s</h2>
        <p class="standard-hover flexDiv" style="background: rgba(192, 192, 192, 0.86); transform: translateY(3px); border-radius: 100%;"><i data-lucide="settings" style="display:block; padding:7px; transform: scale(1.1);"></i></p>
    </div>

    <li class="flexDivStart" style="background:rgba(188, 188, 188, 0.45);">
        <div style="padding:7px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
            <img src="/assets/media/images/svgIcon/friends/friends_accueil.png" width="22" height="22" alt="" />
        </div>  
        <p style="font-weight: 600;">Acceuil</p>
    </li>
    
    <li class="flexDivBetween" id="invitBtn">
        <div class="flexDivStart">
            <div style="padding:7px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/invitations.png" width="22" height="22" alt="" />
            </div>
            <p style="font-weight: 600;">Invitations</p>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

    <li class="flexDivBetween" id="suggestBtn">
        <div class="flexDivStart">
            <div style="padding:7px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/suggestions.png" width="22" height="22" alt="" />
            </div>
            <p style="font-weight: 600;">Suggestions</p>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

    <li class="flexDivBetween" id="all-friends">
        <div class="flexDivStart">
            <div style="padding:7px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/listes_friends.png" width="22" height="22" alt="" />
            </div>
            <p style="font-weight: 600;">Tou(te)s les ami(e)s</p>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

    <li class="flexDivStart">
        <div style="padding:7px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
            <img src="/assets/media/images/svgIcon/friends/friends_annif.png" width="22" height="22" alt="" />
        </div>
        <p style="font-weight: 600;">Anniversaires</p>
    </li>

    <li class="flexDivBetween" id="friends-personals">
        <div class="flexDivStart">
            <div style="padding:7px; border-radius:100%; background:rgba(136, 136, 136, 0.43);" class="standard-hover flexDiv">
                <img src="/assets/media/images/svgIcon/friends/listes_friends.png" width="22" height="22" alt="" />
            </div>
            <p style="font-weight: 600;">Listes personnalisées</p>
        </div>
        <i data-lucide="chevron-right" stroke="rgba(72, 72, 72, 0.7)"></i>
    </li>

</aside>

    <section class="main">
        <h2 style="text-align: left;">Vous connaissez peut être</h2>

        <div class="flexDiv" style="height: fit-content; gap:10px;">
            <div class="suggestion card">
                <img src="/assets/media/images/male.png" alt="" height="220" width="100%">
                <div>
                    <p>Name</p>
                    <button class="add">Ajouter ami(e)</button>
                    <button class="remove">Retirer</button>
                </div>
            </div>

            <div class="suggestion card">
                <img src="/assets/media/images/female.png" alt="" height="220" width="100%">
                <div>
                    <p>Name</p>
                    <button class="add">Ajouter ami(e)</button>
                    <button class="remove">Retirer</button>
                </div>
            </div>
        </div>
        
    </section>
</main>
</body>
</html>


