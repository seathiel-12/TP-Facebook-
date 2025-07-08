export function showInfoIconDiv(icon, index){
    const infoIcon=document.querySelectorAll('.info-icon');

    infoIcon.forEach((icon, index)=>{
        icon.addEventListener('click',(e)=>{
        document.getElementById('info-div')?.remove();
        const div=document.createElement('div');
        div.id='info-div';
        div.style=`position:absolute; top:${icon.offsetTop}px; left:${icon.offsetLeft}px;  background-color:white; box-shadow:0 0 10px 0 rgba(0, 0, 0, 0.1); padding:15px; width:400px; color:rgb(91, 90, 90); text-align:left;`;
       if(index==0){
            div.innerHTML=`<strong>Indiquer votre date de naissance</strong> garantit que votre expérience Facebook est adapté a votre âge. Pour changer qui peut voir ca, allez dans la section A propos de votre profil. Pour en savoir plus, consultez notre <a style="color:var(--bg-button-primary);" href="https://www.facebook.com/legal/privacy/fr_FR/cookies/ ">Politique de confidentialité</a>`
       }else{
            div.innerHTML=`Vous pouvez modifier plus tard qui voit votre genre sur votre profil. Sélectionnez Personalisé pour choisir un autre genre, ou si vous préférez ne rien indiquer.`
       }
      document.body.appendChild(div); 
        div.animate([
            {opacity:0},
            {opacity:1}
        ],{
           duration:500,
           easing:'ease-in-out',
           fill:'forwards'
        });
          e.stopPropagation();
      });
   });
   lucide.createIcons();
}

export function hideInfoIconDiv(e){
    const infoDiv=document.getElementById('info-div');
        if(infoDiv && !infoDiv.contains(e.target)){
            infoDiv.animate([
                {opacity:1},
                {opacity:0}
            ],{
                duration:500,
                easing:'ease-in-out',
                fill:'forwards'
            });
            infoDiv.remove();
    }
}

const validateNames=(input)=>{
    const regex=/^[a-zA-Z]+$/;
    return regex.test(input.trim());
}


const validateRegister=(data)=>{
    let valid=true;

    if(!validateNames(data.firstname) || !validateNames(data.lastname)){
        valid=false;
    }

    if(!verifyEmailOrPhone(data.emailOrPhone)){
        valid=false;
    }else{
        data[verifyEmailOrPhone(data.emailOrPhone)]=data.emailOrPhone;
        delete data.emailOrPhone;
    }

    if(!validatePassword(data.password)){
        valid=false;
    }

    if(!valid){
        return 'Veuillez remplir les champs avec des valeurs valides';
    }

    return true;
}

