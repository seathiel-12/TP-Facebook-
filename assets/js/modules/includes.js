
//Le header présent sur les pages forgot password
const createForgotHeader=()=>{
    const header=document.createElement('header');
    header.innerHTML=`
        <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" width="100px"  style="transform:scale(1.5) translateX(30%); margin:15px 0;"/>

        <form class="flexDivIcon loginHeaderForm" style=" margin-right:20px;">
            <input type="text" placeholder="E-mail ou numéro de téléphone" style=" font-size:1rem; width:150px; max-height:35px; padding:12px 10px;" required />
            <input type="password" placeholder="Mot de passe" style=" font-size:1rem; width:150px; max-height:35px; padding:12px 10px;" required/>
            <button style="height:max-content; min-width:max-content;">Se connecter</button>
        </form>

    `;
    header.style.background="#f0f2f5;"
    header.style.justifyContent="space-between";
    header.style.alignItems="center";

    return header;
}


//Div pour demander à trouver le compte à partir de l'email
export const createForgotPasswordDiv=()=>{
    const forgotPasswordDiv=document.createElement('div');
    forgotPasswordDiv.classList.add('card');

    const header=createForgotHeader();

    forgotPasswordDiv.innerHTML=`

        <h2 style="text-align:left; padding:20px 20px 10px;">Trouvez votre compte</h2>

        <hr style="margin:10px auto; border:0.5px solid rgba(52, 52, 52, 0.12); width:100%;">

        <p style="text-align:left; margin:15px 20px 0; font-size:1.1em; font-weight:400;">Veuillez entrer votre e-mail ou votre numéro de mobile pour rechercher votre compte.</p>
        <form class="forgot-password-form">
            <input type="text" placeholder="E-mail ou numéro de téléphone" style=" width: 85%; margin:20px auto 15px; padding:20px;" required/> 

        <hr style="margin:10px auto; border:0.5px solid rgba(52, 52, 52, 0.12); width:100%;">

        <div class="flexDivIcon" style="gap:10px; justify-self:end; width:max-content; margin-right:15px;"> 
            <div class="cancelForgotBtn" style="background:#e4e6eb; color:#4B4F56; padding:12px 25px;"><strong>Annuler</strong></div>
            <button type="submit"><strong>Rechercher</strong></button>
        </div>
        </form>

    `
    forgotPasswordDiv.style.transform="scale(0.9)"
    forgotPasswordDiv.style.marginTop="90px"

    const mainAuthContent=document.querySelector('.main-auth-content')?document.querySelector('.main-auth-content'):document.body;

    mainAuthContent.innerHTML=header.outerHTML;
    mainAuthContent.appendChild(forgotPasswordDiv);
    HandleForgotPasswordButtons();
}


// Gestion des clicks associés à la zone de recherche de l'user via adresse e-mail
const HandleForgotPasswordButtons=()=>{
    const cancelForgotBtn=document.querySelector('.cancelForgotBtn');
    cancelForgotBtn.onclick=async()=> await fetchPageContent('../../frontend/views/usersClients/auth.php')
    
    const forgotPassForm=document.querySelector('.forgot-password-form');
    forgotPassForm.onsubmit=async (e)=>{
        e.preventDefault();
        const email=e.target.querySelector('input').value;

        const type=verifyEmailOrPhone(email);
        if(!type){
            return showNotification('Email ou numéro uniquement.');
        }

        //A supprimer après SMS 
        if(type==='phone'){
            return showNotification('Fonctionnalité phone sur plan payant.');
        }
        
    const data={email:email};
        
            await apiRequest(`user/forgotPassword/find`,'POST',data)
                .then(response=>{
                    if(response && response.success && response.data){
                        askRetrieveCode(response.data);
                    }else{
                        showNotification("Une erreur s'est produite, veuillez réessayer!")
                    }
                })
                .catch(error=>showNotification("Erreur d'envoi des données."));
    }

    const loginHeaderForm=document.querySelector('.loginHeaderForm');
    loginHeaderForm.onsubmit= async (e)=>{
        e.preventDefault();
    await import('./auth.js')
            .then(module=>module.initAuth('.loginHeaderForm'))
            .catch(error=> showNotification(`Erreur lors de la connection: ${error}`))
    }

}

//Div qui affiche le compte associé à l'e-mail envoyé et demande à envoyer le code  
export const askRetrieveCode=(user={})=>{
    const codeVerifDiv=document.createElement('div');
    const header=createForgotHeader();
    header.querySelector('img').style="transform:scale(1.5); margin:10px auto 0;";
    codeVerifDiv.innerHTML=`
        ${header.outerHTML}

        <div class="card">
            <h3 style="text-align:left; padding:20px;">Réinitialiser votre mot de passe</h3>
            <hr style="margin:0 auto 10px; border:0.5px solid rgba(52, 52, 52, 0.12); width:100%;">

            <p style="padding:10px 20px; text-align:left; font-size:1.1em;">Ce compte est asssociée à l'adresse mail précédemment saisie. Appuyez sur continuer pour recevoir le code par mail.</p>
            
            <div>
                <img src="/assets/images/${user['profil_picture']?user['profil_picture']:(user.gender==='male'?'boy':(user.gender==='female'?'happy':'horse'))}.png" width="100" height="100" class="image"/>
                <p>${user.username?user.username:(user.firstname+' '+user.lastname)}</p>
                <p style="font-size:0.9rem; color:rgb(120, 117, 117); font-weight:500;">${user.gender==='female'?"Utilisatrice":"Utilisateur "} de Facebook</p>
            <div>
            <hr style="margin:30px auto 0; border:0.5px solid rgba(52, 52, 52, 0.12); width:100%;">

            <div class="flexDivIcon" style="gap:10px; justify-self:end; width:max-content; margin-right:15px;"> 
                <div class="not-me" style="cursor:pointer; background:#e4e6eb; color:#4B4F56; padding:12px 25px;"><strong>Ce n'est pas vous?</strong></div>
                <button class="sendCode"><strong>Continuer</strong></button>
            </div>
        </div>
    `    
    document.body.innerHTML=codeVerifDiv.outerHTML;

    const loginHeaderForm=document.querySelector('.loginHeaderForm');
    loginHeaderForm.onsubmit= async (e)=>{
        e.preventDefault();
    await import('./auth.js')
            .then(module=>module.initAuth('.loginHeaderForm'))
            .catch(error=> showNotification(`Erreur lors de la connection: ${error}`))
    }    

    HandleAskRetrieveCodeBtn(user.email);
}

