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



const handleInvitPageButtons=()=>{
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');
}

const handleSuggestPageButtons=()=>{
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');

}

const handleAllFriendsPageButtons=()=>{
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');

}

const handleFriendsPersonalButtons=()=>{
    const back=document.querySelector('.back-to-home-friends')
    back.onclick=()=>fetchPageContent('/frontend/views/templates/friendsT.php');

}

export const initFriendPage=(bodyClassName)=>{
    
    switch(bodyClassName){
        case 'friends-home':{
            handleFriendsSidebarButtons();
            break;
        }
        case 'friends-invit':{
            handleInvitPageButtons();
            break;
        }
        case 'friends-suggest':{
            handleSuggestPageButtons();
            break;
        }
        case "friends-all":{
            handleAllFriendsPageButtons();
            break;
        }
        case "friends-personals":{
            handleFriendsPersonalButtons();
            break;
        }
    }
}