const handleRegisterRetrieveCode=(data)=>{
    const cancelCode=document.querySelector('.not-me');
    cancelCode.onclick=()=>{
        fetchPageContent('/frontend/views/usersClients/logout.php');
        fetchPageContent('/frontend/views/usersClients/auth.php');
    }
    
    const form=document.querySelector('form');

    form.onsubmit=async (e)=>{
        e.preventDefault();
        const code=document.getElementById('code');
        code.style.borderColor='';
        const token=document.getElementById('csrf_token').value;


        if(!/^[A-Z0-9]{6,6}/.test(code.value)){
            code.style.borderColor='red';
            return showNotification('Code invalide!');
        }
        data['csrf_token']=token;
        data.code=code.value;
        await apiRequest('user/register/codeVerify','POST', data)
                .then(response=>{
                    if(response && response.success){
                        askFillOtherRegisterInfo(); 
                        return;
                    }else{
                        showNotification(response.message);
                        code.style.borderColor='red';
                    }
                })
                .then(err=>"Une erreur s'est produite, veuillez réessayer!");
    }
}

 const askFillOtherRegisterInfo=async()=>{
   document.body.innerHTML=`
        <header>
        <img src="/assets/media/images/facebook.svg" width="100px"  style="transform:scale(1.5) translateX(30%); margin:15px 0;"/>
        </header>

        <div class='card' style="max-width: 800px; padding: 30px;">
            <h2 style="padding:20px 0; text-align: center; color: #1877f2; font-size: 28px;">Bienvenue sur Facebook Clone!</h2>
            <p style="text-align: center; color: #65676b; margin-bottom: 30px; font-size: 16px;">Découvrez tout ce que vous pouvez faire sur notre plateforme</p>

            <hr style="margin:0 auto; border:0.5px solid rgba(52, 52, 52, 0.12); width:100%; margin-bottom: 30px;">
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-bottom: 30px;">
                
                <!-- Chat et Messagerie -->
                <div class="" style="padding: 25px; position:relative;">
                    <div class="feature-icon" style="font-size: 48px; margin-bottom: 15px; transform:scale(6) translateY(10%); position:relative; ">
                      💬
                    </div>
                    <div style="position:absolute; width:65%; left:17.5%; top:35%; color:rgb(92, 89, 89);" >
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Chat & Messagerie</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Discutez en temps réel avec vos amis et votre famille</p>
                    </div>
                </div>

                <!-- Groupes de Discussion -->
                <div class="feature-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <div class="feature-icon" style="font-size: 48px; margin-bottom: 15px; animation: pulse 2s infinite;">
                        👥
                    </div>
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Groupes de Discussion</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Rejoignez des communautés et partagez vos passions</p>
                </div>

                <!-- Partage de Photos -->
                <div class="feature-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <div class="feature-icon" style="font-size: 48px; margin-bottom: 15px; animation: rotate 3s infinite linear;">
                        📸
                    </div>
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Partage de Photos</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Partagez vos moments précieux avec vos proches</p>
                </div>

                <!-- Actualités -->
                <div class="feature-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <div class="feature-icon" style="font-size: 48px; margin-bottom: 15px; animation: slideIn 2s infinite;">
                        📰
                    </div>
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Fil d'Actualités</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Restez informé des dernières nouvelles de vos amis</p>
                </div>

                <!-- Événements -->
                <div class="feature-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 25px; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <div class="feature-icon" style="font-size: 48px; margin-bottom: 15px; animation: wave 2s infinite;">
                        🎉
                    </div>
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Événements</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Créez et participez à des événements passionnants</p>
                </div>

                <!-- Sécurité -->
                <div class="feature-card" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 25px; border-radius: 15px; color: #333; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <div class="feature-icon" style="font-size: 48px; margin-bottom: 15px; animation: glow 2s infinite;">
                        🔒
                    </div>
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Sécurité Avancée</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.8;">Vos données sont protégées et sécurisées</p>
                </div>
            </div>

            <div style="text-align: center; margin: 30px; display:flex; justify-self:center; height:max-content; width:60%;">
                <button class="completeProfil" style="background: #1877f2; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; width:100%; margin:0; transition: all 0.5s ease; transform:scale(1.2);">
                   Completez votre profil
                </button>
            </div>
        </div>

        <style>
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            @keyframes slideIn {
                0% { transform: translateX(-20px); opacity: 0.7; }
                50% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(20px); opacity: 0.7; }
            }

            @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(10deg); }
                75% { transform: rotate(-10deg); }
            }

            @keyframes glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.5)); }
            }

            body {
                min-height: max-content;
                margin: 0;
                padding-bottom:30px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .card {
                width:60%;
                margin:30px auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
        </style>
    `
    const completProfil=document.querySelector('.completeProfil');
    completProfil.onclick=()=>completeProfil();

    lucide.createIcons();
}

 const completeProfil=()=>{
    const profil= document.createElement('div');

    profil.innerHTML=`
        <header>
        <img src="/assets/media/images/facebook.svg" width="100px"  style="transform:scale(1.5) translateX(30%); margin:15px 0;"/>
        </header>

        <form class="profil-form" enctype="multipart/form-data">
            <div style="position:relative; width:100%; display:flex; flex-direction:column; align-items:center; gap:20px;">
                <label class="cover flexDivIcon" for="cover">
                    <span style="font-size: 2.5em; color: #1877f2; transform:translateY(-10%);">+</span> <span style="font-size:1.1em;">Ajouter une cover</span>
                </label>
                <input type="file" id="cover" hidden/>

                <label class="profil flexDivIcon" for="profil">
                    <i data-lucide="image-plus"></i>
                </label>
                <input type="file" id="profil" hidden/>
            </div>
            <textarea class="bio" placeholder="Ajoutez une bio..."></textarea>

            <h3 style="text-align:left; color:rgb(139, 152, 164); width:100%; margin:20px 20px 0;">Situation & Etudes</h3>
            <hr style="margin:0 5% 0 0; width:95%; display:flex;">
            <div class="form-group" style="width:100%; display:flex; flex-direction:column;">

                <div class="flexDivIcon" style="gap:0;">
                    <i data-lucide="map-pinned" class="otherIcon"></i>
                    <input style="border-radius:0 5px 5px 0; " name="lives_at" placeholder="Entrez votre adresse..." required/>
                </div>

                <div class="flexDivIcon" style="gap:10;">
                    <div class="flexDivIcon" style="gap:0; padding:0;">
                       <select name="relationship_status" style="width:100%; height:45px; margin:0;" required>
                        <option selected hidden>Situation matrimoniale</option>
                        <option value="single">Célibataire</option>
                        <option value="couple">En couple</option> 
                        <option value="married">Marié</option>
                        <option value="divorced">Divorcé</option>
                       </select>
                    </div>
                    <div class="flexDivIcon" style="gap:0; padding:0;">
                        <select name="study_level" style="width:100%; height:45px; margin:0;" required>
                        <option selected hidden>Niveau d'études</option>
                        <option value="cep">Certificat d'Etudes primaires</option>
                        <option value="bepc">Brevet collegial</option> 
                        <option value="bac">Baccalauréat</option>
                        <option value="licence">Licence</option>
                        <option value="master">Master</option>
                        <option value="doctorat">Doctorat</option>
                       </select>
                    </div>
                </div>

            <h3 style="text-align:left; color:rgb(139, 152, 164); width:100%; margin:20px 20px 0 0;">Profession et hobbies</h3>
            <hr style="margin:0 5% 0 0; width:95%; display:flex;">

                <div class="flexDivIcon" style="margin:10px 0;">
                    <div style="width:50%; padding:0;">
                        <select name="profession" style="width:100%; height:45px; margin:0 0 10px 0;" required>
                        <option selected hidden>Profession</option>
                        <option value="#">Ingénieur aéronautique</option>
                        <option value="#">Data Analyste</option> 
                        <option value="#">Infopreneur</option>
                        <option value="#">Génie civil</option>
                        <option value="#">Directeur Informatique</option>
                        <option value="#">Artisan</option>
                       </select>
                        
                       <div class="hobbies flexDivIcon" style="justify-content:space-between;"><ul id="hobbiesChoosedList" style="padding:0;"><span>Vos hobbies</span></ul> <i data-lucide="chevron-down" style="transform:scale(0.7) translateX(7px);"></i> </div>
                    </div>
                    <textarea name="about" class="bio" style="height:80px;" placeholder="Parlez nous de vous..."></textarea>
                </div>
            </div>

            <hr style="width:55%; margin-left:45%;">

            <div style="display:flex; justify-content:end; width:100%; gap:10px; height:60px;">
                <button type="button" class="skip" style="background:linear-gradient(-45deg, rgba(91, 89, 89, 0.56), rgba(88, 87, 87, 0.67)); padding:5px 40px; font-size: 0.9em;">Passer</button>
                <button type="submit" style="padding:5px 10px; background: #1877f2; color: white; border: none; border-radius: 8px; font-size: 0.9em; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(24,119,242,0.08); transition: background 0.3s;">Valider mon profil</button>
            </div>
            
        </form>

            <ul id="hobbiesList"><li>Musique</li><li>Sport</li><li>Lecture</li><li>Découverte</li></ul>
        <style>

        #hobbiesList{
            box-shadow:0 0 10px rgba(238, 238, 238, 0.89); 
            width:max-content;
            border-radius:10px;   
            position:absolute;    
            background:white;
            border:solid 1px rgb(166, 162, 162);
        }
        #hobbiesList li{
            padding:5px;
            border-bottom:solid 1px rgba(99, 98, 98, 0.22);
            cursor:pointer;
        }
        #hobbiesList li:hover{
            background:rgba(132, 132, 132, 0.32);
        }
        button{
            margin:0;
            height:45px;
        }
        #hobbiesChoosedList{
            display:flex;
            overflow:hidden;
            gap:7px;
            max-width:250px;
            scrollbar-width:none;
            -ms-overflow-style:none;
        }
        #hobbiesChoosedList:-webkit-scrollbar{
        dispaly:none;
        }

            .otherIcon{
                box-shadow: 0 0 2px 0 rgb(54, 53, 53,0.8);
                border-right:none;
                border:solid 3px transparent;
                padding:8px;
                transform:translateY(0px)!important;
                border-radius:5px 0 0 5px;
            }
            .hobbies{
                border:solid 3px transparent;
                border-radius: 5px;
                padding:8px 0 8px 8px!important;
                box-shadow: 0 0 2px 0 rgb(54, 53, 53,0.8);
                width:94%;
                text-align:left;
                cursor:pointer;
            }
            .hobbies:hover{
                opacity:0.7;
                background:rgba(214, 214, 214, 0.58);
            }
            .cover{
                position:relative;
                background-color:rgba(122, 118, 118, 0.10);
                height:250px;
                width:100%;
                border-radius:8px;
                font-size:1.2em;
                cursor:pointer;
                display:flex;
                align-items:center;
                justify-content:center;
                gap:10px;
                margin-bottom: 10px;
                border:2px dashed #c3c3c3;
                transition: border 0.2s;
            }
            .cover:hover {
                border-color: #1877f2;
            }
            .profil{
                border-radius:50%;
                width:80px;
                height:80px;
                background:rgb(249, 249, 249);
                border:solid 4px rgba(174, 174, 174, 0.33);
                position:absolute;
                bottom:25px;
                right:-20px;
                transform:translateX(-50%);
                filter:brightness(1.1) drop-shadow(0 0 5px rgb(110, 126, 158));
                font-size:2em;
                cursor:pointer;
                transition: border 0.2s;
            }
            .profil:hover {
                border:solid 4px #0056b3;
            }
            textarea.bio{
                border-radius:10px;
                width:97%!important;
                resize:none;
                height:100px;
                padding:10px;
                margin:0 auto;
                display:block;
                font-size:1em;
                border:2px solid rgb(165, 163, 163);
                color:#333;
                ouline:none;
            }
            .profil-form input[type="text"],
            .profil-form input[type="url"] {
                outline:none;
                transition: border 0.2s;
            }
            .profil-form input[type="text"]:focus,
            .profil-form input[type="url"]:focus,
            .profil-form textarea:focus {
                border-color: #1877f2;
                background: #fff;
            }
            .profil-form button[type="submit"]:hover {
                background: #0056b3;
            }
            .profilImg, .coverImg{
                width:100%;
                height:100%;
                position:absolute;
            }
            form{
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                gap: 0px; 
                width: 700px !important;                 
                margin: 50px auto 100px!important; 
                max-width:100%!important;
                background: #fff; 
                border-radius: 16px; 
                box-shadow: 0 8px 32px rgba(0,0,0,0.08); 
                padding: 32px 24px;
            }
            .choosedHobbie{
                padding:5px 20px;
                border-radius:15px;
                box-shadow: 0 0 20px 0 rgba(198, 193, 193, 0.4);
                background:linear-gradient(45deg, rgb(163, 158, 158), rgba(189, 189, 189, 0.59));
            }
            body{
                height:max-content;
            }
            @media (max-width: 600px) {
                .profil-form {
                    padding: 18px 4px;
                }
                .card, .profil-form {
                    width: 98% !important;
                }
            }
        </style>
    `

    profil.style.cssText=`
        width:100vw;
    `
    document.body.innerHTML=profil.outerHTML;

    lucide.createIcons();
    const skip=document.querySelector('.skip');
    skip.onclick=()=>{
        showLoadingPage();
        setTimeout(async()=>{
            await fetchPageContent('/frontend/views/templates/homeT.php');
        },3000);
        // animation de bienvenue
    }
    const hobbiesList=document.getElementById('hobbiesList');
    const hobbiesChoosedList=document.getElementById('hobbiesChoosedList');
    hobbiesList.style.cssText=`
        top:${hobbiesChoosedList.offsetTop + hobbiesChoosedList.offsetHeight + 15}px;
        left:${hobbiesChoosedList.offsetLeft - 10}px;
        width:${hobbiesChoosedList.offsetWidth +145}px;
        display:none;
    `;
    const files=document.querySelectorAll('input[type="file"]');
    files.forEach((file)=>
    file.onchange=(e)=>{

        const blob=new Blob([e.target.files[0]]);
        const url=URL.createObjectURL(blob)
        const label=document.querySelector(`label.${file.id}`);
        label.style.cssText=`
            background-image:url(${url});
            background-size:cover;
            background-position:center;
            background-color:white;
            border: solid 3px #0056b3;
        `
        label.textContent=""
    }
    );

    const hobbiesElement=document.querySelectorAll('#hobbiesList li');
    hobbiesElement.forEach((hobbie)=>{
         hobbie.onclick=()=>{
        hobbiesChoosedList.querySelector('span')?.remove()
          const choosed=document.createElement('li');
          choosed.textContent=hobbie.textContent;
          choosed.className="choosedHobbie";
          hobbiesChoosedList.appendChild(choosed);
          hobbiesChoosedList.style.overflowX="scroll"
          hobbie.remove();
        }
    })

    const hobbies=document.querySelector('.hobbies');
    hobbies.onclick=(e)=>{
        e.stopPropagation();
        if(hobbiesList.style.display==="none" && hobbiesList.hasChildNodes()){
            console.log(hobbiesList.childNodes)
            hobbiesList.style.display="block"
            hobbiesList.animate([
                {opacity:0, transform:"scale(0)"},
                {opacity:1, transform:"scale(1)"}
            ],
            {
                duration:500,
                fill:"forwards",
                easing:"ease-in-out"
            }
        )
        }
    }


}