//Gestion des buttons de la zone de demande d'envoi du code
const HandleAskRetrieveCodeBtn=(email)=>{
    const sendCodeBtn=document.querySelector('.sendCode');
    sendCodeBtn.onclick=async ()=>{
        await apiRequest('forgotpassword/retrieveCode', 'POST', {"email":email})
                .then(response=> {
                    if(response && response.success){
                        retrieveCode(email);
                    }else{
                        showNotification('Erreur de récupération du code.')
                    }
                })
                .catch(err=>showNotification('Erreur de génération du code'));
    }

    const notMe=document.querySelector('.not-me');
    notMe.onclick=()=>createForgotPasswordDiv();
}

const retrieveCode=(email)=>{
    
    document.body.innerHTML=`
        <header>
        <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" width="100px"  style="transform:scale(1.5) translateX(30%); margin:15px 0;"/>
        </header>


        <div class="card">
            <h3 style="text-align:left; padding:20px ;">Entrez le code sécurité</h3>
            <hr style="margin:0 auto; border:0.5px solid rgba(52, 52, 52, 0.12); width:100%;">

            <p style="text-align:left; font-size:1.1rem; padding:20px;">Merci de vérifier dans vos e-mails que vous avez recu un message avec votre code. Entrez le code à 6 chiffres dans le champ en dessous:</p>

            <form class="noFormRootStyle" style="width:100%;">
                <div class="flexDivIcon" style="width:85%; margin:0 20px; gap:20px;">
                    <input type="text" id="code" placeholder="Entrez le code" required/>
                    <p style="text-align:left; font-size:1rem; width:350px;">Nous avons envoyé votre code à: <span style="color:red;">${email?email:'exe@gmail.com'}</span></p>
                </div>

                <hr style="margin:20px auto 0; border:0.5px solid rgba(52, 52, 52, 0.12); width:100%;">

                <div class="flexDivIcon" style="justify-content:space-between; width:90%; margin:auto;">

                    <p class="notReceivedCode">Code non recu?</p>
                    <div class="flexDivIcon" style="gap:10px; width:max-content; height:max-content; padding:0;"> 

                        <div class="not-me" style="cursor:pointer; border-radius:5px; background:#e4e6eb; color:#4B4F56; padding:10px 15px;"><strong>Annuler</strong></div>
                        <button class="sendCode"><strong>Continuer</strong></button>

                    </div>

                </div> 

            </form>
        </div>
    `

    const notMe=document.querySelector('.not-me');
    notMe.onclick=()=> createForgotPasswordDiv();

    const form=document.querySelector('form');
    form.onsubmit=async(e)=>{
        e.preventDefault()
        const code=document.getElementById('code');
        code.style.borderColor='';
        if(/[A-Z0-9]/.test(code.value)){
            code.style.borderColor='red';
            return;
        }
         await apiRequest('password/codeVerify','POST', {code:code.value})
                .then(response=> {
                    if(response && response.success){
                        resetPassword();
                    }
                })
                .catch(err=>showNotification("Erreur d'envoi du code"))
    }
}

 const resetPassword=()=>{

    document.body.innerHTML=`
        <header>
        <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" width="100px"  style="transform:scale(1.5) translateX(30%); margin:15px 0;"/>
        </header>

        <div>
            
        <div>

        <form>
            <h3>Reinitialiser votre mot de passe</h3>

            <hr style="margin:20px auto 20px; border:0.5px solid rgba(52, 52, 52, 0.22); width:110%; transform:translateX(-5%);">

            <input type="password" class="password" placeholder="Nouveau mot de passe" required/>
            <input type="password" class="password" placeholder="Confirmez le nouveau mot de passe" style="margin-top:0;" required/>

            <button style="width:60%; margin:5px auto 0;">Mettre à jour</button>

        </form>
    `
    const form=document.querySelector('form');
        form.onsubmit= async (e)=>{
            e.preventDefault();
            const passwords=document.querySelectorAll(".password");
            if(validatePassword(passwords[0])){
                return showNotification('Mots de passe non conformes.')
            }
            if(validatePassword(passwords[1])){
                return showNotification('Mots de passe non conformes.')
            }
            if(passwords[0]!==passwords[1]){
                return showNotification('Non correspondance des mots de passe.');
            }
            
            await apiRequest('password/reset','POST', {newPassword:passwords[0]}
                    .then(response=>{
                        if(response && response.success){
                            showNotification('Mot de passe réinitialisé avec succès', 'success');
                            fetchPageContent('../../frontend/views/templates/homeT.php');
                        }
                    })
            )
        }
}

