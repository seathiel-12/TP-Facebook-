<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../../assets/styles/root.css" type="text/css">
    <link rel="stylesheet" href="../../../assets/styles/friends.css" type="text/css">
    <link rel="stylesheet" href="../../../assets/styles/home.css" type="text/css">
    <script src="https://unpkg.com/lucide@latest">lucide.createIcons();</script>

    <title>Document</title>
</head>
<body id="friends" class="friends-personals">
    <?php require '../includes/header.php'; ?>

    <main>
        <aside class="sidebar">
            <div class="flexDivStart">
                    <div class="rounded-icon standard-hover flexDiv back-to-home-friends"><i data-lucide="arrow-left" stroke="rgba(52, 52, 52, 0.82)"></i></div>
                    <div style="text-align:left; padding-left:5px;"><p> Ami(e)s <p>
                    <h2>Listes personnalisées</h2></div>                                  
            </div>

            <ul class="personals-options">
                <li class="flexDivStart">
                    <p class="rounded-icon flexDiv" style="background-color: rgba(194, 192, 192, 0.5); width: max-content; padding:15px;"><i data-lucide="star" fill="black"></i></p>

                    <h3>Amis proches</h3>
                </li>

                <li class="flexDivStart">
                <p class="rounded-icon flexDiv" style="background-color: rgba(194, 192, 192, 0.5); width: max-content; padding:15px;"><img src="/assets/media/images/svgIcon/friends/near_friends.png" alt=""></p>


                    <h3>Restreint</h3>
                </li>

                 <li class="flexDivStart">
                    <p class="rounded-icon flexDiv" style="background-color: rgba(194, 192, 192, 0.5); width: max-content; padding:15px;"><img src="/assets/media/images/svgIcon/friends/connaissances.png" alt="">
                    </p>

                    <h3>Connaissances</h3>
                </li>

                <li class="flexDivStart">
                    <p class="rounded-icon flexDiv" style="background-color:rgba(195, 218, 253, 0.43); width: max-content; padding:15px;"><i data-lucide="plus" stroke="#0064D1"></i></p>

                    <h3 style="color: #0064D1;">Créer une liste</h3>
                </li>
            </ul>
        </aside>
    </main>
</body>
</html>

<script>
    lucide.createIcons();
</script>