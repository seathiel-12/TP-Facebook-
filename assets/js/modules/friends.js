const handleFriendsSidebarButtons= ()=>{
    const invitBtn = document.getElementById('invitBtn');
    invitBtn.onclick=()=>fetchPageContent('/frontend/views/templates/invitPage.php');

    const suggestBtn=document.getElementById('suggestBtn');
    suggestBtn.onclick=()=>fetchPageContent('/frontend/views/templates/suggestPage.php');

    const allFriendsBtn=document.getElementById('all-friends');
    allFriendsBtn.onclick=()=> fetchPageContent('/frontend/views/templates/allFriendsPage.php');

    const friendPersonalBtn=document.getElementById('friends-personals');
    friendPersonalBtn.onclick=()=>fetchPageContent('/frontend/views/templates/friendsPersonalsPage.php')
}


////////////////////////////////////////////////////

    // INVIT PAGE ZONE

///////////////////////////////////////////////////

const handleInvitPageButtons=()=>{
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');

    const depliantIcon=document.querySelectorAll('.depliant-icon');
    depliantIcon.forEach(icon=>{
        icon.onclick=()=>{
            const invitDiv= document.querySelector(`.${icon.getAttribute('type')}-invit`);

            invitDiv.classList.toggle('invit-close');

            icon.animate(
                [
                    {transform:`rotate(${invitDiv.className.includes('invit-close') ? 0 : 90}deg)`}
                ],
                {
                    duration:500,
                    fill:"forwards",
                    easing:"ease"
                }
            );

        }
    })
}

function renderInvits(invits,type){
    if(invits.length === 0){
        return `<p>Aucune invitation ${type === 'sent' ? 'envoyée' : 'reçue'}.</p>`
    }
    const typeSet={
        sent:{
            bgc:'rgba(164, 164, 164, 0.69)',
            btnText:'Annuler',
            btnClass:'cancel-sent-invit'
        },
        received:{
            btnBgc:'var(--bg-btn-primary)',
            btnText:'Accepter',
            btnClass:'accept-received-invit',
            refuseBtn: true
        }
    }

    if(type === 'sent'){
            return invits.map((invit,index)=>`
        <div class="flexDivBetween cancel-parent-${index}">
            <div class="flexDivStart">
                <img src="${invit.profile_picture}" style="border-radius:100%; border:solid 3px rgba(50, 50, 50, 0.67);" width="50" height="50" alt="">
                <p>${invit.username}</p>
            </div>
            <div class="flexDivEnd">
              <button class="cancel-sent-invit" ref="${index}" style="width:max-content;" data-as="${invit.ID}" valid="${invit.valid}" padding:10px; background:${typeSet[type].btnBgc}; color:black;">${typeSet[type].btnText}</button>
            </div>
        </div>    
    `).join('');
    } 

    if(type === 'received'){
        return invits=invits.map((invit, index)=>
            `<div class="flexDivStart invit-parent-${index}">
                <img src="${invit['profile_picture']}" width="60" height="60" style="border-radius: 100%;" alt="">
                <div>
                    <p style="text-align: left;">${invit.username}</p>
                    <div class="flexDiv" style="width: 100%">
                        <button class="accept-received-invit" ref="${index}" data-as="${invit.ID}" valid="${invit.valid}" style="width:130px; padding: 10px;">Accepter</button>
                        <button class="reject-received-invit" ref="${index}" data-as="${invit.ID}" style="background: rgba(132, 129, 129, 0.64); width:130px; color:rgba(44, 44, 44, 0.77);">Rejeter</button>
                    </div>
                </div>
            </div>
        `
    ).join('');
    }

}

function handleLoadedInvits(){
    const cancelSentInvit=document.querySelectorAll('.cancel-sent-invit');

    if(cancelSentInvit)
    cancelSentInvit.forEach(cancel=>{
        cancel.onclick=async function (e){
            await apiRequest('user/friends/invit/cancel','POST', {
                ID: e.target.getAttribute('data-as').trim()
            }).then(response=>{
                if(response){
                    const count=document.querySelector('.invit-sent-count');
                    count.textContent=parseInt(count.textContent)-1;
                    document.querySelector(`.cancel-parent-${this.getAttribute("ref")}`)?.remove();
                }else{
                    showNotification('Une erreur est survenue!');
                }
            }).catch(err=>console.error(err));
        }
    })

    
    const acceptReceivedInvit=document.querySelectorAll('.accept-received-invit');

    if(acceptReceivedInvit)
    acceptReceivedInvit.forEach(accept=>{
        accept.onmouseover=(e)=>e.stopPropagation();
        accept.onclick=async function(){
            await apiRequest('user/friends/invit/accept', 'POST', {
                ID:accept.getAttribute('data-as'),
                valid:accept.getAttribute('valid'),
            }).then(response=>{
                if(response && response.success){
                    showNotification('Vous êtes maintenant amis.', 'success');
                }else showNotification('Vous êtes déja amis!');

                document.querySelector(`.invit-parent-${this.getAttribute("ref")}`)?.remove();
            }).catch(err=>console.error(err));
        }
    });

    const rejectReceivedInvit=document.querySelectorAll('.reject-received-invit');

    if(rejectReceivedInvit)
    rejectReceivedInvit.forEach(reject=>{
        reject.onmouseover=(e)=>e.stopPropagation();
        reject.onclick=async function () {
            await apiRequest('user/friends/invit/reject', 'POST', {
                ID: reject.getAttribute('data-as'),
            }).then(response=>{
                if(response && response.success){
                    document.querySelector(`.invit-parent-${this.getAttribute("ref")}`)?.remove();
                }else{
                    showNotification('Une erreur est survenue!');
                }
            }).catch(err=>console.error(err));
        }
    })
}

