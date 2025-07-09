

const divIconBorder=document.createElement('div');
let allPosts=null;

//Bordure de bas des icones de navigation du header
const createDivIconBorder=(div,divIconBorder)=>{
    if(div){
        div.firstElementChild.style.stroke='blue';
        divIconBorder.style.top=div.offsetTop + div.offsetHeight - 4 + 'px';
        divIconBorder.style.left=div.offsetLeft + 'px';
        divIconBorder.style.display="block";    
    }
}

// Manipuler la boite de dialogue qui s'affiche au click du bouton icone profil du header 
const handleProfilContextuelLi=()=>{
    const disconnectBtn=document.querySelector('.disconnect');
    disconnectBtn.onclick=()=>{
        fetchPageContent('/frontend/views/usersClients/logout.php');
        fetchPageContent('/frontend/views/usersClients/auth.php');
        return;
    }
}


// Couleur de fond d'un post
const createColorList=async()=> {
    const colors=document.createElement('ul');

    colors.innerHTML=`
        <li class="color" style="background:linear-gradient(45deg, rgba(255, 55, 55, 0.76),  rgb(255, 70, 70));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(255, 220, 45), rgba(216, 230, 27, 0.63));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(56, 255, 89), rgba(24, 160, 28, 0.71));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(55, 40, 192), rgba(61, 88, 195, 0.47)) ;"></li>
        <li class="color" style="background:linear-gradient(45deg, rgba(56, 219, 255, 0.86), rgba(4, 84, 92, 0.34));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(166, 22, 198), rgba(68, 12, 92, 0.65));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(255, 165, 0), rgba(255, 140, 0, 0.57));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(255, 20, 147), rgba(219, 112, 147, 0.43));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(0, 255, 127), rgba(46, 139, 87, 0.2));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(138, 43, 226), rgba(75, 0, 130, 0.5));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(255, 69, 0), rgba(255, 99, 71, 0.6));"></li>
        <li class="color" onclick="changeColor(this)" style="background:linear-gradient(45deg, rgb(0, 191, 255), rgba(30, 144, 255, 0.4));"></li>
        <li class="color" style="background:linear-gradient(45deg, rgb(255, 215, 0), rgba(255, 223, 0, 0.7));"></li>
        <li
    `
    colors.classList.add('flexDiv');
    colors.classList.add('colors');
    
    return colors;
}

//Change la couleur de fond d'un post
export const changeColor=async (li=null)=>{  
    console.log(li)
    if(li){
        const textareaPost=document.getElementById('post-text');  

        if(textareaPost.style.height !== '250px'){
            const modal=document.querySelector('.modal');
            modal.style.transform=`translateY(-85px)`;    
        }
        textareaPost.classList.add('changed-color')
        textareaPost.style.cssText=`
        background:${li.style.background};
        height:250px;
        `;
        textareaPost.focus();
    }
}


//Modale de creation d'un post
 const handleCreatePostModal=()=>{
    const closeModal=document.querySelector('.closeModal');
    const modal=document.querySelector('.modal');
    closeModal.addEventListener('click',()=> {
        document.querySelector('.modal').classList.remove('visible');
        document.body.classList.remove('overflow');
        document.querySelector('.overlay')?.remove();
    });

    const postBackground=document.querySelector('.background');
    const textareaPost=document.getElementById('post-text');
    textareaPost.oninput=()=>{
        if(textareaPost.value.trim()){
            modal.querySelector('button').removeAttribute('disabled');
        }else{
            modal.querySelector('button').disabled=true;
        }   
    }

    const file=document.getElementById('file');
    file.onchange=(e)=>{

        const file=document.querySelector('.file-and-caption .file');
        file.innerHTML= (showFile(e.target)).outerHTML;
        document.querySelector('.removeFile')
        lucide.createIcons();

        const removeFileBtn=document.querySelector('.removeFile')
        removeFileBtn.onclick=(e)=>{
            e.stopPropagation();
            removeFile();
        };

        const postText= document.getElementById('post-text');
        postText.style.height='30px';
        postText.classList.remove('changed-color');
        postText.style.background='white';

        const colors = document.querySelector('.color-smile');
        if(colors)
        colors.style.display="none";

        document.getElementById('submit').disabled=false;
        document.querySelector('.modal').style.transform="translateY(-105px)"

        }

        postBackground.onclick= async (e)=>{
        e.stopPropagation();

        postBackground.classList.remove('background');
        
        const colors= await createColorList();
        postBackground.innerHTML=colors.outerHTML;
        postBackground.style.width="max-content";

        const list=document.querySelectorAll('.colors li');
        list.forEach(li=>{
            li.addEventListener('click',(e)=> changeColor(e.target))
        })
    }

}

