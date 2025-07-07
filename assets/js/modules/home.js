const divIconBorder=document.createElement('div');

const createDivIconBorder=(div,divIconBorder)=>{
    if(div){
        div.firstElementChild.style.stroke='blue';
        divIconBorder.style.top=div.offsetTop + div.offsetHeight - 4 + 'px';
        divIconBorder.style.left=div.offsetLeft + 'px';
        divIconBorder.style.display="block";    
    }
}

const handleHomeHeaderIcon=()=>{
    const homeIcon = document.querySelector('.homeIcon');
    const friendIcon = document.querySelector('.friendsIcon');
    const groupsIcon = document.querySelector('.groupsIcon');

    const accountIcon = document.querySelector('.accountIcon');
    const notificationIcon = document.querySelector('.notificationIcon');
    const messengerIcon= document.querySelector('.messengerIcon');

    const profilContextuel= document.querySelector('.profil-contextuel');
    accountIcon.onclick=()=> {
        profilContextuel.classList.toggle('visible')  
        // const heightP=profilContextuel.clientHeight-10;
        // const modalOpen=(modal,height)=>{
        //     if(height<heightP){
        //         profilContextuel.style.height=height+'px';
        //         height++;
        //     }
        //     requestAnimationFrame(()=>modalOpen(modal,height));
        // }
        // requestAnimationFrame(()=>modalOpen(profilContextuel,0))

    //     profilContextuel.animate([
    //         {height:0},
    //         {height:"415px"}
    //     ],
    //     {
    //         duration:1000,
    //         easing:'ease',
    //         fill:'forwards'
    //     }
    //   )

      
     }
    
    createIcons();
}



export const initHome=async()=>{
    const divIcon=document.querySelectorAll('.top-nav div');
    divIconBorder.className="divIconBorder";
    document.body.appendChild(divIconBorder);

    createDivIconBorder(divIcon[0],divIconBorder);
    divIcon.forEach((div,index)=>{
        div.onclick=()=>{
            divIcon.forEach(div=>div.firstElementChild.style.stroke="");
            createDivIconBorder(div,divIconBorder);
        }
    });  
    
    handleHomeHeaderIcon();
}