async function loadInvits(type){
    await apiRequest('user/friends/invit/get&'+type)
            .then(response=>{
                if(response && response.success){
                    if(response.data){
                        const invitsDiv=document.querySelector('.'+type+'-invit');
                        if(invitsDiv){
                            invitsDiv.innerHTML=renderInvits(response.data, type);
                            const count = document.querySelector('.invit-'+type+'-count');
                            count.textContent=response.data.length;
                            count.style.width=count.style.height=20 + 'px';
                            handleLoadedInvits();
                        }
                    }
                }
            })
}

function initInvitPage(){
    loadInvits('sent');
    loadInvits('received');
    handleInvitPageButtons();
}


////////////////////////////////////////////////////

    // ALL FRIENDS ZONE

///////////////////////////////////////////////////

const handleAllFriendsPageButtons=()=>{
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');

}

function renderAllFriends(friends){
    if(friends.length === 0){
        return `<p style="font-size: 0.9em; font-weight: 600; color: rgba(130, 130, 130, 0.74);"> Aucun ami à afficher </p>
`
    }

   friends= friends.map(friend=>`
        <div class="flexDivBetween friend">
            <div class="flexDivStart">
                <img src="${friend['profile_picture']}" width="60" height="60" style="border-radius: 100%;" alt="">
                    <p>${friend.username}</p>
                </div>
            <div class="rounded-icon">
                <i data-lucide="ellipsis"></i>
            </div>
        </div>
        `
    ).join('');

    return friends;
}

async function loadAllFriends(){
    await apiRequest('user/friends/get/me')
            .then(response=>{
                if(response && response.success){
                    if(response.data){
                        const allfriendsDiv=document.querySelector('.all-friends');
                        allfriendsDiv.innerHTML=renderAllFriends(response.data);
                        lucide.createIcons();
                    }
                }
            }).catch(err=>console.error(err));
}

 function initAllFriends(){
    handleAllFriendsPageButtons();
    loadAllFriends();
}


//////////////////////////////////////////////////////////




const handleFriendsPersonalButtons=()=>{
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');

}





//////////////////////////////////////

    // SUGGESTION PAGE

/////////////////////////////////////

function handleSuggestPageButtons(){
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');

}


function renderSuggestions(suggestions){

    if(!suggestions){
        return `<p>Pas de suggestions.</p>`;
    }

    suggestions=suggestions.map((suggestion,index)=>
            `<div class="flexDivStart suggestion-parent-${index}" valid="${suggestion.valid}">
                <img src="${suggestion['profile_picture']}" width="60" height="60" style="border-radius: 100%;" alt="">
                <div>
                    <p style="text-align: left;">${suggestion.username}</p>
                    <div class="flexDiv" style="width: 100%">
                        <button index=${index} class="accept-suggestion" style="width:130px; padding: 10px;">Ajouter ami(e)</button>
                        <button index=${index} class="remove-suggestion" style="background: rgba(198, 198, 198, 0.64); width:130px; color:rgba(44, 44, 44, 0.77);">Retirer</button>
                    </div>
                </div>
            </div>
        `
    ).join('');
    return suggestions;
}

async function loadSuggestions(){
    const suggestions=await apiRequest('user/friends/suggestions/get');
        if(suggestions && suggestions.success){
            const suggestionDiv=document.querySelector('.friends-suggestions');
            
            suggestionDiv.innerHTML=renderSuggestions(suggestions.data);
            handleSuggestions();
        } 
}

const handleSuggestions=()=>{
    const acceptBtn=document.querySelectorAll('.accept-suggestion');
    const remove=document.querySelectorAll('.remove-suggestion');

    acceptBtn.forEach(function (btn,index){
        btn.onclick=async(e)=>{
            await apiRequest('user/friends/suggestions/add','POST', {
                id: document.querySelector(`.suggestion-parent-${btn.getAttribute('index')}`).getAttribute('valid')
            }).then(response=>{
                if(response && response.success){
                    showNotification(response.message, 'success');
                    document.querySelector(`.suggestion-parent-${btn.getAttribute('index')}`)?.remove();
                    return;
                }
            }).catch(err=>console.error(err));
        }
    })
    
    remove.onclick=()=>{
        
    }
}   


const initSuggestionPage=async()=>{
    handleSuggestPageButtons();
    await loadSuggestions();
}



export const initFriendPage=(bodyClassName)=>{
    
    switch(bodyClassName){
        case 'friends-home':{
            handleFriendsSidebarButtons();
            break;
        }
        case 'friends-invit':{
            initInvitPage();
            break;
        }
        case 'friends-suggest':{
            initSuggestionPage();
            break;
        }
        case "friends-all":{
            initAllFriends();
            break;
        }
        case "friends-personals":{
            handleFriendsPersonalButtons();
            break;
        }
    }
}