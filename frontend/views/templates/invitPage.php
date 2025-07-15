<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body id="friends" class="friends-invit">
    <?php require '../includes/header.php'; ?>

    <main>
        <aside class="invit-aside" style="padding-right: 5px;">
            <div class="flexDivStart">
                <div class="rounded-icon standard-hover flexDiv back-to-home-friends"><i data-lucide="arrow-left" stroke="rgba(52, 52, 52, 0.82)"></i></div>
                <div style="text-align:left; padding-left:5px;"><p> Ami(e)s <p>
                <h2>Invitations</h2></div>                                                   
            </div>
            <p style="font-weight: 500; text-align: left; padding-left:20px;">Invitations</p>

            <div style="padding: 10px 5px;" > 
                <div>
                    <div class="flexDivBetween">
                        <div class="flexDivStart">
                            <div><i data-lucide="play" class="depliant-icon" type="sent"></i></div>
                            <p style="color: rgba(16, 14, 38, 0.71); font-weight: 600;">Envoyées</p>
                        </div>

                        <p class="invit-sent-count flexDiv" style="background: rgba(240, 9, 9, 0.91); border-radius:100%; width:max-content; color:white; max-width:20px; max-height:20px; font-size:600; padding:4px;"></p>
                    </div>
                    
                    <div class="sent-invit invit-close">
                            
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <div class="flexDivBetween">
                        <div class="flexDivStart">
                            <i data-lucide="play" class="depliant-icon" type="received"></i>
                            <p style="color:rgba(15, 20, 48, 0.93); font-weight: 600;">Reçues</p>
                        </div>
                        <p class="invit-received-count flexDiv" style="background: rgba(215, 12, 12, 0.71); border-radius:100%; color:white; max-width:20px; max-height:20px; font-size:600; padding:4px; transform:scale(0.9);"></p>
                    </div>
                    
                    <div class="received-invit invit-close">

                    </div>
                </div>
            </div>
        </aside>


        <section class="this-profil">
            <h2 style="margin: auto auto;">Sélectionnez des noms de personnes un aperçu de leur profil.</h2>
        </section>

    </main>
</body>
</html>