window.addEventListener('click',(e)=>{
    const hobbiesList=document.getElementById('hobbiesList')
    if(hobbiesList && !e.target.contains(hobbiesList) && hobbiesList.style.display==="block"){
        hobbiesList.animate([
            {opacity:1, transform:"scale(1)"},
            {opacity:0, transform:"scale(0)"}
        ],
        {
            duration:500,
            fill:"forwards",
            easing:"ease-in-out"
        }
    )
    setTimeout(()=>hobbiesList.style.display="none",600)
    }
})

export const initRegister=async()=>{

    const form=document.getElementById('form-register');
    const data={
        firstname:form.querySelector('input[name="firstname"]').value,
        lastname:form.querySelector('input[name="lastname"]').value,
        emailOrPhone:form.querySelector('#email-phone').value,
        password:form.querySelector('input[name="password"]').value,
        gender:form.querySelector('input[name="gender"]:checked').value,
        "date_of_birth":`${form.querySelector('select[name="year"]').value}-${form.querySelector('select[name="month"]').value}-${form.querySelector('select[name="day"]').value}`,
    }

    if(validateRegister(data)){
        if(data.email){

            await apiRequest('user/register/mailVerify','POST', data)
                    .then(response=>{
                        if(response && response.success){
                            import('./includes.js')
                            .then(module=>{
                                module.retrieveCode(response.data.email,response['csrf_token']);
                                handleRegisterRetrieveCode(response.data);
                            })
                            .catch(err=>console.log(err));
                        }
                    })
                    .catch(err=>console.log(err));
        }else if(data.phone){
            data["csrf_token"]=document.getElementById('csrf_token').value;
            await apiRequest('user/register/phone','POST', data)
                        .then(response=>{
                            if(response && response.success){
                                askFillOtherRegisterInfo();
                                return;
                            }else showNotification(response.message);
                        }).catch(err=>showNotification(err));
        }
    
    }
}

    
const showLoadingPage=()=>{

    document.body.innerHTML=`
        <div style="position:absolute; width:100%; top:35%;">
        <img src="/assets/media/images/facebook-circle.png" width="100px" height="100px" />
        </div>

        <p style="font-size:1.2em; position:absolute; bottom:30px; width:100%;">Powered by DevLawer</p>
    `

    document.querySelector('img').animate([
        {transform: "scale(1)"},
        {transform: "scale(0.9)"},
        {transform: "scale(1)"},
        {transform: "scale(1.2)"},
        {transform: "scale(1)"},
        
    ],
    {
        duration: 2000,
        easing: "cubic-bezier(0,.69,1,.43)",
        fill: "forwards",
        iterations: 1,
    }
)
}
