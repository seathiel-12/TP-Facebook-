const divIconBorder=document.createElement('div');

const createDivIconBorder=(div,divIconBorder)=>{
    div.firstElementChild.style.stroke='blue';
    divIconBorder.style.top=div.offsetTop + div.offsetHeight - 4 + 'px';
    divIconBorder.style.left=div.offsetLeft + 'px';
    divIconBorder.style.display="block";
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
    
    const disconnect=document.getElementById('disconnect');
    disconnect.onclick=async()=>{
        await fetchPageContent('/frontend/views/usersClients/logout.php');
        await fetchPageContent('/frontend/views/usersClients/auth.php');
        lucide.createIcons();
    }
}