//Gerer les bouton de la section main-section : zone ou se chargnt les posts
 const handleHomePostDiv=()=>{   
    const modal=document.querySelector('.modal');
    const postInput= document.querySelector('.home-top-post .createPostBtn');
    const textareaPost=document.getElementById('post-text');  
    
    postInput.onclick=(e)=>{
        console.log('click')
        e.stopPropagation();
        modal.classList.add('visible');
        modal.style.top=`calc((100vh - ${modal.offsetHeight+'px'})/2)`;
        modal.style.transform='translate(0)';
        const overlay=document.createElement('div');
        overlay.className="overlay"; 
        document.body.appendChild(overlay);
        textareaPost.focus();
        document.body.classList.add('overflow');
    }
}



/////////////////////////////////
 export const loadPosts=async()=>{
    await getAllPostsData();
    const posts=allPosts;
    console.dir(posts)
    if(posts.length === 0) return;


    const renderDate=(date)=>{
        const newDate=new Date(date);
        const months=['Janv', 'Fev', 'March', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date= newDate.getDate();
        const month = months[newDate.getMonth()];
        const year=newDate.getFullYear();
        const time= (new Date().getHours() - newDate.getHours()) 
    }
     const renderPosts=()=>{
        const htmlPosts=posts.map(post=>
            `
            <div class="post card">
                <div class="flexDivBetween">
                    <div class="flexDivStart">
                    <img src="/assets/media/${post['profil_picture']?'posts/'+post['profil_picture']:'images/'+(post.gender==='male'?'boy':(post.gender==='female'?'happy':'horse'))+'.png'}" width="40" height="40" class="image"/>
                        <p style="text-align:left;"><strong>${post.firstname+' '+post.lastname}</strong> <br> <span style="font-size:0.9em;">${renderDate(post.created_at)}</span> </p>
                    </div>
                    <div class="flexDiv">
                        <div class="view-post-options"><i data-lucide="ellipsis" class="standard-hover" stroke="gray" style="padding:5px; border-radius:100%;"></i></div>
                        <i data-lucide="x" class="standard-hover" stroke="gray" style="padding:5px; border-radius:100%;"></i>
                    </div>
                </div>

                <div ${post.background?`class="post-colored-background flexDiv" style="background:${post.background};"`:" class='post-content'"} >
                    <p>${post?.caption}</p>
                </div>

                <div style="width:100%; margin:auto;">
                    ${post['file_path']?(post['file_path'].includes('image')?`<img class="media-loaded" src="/assets/media/posts/user-${post.author}/${post['file_path']}" />`:`<video class="media-loaded" src="/assets/media/posts/user-${post.author}/${post['file_path']}" controls ></video>`):''}
                </div>
                
                <div class="flexDivBetween post-stats">
                    <div class="">
                         <a class="flexDiv"><i data-icon="like" width="20" height="20" image></i> ${post['nb_likes']}</a>
                    </div>

                    <div class="flexDiv" style="gap:15px;">
                        <a>${post['nb_comments']} commentaires</a>
                        <a>${post.share?post.share+' '+'partages': ''}</a>
                    </div>
                </div>
                <hr style="margin:10px auto 5px;">
                <div class="interactions flexDiv" style="gap:0;">
                    <div class="flexDiv fade-hover"><i data-lucide="thumbs-up"></i> J'aime</div>
                    <div class="flexDiv fade-hover"><i data-lucide="message-circle"></i> Commenter</div>
                    <div class="flexDiv fade-hover"><box-icon name='share' style="transform:rotateY(180deg);"></box-icon> Partager</div>
                </div>
            </div>
            `
        ).join('');
        return htmlPosts;
    }

    const loadedPosts=document.querySelector('.loaded-posts');
    loadedPosts.innerHTML=renderPosts();

    lucide.createIcons();
}
////////////////////////////////

 const handleHomeHeaderIcon= ()=>{
    const homeIcon = document.querySelector('.homeIcon');
    const friendIcon = document.querySelector('.friendsIcon');
    const groupsIcon = document.querySelector('.groupsIcon');

    const accountIcon = document.querySelector('.accountIcon');
    const notificationIcon = document.querySelector('.notificationIcon');
    const messengerIcon= document.querySelector('.messengerIcon');

    const modal=document.querySelector('.modal')
   
    const profilContextuel= document.querySelector('.profil-contextuel');
    accountIcon.onclick= (e)=> {
        e.stopPropagation();
        profilContextuel.classList.toggle('visible');

     }
 

    createIcons();
}

export const handlePosting=()=>{
    const modal=document.querySelector('.modal');
    modal.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const white=['#fff', '#ffffff', 'white', 'hsl(0, 0.00%, 100.00%)', 'rgb(255, 255, 255), rgb(255, 255, 255, 1)',]

        const captionField=modal.querySelector('#post-text');
        const background=white.find((color)=>captionField.style.background === color)? null: captionField.style.background;
        const author_id= document.getElementById('me').value;
        const token=document.getElementById('csrf_token').value;
        const file=document.getElementById('file');        

        if(file.value){
            const data=new FormData();
            data.append('file', file.files[0]);
            data.append('caption',captionField.value);
            data.append('author',author_id),
            data.append('csrf_token',token);
            if(background)
            data.append('background', background);
    
            console.log(data);
    
            await fetch('api/user/posts/create', {
                method:"POST",
                body: data
            }).then(data=>data.json())
              .then(async(response)=> {
                    if(response && response.success){
                        await getAllPostsData();
                        await loadPosts();
                        createPostOptions();
                        initHome();
                        document.querySelector('.modal').classList.remove('visible');
                        document.querySelector('.overlay')?.remove();
                        document.body.classList.remove('overflow');
                        showNotification(response.message, 'success');
                    }else{
                        showNotification(response.message);
                    }
            })
            .catch(err=>console.log(err));
        }else{
            const data={
                author:author_id,
                caption:captionField.value,
            }

            if(background)
            data.background=background;

            await apiRequest('user/posts/create', 'POST', data).then(async(response)=>{
                if(response && response.success){
                    showNotification(response.message, 'success');
                    await loadPosts();
                    createPostOptions();
                    initHome();
                    document.querySelector('.modal').classList.remove('visible');
                    document.body.classList.remove('overflow');
                    document.querySelector('.overlay')?.remove();
                }
            })
        }
    })
}

