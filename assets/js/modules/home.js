const divIconBorder=document.createElement('div');

const createDivIconBorder=(div,divIconBorder)=>{
    if(div){
        div.firstElementChild.style.stroke='blue';
        divIconBorder.style.top=div.offsetTop + div.offsetHeight - 4 + 'px';
        divIconBorder.style.left=div.offsetLeft + 'px';
        divIconBorder.style.display="block";    
    }
}

const handleProfilContextuelLi=()=>{
    const disconnectBtn=document.querySelector('.disconnect');
    disconnectBtn.onclick=()=>{
        fetchPageContent('/frontend/views/usersClients/logout.php');
        fetchPageContent('/frontend/views/usersClients/auth.php');
        return;
    }
}

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


export const handleCreatePostModal=()=>{
    const closeModal=document.querySelector('.closeModal');
    const modal=document.querySelector('.modal');
    closeModal.addEventListener('click',()=> {
        document.querySelector('.modal').classList.remove('visible');
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

export const handleHomePostDiv=()=>{   
    const modal=document.querySelector('.modal');
    const postInput= document.querySelector('.home-top-post .createPostBtn');
    
    postInput.onclick=(e)=>{
        console.log('click')
        e.stopPropagation();
        modal.classList.add('visible');
        modal.style.top=`calc((100vh - ${modal.offsetHeight+'px'})/2)`;
        modal.style.transform='translate(0)';
        const overlay=document.createElement('div');
        overlay.className="overlay"; 
        document.body.appendChild(overlay);
    }
}

/////////////////////////////////
const loadPosts=()=>{
    const posts=[
        {
            author:'Vald',
            profil_picture:'',
            file_path:'',
            created_at :'09 Jul 22h03',
            gender:'male',
            caption:"C'est bien que vous soyiez venus.",
            interactions:{
                like:12,
                share:15,
                comments:{
                    count:9
                }
                
            }
        }
    ]
        

     const renderPosts=()=>{
        const htmlPosts=posts.map(post=>
            `
            <div class="post card">
                <div class="flexDivBetween">
                    <div class="flexDivStart">
                    <img src="/assets/media/${post['profil_picture']?'posts/'+post['profil_picture']:'images/'+(post.gender==='male'?'boy':(post.gender==='female'?'happy':'horse'))+'.png'}" width="40" height="40" class="image"/>
                        <p style="text-align:left;"><strong>${post.author}</strong> <br> <span style="font-size:0.9em;">${post.created_at}</span> </p>
                    </div>
                    <div class="flexDiv">
                        <i data-lucide="ellipsis" class="standard-hover" stroke="gray" style="padding:5px; border-radius:100%;"></i>
                        <i data-lucide="x" class="standard-hover" stroke="gray" style="padding:5px; border-radius:100%;"></i>
                    </div>
                </div>

                <div class="post-content">
                    ${post.caption}
                </div>

                <div>
                    ${post['file_path']?`<img src="/assets/media/posts/${post['file_path']}" />`:''}
                </div>
                
                <div class="flexDivBetween post-stats">
                    <div class="">
                         <a class="flexDiv"><i data-icon="like" width="20" height="20" image></i> ${post.interactions.like}</a>
                    </div>

                    <div class="flexDiv" style="gap:15px;">
                        <a>${post.interactions.comments.count} commentaires</a>
                        <a>${post.interactions.share} partages</a>
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

    const mainSection=document.querySelector('.main-section');
    mainSection.innerHTML+=renderPosts();
    lucide.createIcons();
}
////////////////////////////////

export const handleHomeHeaderIcon=()=>{
    const homeIcon = document.querySelector('.homeIcon');
    const friendIcon = document.querySelector('.friendsIcon');
    const groupsIcon = document.querySelector('.groupsIcon');

    const accountIcon = document.querySelector('.accountIcon');
    const notificationIcon = document.querySelector('.notificationIcon');
    const messengerIcon= document.querySelector('.messengerIcon');

    const modal=document.querySelector('.modal')
   

    const profilContextuel= document.querySelector('.profil-contextuel');
    accountIcon.onclick=(e)=> {
        e.stopPropagation();
        profilContextuel.classList.toggle('visible');
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

const handlePosting=()=>{
    const modal=document.querySelector('.modal');
    modal.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const captionField=modal.querySelector('#post-text');
        const background=captionField.style.background || null;
        const author_id= document.getElementById('me').value;
        const token=document.getElementById('csrf_token').value;
        const file=document.getElementById('file');        

       const data=new FormData();
        data.append('file', file.files[0]);
        data.append('caption',captionField.value);
        data.append('author_id',author_id),
        data.append('csrf_token',token);
        data.append('background', background || null);

        console.log(data);

        await apiRequest('user/post/create', 'POST', data, file.value || null);
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
    document.querySelector('.file').innerHTML='';
    document.querySelector('#post-text').style.height='80px';
    document.querySelector('.color-smile').style.display="flex";

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
    handleProfilContextuelLi();
    handleHomePostDiv();
    handleCreatePostModal();
    loadPosts();
    changeColor();
    handlePosting();
    createIcons();
}