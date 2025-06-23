
function showInfoIconDiv(icon, index){
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

function hideInfoIconDiv(e){
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

export const initRegister=()=>{
    showInfoIconDiv();
    window.addEventListener('click',(e)=>hideInfoIconDiv(e));
}

    