const showFile=(file)=>{
    const blob= new Blob(file.files);
    const url=URL.createObjectURL(blob);
    let media;

    if(file && file.files[0].type.includes('video')){
       media= document.createElement('video');
       media.controls=true;
    }else if(file && file.files[0].type.includes('image')){
        media=document.createElement('img')
    } 

    media.classList.add('post-media')
    media.src=url;

    const divSvg= document.createElement('div');
    const removeFileBtn =document.createElement('i');
    removeFileBtn.style.top="16px"
    removeFileBtn.style.right="25px"
    removeFileBtn.setAttribute('data-lucide','x');
    removeFileBtn.classList.add('cancel-icon');
    removeFileBtn.classList.add('fade-hover');
    divSvg.innerHTML=removeFileBtn.outerHTML;
    divSvg.classList.add('removeFile');
    const div=document.createElement('div');
    div.innerHTML=`
        ${divSvg.outerHTML}
        ${media.outerHTML}
    `;
    div.style.position="relative";
    return div    
}

const removeFile=()=>{
    const fileInput=document.getElementById('file');
    fileInput.value=null;
    file.files=null;
    document.querySelector('.file').innerHTML='';
    document.querySelector('#post-text').style.height='80px';
    document.querySelector('.color-smile').style.display="flex";

}

const getAllPostsData=async()=>{
    try{
        const posts=await apiRequest('user/posts/all');
        if(posts && posts.success){
            allPosts=posts.data;
        }else{
            showNotification(posts.message);
        }
    }catch(err){
        console.error(err);
    }
}

export const initHome=async()=>{
    const divIcon=document.querySelectorAll('.top-nav div');
    divIconBorder.className="divIconBorder";
    document.querySelector('header').appendChild(divIconBorder);

    createDivIconBorder(divIcon[0],divIconBorder);
    divIcon.forEach((div,index)=>{
        div.onclick=()=>{
            divIcon.forEach(div=>div.firstElementChild.style.stroke="");
            createDivIconBorder(div,divIconBorder);
        }
    });  
    handleHomePostDiv(); 
    handleHomeHeaderIcon();
    handleCreatePostModal();
    handleProfilContextuelLi(); 
    changeColor();
    createIcons();
}




//////////////////////////////////////////////////////////////////////////////
//Gestion des posts

export const createPostOptions=()=>{
    const ul=document.createElement('ul');
    const optionsPoints=document.querySelector(".view-post-options");
    ul.className="options-post on-window-click-close"
    ul.innerHTML=`
        <li class="flexDivStart" style="padding-left:15px;"><i data-lucide="bookmark" fill="#000"></i> <p>Enregistrer la vidéo</p></li>
        <hr style="margin:0 auto; width:90%; border: solid 0.5px rgba(192, 190, 190, 0.45);">
        <li class="flexDivStart" style="padding-left:15px;"><i data-lucide="user-round-x"></i><p>Bloquer ce profil</p></li>    
        <li class="flexDivStart" style="padding-left:15px;"><i data-lucide="message-square-warning"></i><p>Signaler la publication</p> </li>
    `

    document.querySelector('.main-section').appendChild(ul);
    
    ul.style.cssText=`
        position:absolute;
        top:${optionsPoints?.offsetTop + optionsPoints?.offsetHeight}px;
        left:${optionsPoints?.offsetLeft - ul.offsetWidth + optionsPoints.offsetWidth - 20}px;
        display: none;
    `

    optionsPoints.onclick=(e)=>{
        e.stopPropagation();
        ul.classList.toggle('visible');
    }

    lucide.createIcons();
}


export const handlePostInteractions=()=>{

}

/////////////////////////////////////////////////////////////////////////////