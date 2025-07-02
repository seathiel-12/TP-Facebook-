
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
            div.innerHTML=`Vous pouvez modifier plus tard qui voit votre genre sur votre profil. Sélectionez Personalisé pour choisir un autre genre, ou si vous préférez ne rien indiquer.`
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
            await apiRequest('mailVerify','POST', {email:data.email});
        }else{
            const registered= await apiRequest('register','POST',data);
            if(registered.success){
                await fetchPageContent('/frontend/views/templates/homeT.php');
                lucide.createIcons();
                showNotification('Succesfully registered', 'success', 5000);
            }else{
                console.error('Erreur de création de compte.');
            }
    
        }
    }
}

    
