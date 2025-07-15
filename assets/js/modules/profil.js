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
                            module.loadPosts(response.data, 'publications-done');
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