<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body id="friends" class="friends-suggest">
    <?php require '../includes/header.php'; ?>

    <main>
        <aside class="invit-aside">
            <div class="flexDivStart">
                <div class="rounded-icon standard-hover flexDiv back-to-home-friends"><i data-lucide="arrow-left" stroke="rgba(52, 52, 52, 0.82)"></i></div>
                <div style="text-align:left; padding-left:5px;"><p> Ami(e)s <p>
                <h2>Suggestions</h2></div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            </div>
            <p style="font-size:1.1em; font-weight: 500; text-align: left; padding-left:20px;">Personnes que vous pourriez connaître</p>

            <div class="friends-suggestions">

                <div class="flexDivStart">
                    <img src="/assets/media/images/male.png" width="60" height="60" style="border-radius: 100%;" alt="">
                    <div>
                        <p style="text-align: left;">Name here</p>
                        <div class="flexDiv" style="width: 100%">
                            <button style="width:130px; padding: 10px;">Ajouter ami(e)</button>
                            <button style="background: rgba(198, 198, 198, 0.64); width:130px; color:rgba(44, 44, 44, 0.77);">Retirer</button>
                        </div>
                    </div>
                </div>

            </div>

        </aside>
    </main>
</body>
</html>