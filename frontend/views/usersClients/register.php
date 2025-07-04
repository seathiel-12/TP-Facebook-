<?php
    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="/assets/styles/root.css">
    <link rel="stylesheet" href="/assets/styles/login.css">
</head>

<body id="register">
<img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="facebook logo" width="300" height="100">

    <form id="form-register">
        <h1>Créer un compte</h1>
        <p>C'est simple et rapide.</p>

        <hr style="margin: 20px; width: calc(100% + 40px); margin-left: -20px;">

        <div class="flexDivIcon" style="gap: 10px;">
            <input name="firstname" type="text" placeholder="Prénom" required>
            <input name="lastname" type="text" placeholder="Nom de famille" required>
        </div>

        <label for="date-naissance" class="flexDivIcon" style="justify-content:start;">Date de naissance <span class="info-icon" title="Cliquez ici pour plus d'informations" style="cursor:pointer;"><i data-lucide="info" fill="rgba(65, 62, 62, 0.67)" stroke="white" style="transform: scale(0.7) translate(0, 6px);"></i></span></label>

        <div>
            <select name="day">
                <?php 
                    for($i = 1; $i <= 31; $i++){
                        if($i<10)
                         $i='0'.$i;
                        echo "<option value='$i'>$i</option>";
                    }
                ?>
            </select>

            <select name="month">
                <?php 
                $month=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
                    for($i = 0; $i < count($month); $i++){
                        echo sprintf("<option value='%d'>%s</option>", $i+1, $month[$i]);
                    }
                ?>
            </select>

            <select name="year">
                <?php 
                    for($i = 2025; $i >= 1900; $i--){
                        echo "<option value='$i'>$i</option>";
                    }
                ?>
            </select>
            
            
            <p class="flexDivIcon" style="margin-bottom: 10px; text-align:left; justify-content:start;">Genre <span class="info-icon" title="Cliquez ici pour plus d'informations" style="cursor:pointer;"><i data-lucide="info" fill="rgba(65, 62, 62, 0.67)" stroke="white" style="transform: scale(0.7) translate(0, 6px);"></i></span></p>

            <div>
                <div class="flexDivIcon" style="gap: 10px; width: 100%;">

                    <label class="flexDivIcon gender-label" style="justify-content:space-between;" for="female">Femme<input onclic="document.querySelector('.other-gender').className='other-gender';" type="radio" style="transform:translateY(2px);" name="gender" id="female" value="female" required></label>
                    <label class="flexDivIcon gender-label" style="justify-content:space-between;" for="male">Homme <input onclic="document.querySelector('.other-gender').className='other-gender';" type="radio" style="transform:translateY(2px);" name="gender" id="male" value="male"></label>
                    <label class="flexDivIcon gender-label" style="justify-content:space-between;" for="other">Other <input  onclic="document.querySelector('.other-gender').className='other-gender active'; document.querySelector(`select[name='other-gender']`).required=true;" type="radio" style="transform:translateY(2px);" name="gender" id="other" value="other"></label>

                </div>

                <!-- <div class="other-gender">
                    <select name="other-gender" style="width:100%; margin:10px 0;">
                        <option value="" hidden selected>Sélectionnez votre pronom</option>
                        <option value="her">Elle: "Souhaitez-lui un bon anniversaire ! " </option>
                        <option value="him">Il: "Souhaitez-lui un bon anniversaire ! "</option>
                        <option value="o">Neutre: "Souhaitez-lui un bon anniversaire ! "</option>
                    </select>
                    <p style="font-size:0.8em; font-weight:600; text-align:left; margin:-5px 0 0 5px; color:gray;">Tout le monde peut voir votre pronom.</p>
                    <input name="neutral-gender" type="text" placeholder="Genre (facultatif)" style="margin:10px 0 0;">
                </div> -->
            </div>
            

            <div>
                <input name="phone" id="email-phone" type="text" placeholder="Numéro de téléphone ou email" style="margin-bottom: 0;" required>
                <input name="password" type="password" placeholder="Nouveau mot de passe" required>
            </div>

            <div>
                <p style="margin:15px 0; font-size:0.8em; text-align:left;">Les personnes qui utilisent notre service ont pu importer vos coordonées sur Facebook. <a href="">En savoir plus.</a></p>

                <p style="font-size:0.8em; text-align:left; margin-bottom: 20px;">En cliquant sur S'inscrire, vous acceptez nos <a href="">Conditions générales,</a> et notre <a href="">Politique d'utilisation des cookies.</a> Vous recevrez peut-être des notifications par texto de notre part et vous pouvez à tout moment vous désabonner.</p>
            </div>
            

            <button type="submit" style="background:var(--bg-button-secondary); width:50%;">S'inscrire</button>

            <p id="login-btn" onclick="fetchPageContent('frontend/views/usersClients/auth.php')">   Vous avez déja un compte ?</p>
            
        </div>
                    
    </form>

    <?php include  $_SERVER['DOCUMENT_ROOT'].'/frontend/views/includes/footer.html' ?>
    <script>
        lucide.createIcons();
    </script>
    
    
</body>
</html>