<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="../../../assets/styles/root.css">
    
</head>

<body id="register">
<img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="facebook logo" width="300" height="100">

    <form action="">
        <h1>Créer un compte</h1>
        <p>C'est simple et rapide.</p>

        <hr style="margin: 20px; width: calc(100% + 40px); margin-left: -20px;">

        <div class="flexDivIcon" style="gap: 10px;">
            <input type="text" placeholder="Prénom" >
            <input type="text" placeholder="Nom de famille">
        </div>

        <label for="date-naissance" class="flexDivIcon" style="justify-content:start;">Date de naissance <span class="info-icon" title="Cliquez ici pour plus d'informations" style="cursor:pointer;"><i data-lucide="info" fill="rgba(65, 62, 62, 0.67)" stroke="white" style="transform: scale(0.7) translate(0, 6px);"></i></span></label>

        <div>
            <select name="jour" id="jour">
                <?php 
                    for($i = 1; $i <= 31; $i++){
                        echo "<option value='$i'>$i</option>";
                    }
                ?>
            </select>

            <select name="mois" id="mois">
                <?php 
                $month=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
                    for($i = 0; $i < count($month); $i++){
                        echo "<option value='$i'>$month[$i]</option>";
                    }
                ?>
            </select>

            <select name="annee" id="annee">
                <?php 
                    for($i = 2025; $i >= 1900; $i--){
                        echo "<option value='$i'>$i</option>";
                    }
                ?>
            </select>
            
            
            <p class="flexDivIcon" style="margin-bottom: 10px; text-align:left; justify-content:start;">Genre <span class="info-icon" title="Cliquez ici pour plus d'informations" style="cursor:pointer;"><i data-lucide="info" fill="rgba(65, 62, 62, 0.67)" stroke="white" style="transform: scale(0.7) translate(0, 6px);"></i></span></p>

            <div>
                <div class="flexDivIcon" style="gap: 10px;">

                    <label class="flexDivIcon gender-label" style="justify-content:space-between;" for="female">Femme<input type="radio" style="transform:translateY(2px);" name="gender" id="female" value="female" onclick="document.querySelector('.other-gender').className='other-gender';"></label>
                    <label class="flexDivIcon gender-label" style="justify-content:space-between;" for="male">Homme <input onclick="document.querySelector('.other-gender').className='other-gender';" type="radio" style="transform:translateY(2px);" name="gender" id="male" value="male"></label>
                    <label class="flexDivIcon gender-label" style="justify-content:space-between;" for="other">Personnalisé <input onclick="document.querySelector('.other-gender').className='other-gender active';" type="radio" style="transform:translateY(2px);" name="gender" id="other" value="other"></label>

                </div>

                <div class="other-gender">
                    <select name="other-genre" style="width:100%;">
                        <option value="other" hidden selected>Sélectionnez votre pronom</option>
                        <option value="other">Elle: "Souhaitez-lui un bon anniversaire ! " </option>
                        <option value="other">Il: "Souhaitez-lui un bon anniversaire ! "</option>
                        <option value="other">Neutre: "Souhaitez-lui un bon anniversaire ! "</option>
                    </select>
                    <p style="font-size:0.8em; font-weight:600; text-align:left; margin:-5px 0 0 5px; color:gray;">Tout le monde peut voir votre pronom.</p>
                    <input type="text" placeholder="Genre (facultatif)" style="margin:10px 0 0;">
                </div>
            </div>
            

            <div>
                <input type="text" placeholder="Numéro de téléphone ou email" style="margin-bottom: 0;">
                <input type="password" placeholder="Nouveau mot de passe">
            </div>

            <div>
                <p style="margin:15px 0; font-size:0.8em; text-align:left;">Les personnes qui utilisent notre service ont pu importer vos coordonées sur Facebook. <a href="">En savoir plus.</a></p>

                <p style="font-size:0.8em; text-align:left; margin-bottom: 20px;">En cliquant sur S'inscrire, vous acceptez nos <a href="">Conditions générales,</a> et notre <a href="">Politique d'utilisation des cookies.</a> Vous recevrez peut-être des notifications par texto de notre part et vous pouvez à tout moment vous désabonner.</p>
            </div>
            

            <button type="submit" style="background:var(--bg-button-secondary); width:50%;">S'inscrire</button>

            <p id="login-btn" onclick="fetchPageContent('../includes/auth.php')">   Vous avez déja un compte ?</p>
            
        </div>
                    
    </form>

    <?php include '../frontend/views/includes/footer.html'; ?>
    <script>
        lucide.createIcons();
    </script>
    
</body>
</html>