const divIconBorder=document.createElement('div');
divIconBorder.className="divIconBorder"

//Créer la bordure de bas qi se deplace sur les icones de navigations de
const createDivIconBorder=(div,divIconBorder)=>{
    const topNavIcons= document.querySelectorAll('.top-nav div');
    topNavIcons.forEach(divIcon => divIcon.firstElementChild.style.stroke="");
    if(div){
        const rect= div.getBoundingClientRect();
        div.firstElementChild.style.stroke='blue';
        divIconBorder.style.top=rect.top + rect.height + 'px';
        divIconBorder.style.left=rect.left + (document.body.offsetHeight > 800 ? (-7.5) : 0) + 'px';
        divIconBorder.style.display="block";    
    }
}

// Manipuler la boite de dialogue qui s'affiche au click du bouton icone profil du header 
const handleProfilContextuelLi=()=>{
    const disconnectBtn=document.querySelector('.disconnect');
    disconnectBtn.onclick=async()=>{
        await apiRequest('logout').then(response=>{
            if(response) loadThisPage('auth');
        }).catch(err=>console.error(err));
        return;
    }
}

const handleHomeHeaderIcon= ()=>{

    const homeIcon = document.querySelector('.homeIcon');
    const friendIcon = document.querySelector('.friendsIcon');
    const groupsIcon = document.querySelector('.groupsIcon');

    const accountIcon = document.querySelector('.accountIcon');
    const disclaimerIcon = document.querySelector('.disclaimerIcon');
    const messengerIcon= document.querySelector('.messengerIcon');
    const disclaimer= document.querySelector('.disclaimer');

    disclaimer.style.cssText=`
        top: ${disclaimerIcon.offsetTop + 20}px;
        right: 10px;
    `

    const modal=document.querySelector('.modal')
   
    const profilContextuel= document.querySelector('.profil-contextuel');
    accountIcon.onclick= (e)=> {
        e.stopPropagation();
        profilContextuel.classList.toggle('visible');

     }
 
    createIcons();

    homeIcon.onclick=()=>{
        if(document.body.id !== 'home')
          loadThisPage('home');
    }

    friendIcon.onclick=()=>{
        if(document.body.id !== 'friends')
            loadThisPage('friends');  
    }

    messengerIcon.onclick=()=>{
        if(document.body.id !== 'messenger')
            loadThisPage('messenger')
    }

    disclaimerIcon.onclick=()=> {
        disclaimer.classList.toggle('visible')
        disclaimer.animate(
            [
                {transform:'translateY(-10px)', opacity: 0},
                {transform:'translateY(0)', opacity: 1},
            ],
            {
                duration:500,
                easing:'ease',
                fill:"forwards"
            }
        )
    }
    
}

export const initHeader=(page)=>{

    if(page){
        const divIcon=document.querySelector(`.top-nav div.${page}Icon`);
        document.querySelector('header').appendChild(divIconBorder);
    
        createDivIconBorder(divIcon,divIconBorder);    
    }else{
        const topNavIcons= document.querySelectorAll('.top-nav div');
        topNavIcons.forEach(divIcon => divIcon.firstElementChild.style.stroke="");
    
        document.querySelector('.divIconBorder')?.remove();
    }
     

    handleProfilContextuelLi();
    handleHomeHeaderIcon();
}

