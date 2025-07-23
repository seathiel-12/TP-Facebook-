const param="valid=";
const createChangeProfilPhotoDiv=()=> {
    const div=document.createElement('div');
    div.innerHTML=`
        <label for="profile_picture">Changer la photo de profil</label> 
        <label for="cover_picture">Changer la cover</label>
        <input type="file" hidden id="profile_picture">
        <input type="file" hidden id="cover_picture">                      
    `
    div.className="profil-div-photo-change on-window-click-remove";
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

async function loadThisUserPosts(posts){
    const thisUserPosts=document.querySelector('.loaded-posts');

    if(posts.length !== 0){
        await import('./posts.js')
        .then(module => {
            thisUserPosts.innerHTML=module.renderPosts(posts);
            lucide.createIcons();
            module.initPosts();
        })
    }else{
        thisUserPosts.innerHTML=`
            <p>Aucune publication.</p>
        `
    }                 
}

export async function initProfil(){
    handleHeaderClicks()
    await createProfil();
}

 async function getUserInfo(){
    const valid=location.href.split(param)[1];
    return await apiRequest('user/profiling/'+valid)
            .then(response => {
                if(response && response.success){
                    return response.data;
                }
            }).catch(err=>console.error(err));
 }

async function createProfil(){
    const thisUser=await getUserInfo();

    const {user, posts, friends} = thisUser;
    console.log(user)
    const valid = document.getElementById('valid').value;
    const isMe= user.valid === valid;

    const profilPicture=document.getElementById('profile-picture');
    profilPicture.src=user['profile_picture'];

    

    const coverPicture=document.querySelector(".profil-cover");

    if(user['cover_picture'])
    coverPicture.style.cssText=`
        background-image: url("${user['cover_picture']}");
        background-size: cover;
        background-repeat: no-repeat;`

    const profilBtn= document.querySelector('.profil-btn');
    const userInfo=document.querySelector('.user-info');

    await loadThisUserPosts(posts);

    if(isMe){
        document.querySelector('.cam').innerHTML+=`
        <div class="rounded-icon camera flexDiv standard-hover"><i data-lucide="camera"></i></div>`;
        

        profilBtn.innerHTML=`
            <button class="flexDiv edit-profil" style="padding-top:0;"> <span> <i data-lucide="pencil" stroke="#d5d5d5" style="position:relative; top:4px;" fill="#000"></i></span> <span> Modifier votre profil</span></button>`
        const filter=document.querySelector('.filter');

        document.querySelectorAll('.profiling').forEach(elem=> elem.classList.remove('profiling'));

        filter.replaceWith(createPostingDiv());
        await import('./posts.js').then(module=>module.handleHomePostDiv())

    }else{
        document.querySelector('.profil-cover').onclick=(e)=>e.stopPropagation();
        profilBtn.innerHTML=`
        <button class="message-this-user flexDiv">
            <img src="/assets/media/images/messenger.svg" width="15px" height="15px" />
            <p>Message</p>
        </button>

        ${user?.isFriend ? `` : `<button class="gray">Ajouter en ami(e)</button>`}
        `

        const optionsPostZone=document.querySelectorAll('.option-post-zone');
        optionsPostZone.forEach(option =>option.remove());

        userInfo.innerHTML=renderInfo(user);
    }

    const username=document.querySelectorAll('.username-text');
    username.forEach(name=>name.textContent=user.username);

    const profilPhoto= document.querySelectorAll('.profil-photo');
    profilPhoto.forEach(photo=>photo.src=user['profile_picture']);

    renderFriends(friends);
    lucide.createIcons();
}

function renderFriends(friends){
    const friendsDiv= document.querySelector('.this-user-friends');

    if(friends.length === 0){
    friendsDiv.innerHTML=`<p style="margin-top:8px;">Aucun ami à afficher.</p>`
    return;
    }
    friends=friends.map(friend=>`
        <div class="profil-friends fade-hover">
            <img src="${friends['profile_picture'] ?? `/assets/media/images/${friend.gender}.png`}" width="90" height="90" style="border-radius: 10px; cursor:pointer;" /> <br>
            <p style="margin-top: 5px;">${friend.firstname + ' ' + friend.lastname}</p>
        </div>
    `).join('');

    friendsDiv.innerHTML=friends;
}

function createPostingDiv(){
    const div=document.createElement('div');

    div.className="home-top-post card"
    div.style.cssText=`
        margin:10px 0;
    `

    div.innerHTML=`
     <div>
            <div class="noFormRootStyle flexDiv" style="width:95%; padding:0 10px;">
            <img width='50' class="profil-photo" height='50' style='border-radius:100%; background:white;' src="" />
                 
                <div style="background-color:rgba(212, 212, 212, 0.74); width:100%; padding: 12px 10px 10px; margin:10px; text-align:left; border-radius:50px;" class="standard-hover createPostBtn">Quoi de neuf, <span class="username-text"></span> ?</div>
            </div>
            <hr style="border-color:rgba(210, 210, 210, 0.32); margin:5px 0; ">
        </div>
        <div class="flexDivIcon">
            <div class="flexDivIcon options standard-hover"><i data-lucide="video" fill="red" stroke="red"></i> <p>Video en direct</p></div>
            <div class="flexDivIcon options standard-hover"><i data-lucide="images" stroke="rgb(115, 227, 145)" ></i> <p>Photo et Video</p></div>
            <div class="flexDivIcon options standard-hover"><i data-lucide="smile" stroke="rgb(215, 224, 90)"></i> <p>Humeur/Activité</p></div>
        </div>
    `
    return div;
}

function renderInfo(user){
    const div=document.createElement('div');
    div.innerHTML=`
        <h2>Intro</h2>
        <div ${user.bio ? "" : "class='flexDivBetween'"}>
        <h3 style="margin:10px 0 5px;">Bio</h3>
        <p>${user.bio ?? 'No bio yet.'}</p>
        </div>
        <hr style="width:30%; margin:5px 0;" />

        <div class="flexDivBetween" style="margin-top:10px;"><h3>Habite à: </h3> <span>Non défini</span></div>
    `
    div.className='this-user-info';
    return div.outerHTML;
}