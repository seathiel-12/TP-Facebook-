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
        <aside class="invit-aside">
            <div class="flexDivStart">
                <div class="rounded-icon standard-hover flexDiv back-to-home-friends"><i data-lucide="arrow-left" stroke="rgba(52, 52, 52, 0.82)"></i></div>
                <div style="text-align:left; padding-left:5px;"><p> Ami(e)s <p>
                <h2>Invitations</h2></div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            </div>
            <p style="font-weight: 500; text-align: left; padding-left:20px;">Invitations</p>

            <div style="padding: 10px;" > 
                <div >
                    <div class="flexDivStart">
                        <i data-lucide="play" class="depliant-icon"></i>
                        <p style="color: rgba(49, 137, 75, 0.87); font-weight: 600;">Envoyées</p>
                    </div>
                    
                    <div class="sent-invit">
                        <p style="text-align: left; color:rgba(67, 67, 67, 0.81); font-weight:500;">Aucun envoi effectué.</p>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                     <div class="flexDivStart">
                        <i data-lucide="play" class="depliant-icon"></i>
                        <p style="color:rgba(255, 8, 28, 0.71); font-weight: 600;">Recues</p>
                    </div>

                    <div class="received-invit">
                        <p style="text-align: left; color:rgba(67, 67, 67, 0.81); font-weight:500;">Aucune invitation recue.</p> 
                    </div>
                </div>
            </div>


        </aside>
    </main>
</body>
</html>