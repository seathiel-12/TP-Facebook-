const createChangeProfilPhotoDiv=()=> {
    const div=document.createElement('div');
    div.innerHTML=`
        <label for="profile_picture">Changer la photo de profil</label> 
        <label for="cover_picture">Changer la cover</label>
        <input type="file" hidden id="profile_picture">
        <input type="file" hidden id="cover_picture">                      
    `
    div.className="profil-div-photo-change";
    return div;
}

 function handleHeaderClicks(){
    const cover=document.querySelector('.profil-cover');
    cover.onclick=(e)=> {
        e.stopPropagation();
        
        document.querySelector('.profil-div-photo-change')?.remove();
        const changePhoto=createChangeProfilPhotoDiv();
        document.body.appendChild(changePhoto);
        changePhoto.style.top = e.layerY + 'px';
        changePhoto.style.left = e.layerX + 'px';
    }
}

async function loadThisUserPosts(user){
    const me =document.getElementById('me').value;
    await apiRequest(`user/posts/get/${me}`)
            .then(async(response)=>{
                if(response && response.success){
                    if(response.data){
                        await import('./posts.js')
                        .then(module => {
                            const thisUserPosts=document.querySelector('.loaded-posts');
                            thisUserPosts.innerHTML=module.renderPosts(response.data);
                            lucide.createIcons();
                            module.initPosts();
                    })
                    }else{
                        publications.innerHTML=`
                            <p>Aucune publication.</p>
                        `
                    }               
                }
            })
}

export async function initProfil(thisUser){
    handleHeaderClicks()
    await loadThisUserPosts();
}



function createProfil(thisUser){
    const me = document.getElementById('me')
    const isMe= thisUser.id === parseInt(me);

    const profilPicture=document.getElementById('profile-picture');
    profilPicture.src=thisUser['profile_picture'];

    const coverPicture=document.querySelector(".profil-cover");
    coverPicture.style.cssText=`
        background-image: url("${thisUser['cover_picture']}");
        background-size: cover;
        background-repeat: no-repeat;`

    const profilBtn= document.querySelector('.profil-btn');
    const userInfo=document.querySelector('.user-info');

    if(isMe){
        const profilPhoto= document.querySelector('.profil-photo');
        profilPhoto.innerHTML+=`
        <div class="rounded-icon camera flexDiv standard-hover"><i data-lucide="camera"></i></div>`;

        profilBtn.innerHTML=`
            <button class="flexDiv edit-profil"> <i data-lucide="pencil" stroke="#d5d5d5" fill="#000"></i> Modifier votre profil</button>`
        
        userInfo.innerHTML=``

    }else{
        profilBtn.innerHTML=`
        <button class="message-this-user">
            <img src="/assets/media/svgIcon/home/messenger_logo.png" width="15px" height="15px" style="" />
        </button>

        ${thisUser.isFriend ? `` : `<button>Ajouter en ami(e)</button>`}
        `
        
    }

    const username=document.getElementById('username');
    username.textContent=thisUser.username;

    
}