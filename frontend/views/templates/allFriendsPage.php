<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body id="friends" class="friends-all">
    <?php require '../includes/header.php'; ?>

    <main>
        <aside class="sidebar" style="text-align: left;">
            <div class="flexDivStart">
                <div class="rounded-icon standard-hover flexDiv back-to-home-friends"><i data-lucide="arrow-left" stroke="rgba(52, 52, 52, 0.82)"></i></div>
                <div style="text-align:left; padding-left:5px;"><p> Ami(e)s <p>
                <h2>Tou(te)s les ami(e)s</h2></div>       
            </div>
            
            <div style="width: 100%; position: relative;">
                <input type="text" id="find-friends" placeholder="Retrouver des ami(e)">
                <i data-lucide="search" stroke="#535252" transform="scale(0.9)" style="position: absolute; top: 5px; left: 20px;"></i>
            </div>

            <hr>
            
            <div style="margin-top: 10px;">
                <p style="font-weight: 600; margin-bottom: 5px;">Amis</p>

                <div class="all-friends">
                 <p style="font-size: 0.9em; font-weight: 600; color: rgba(130, 130, 130, 0.74);"> Aucun ami à afficher </p>
                </div>

            </div>
        </aside>
    </main>
</body>
</html>

<script>
    lucide.createIcons();
</script>