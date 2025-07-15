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

    return invits.map(invit=>`
        <div class="flexDivBetween invitation">
            <div class="flexDivStart">
                <img src="${invit.profile_picture}" style="border-radius:100%; border:solid 3px rgba(50, 50, 50, 0.67);" width="50" height="50" alt="">
                <p>${invit.username}</p>
            </div>
            <div class="flexDivEnd">
              <button style="width:max-content; data-as="${invit.uuid}" padding:10px; background:${typeSet[type].btnBgc}; color:black;">${typeSet[type].btnText}</button>
              ${typeSet[type]?.refuseBtn ? `'<button class="reject-received-invit" style="width:max-content; data-as="${invit?.ID}" data-valid="${invit?.valid}" padding:10px; background: rgba(255, 49, 49, 0.67); color:white;">Refuser</button>'` : ''}
            </div>
        </div>    
    `).join('');
}

function handleLoadedInvits(){
    const cancelSentInvit=document.querySelectorAll('.cancel-sent-invit');

    if(cancelSentInvit)
    cancelSentInvit.forEach(cancel=>{
        cancel.onclick=async function (){
            await apiRequest('user/friends/invit/cancel','POST', {
                ID: cancel.getAttribute('data-as')
            }).then(response=>{
                if(response && response.success){
                    this.remove();
                }else{
                    showNotification('Une erreur est survenue!');
                }
            }).catch(err=>console.error(err));
        }
    })

    
    const acceptReceivedInvit=document.querySelectorAll('.accept-received-invit');

    if(acceptReceivedInvit)
    acceptReceivedInvit.forEach(accept=>{
        accept.onclick=async function(){
            await apiRequest('user/friends/invit/accept', 'POST', {
                ID:accept.getAttribute('data-as'),
                user:e.getAttribute('data-valid')
            }).then(response=>{
                if(response && response.success){
                    if(!Object.hasOwn(response, 'noUpdate'))
                    showNotification('Vous êtes maintenant amis.')
                    else showNotification('Vous êtes déja amis!');
                    this.remove();
                }
            }).catch(err=>console.error(err));
        }
    });

    const rejectReceivedInvit=document.querySelectorAll('.reject-received-invit');

    if(rejectReceivedInvit)
    rejectReceivedInvit.forEach(reject=>{
        reject.onclick=async function () {
            await apiRequest('user/friends/invit/reject', 'POST', {
                ID: reject.getAttribute('data-as'),
                user:reject.getAttribute('data-valid')
            }).then(response=>{
                if(response && response.success){
                    this.remove();
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
   friends= friends.map(friend=>{
        `
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
    }).join('');

    return friends;
}

async function loadAllFriends(){
    await apiRequest('user/friends/get/me')
            .then(response=>{
                if(response && response.success){
                    if(response.data){
                        const allfriendsDiv=document.querySelector('.all-friends');
                        allfriendsDiv.innerHTML=renderAllFriends(response.data);
                    }
                }
            })
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

    suggestions=suggestions.map(suggestion=>
            `<div class="flexDivStart" friend-no="${suggestion.id}">
                <img src="${suggestion['profile_picture']}" width="60" height="60" style="border-radius: 100%;" alt="">
                <div>
                    <p style="text-align: left;">${suggestion.username}</p>
                    <div class="flexDiv" style="width: 100%">
                        <button class="accept-suggestion" friend-no="${suggestion.id}" style="width:130px; padding: 10px;">Ajouter ami(e)</button>
                        <button class="remove-suggestion" friend-no="${suggestion.id}" style="background: rgba(198, 198, 198, 0.64); width:130px; color:rgba(44, 44, 44, 0.77);">Retirer</button>
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

    acceptBtn.forEach(btn=>{
        btn.onclick=async(e)=>{
            await apiRequest('user/friends/suggestions/add','POST', {
                id: e.target.getAttribute('friend-no')
            }).then(response=>{
                if(response && response.success){
                    showNotification(response.message, 'success');
                    document.querySelector(`div[friend-no="${e.target.getAttribute('friend-no')}"]`)?.remove();
                    return;
                }
            })   
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