
const divIconBorder=document.createElement('div');
let allPosts=null;
let allComments= null;
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
    if(posts.length === 0) return;


    const renderDate=(date)=>{
        const newDate=new Date(date);
        const months=['Janv', 'Fev', 'March', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const today= new Date();
        const day= newDate.getDate();
        const month = months[newDate.getMonth()];
        const year=newDate.getFullYear();
        let time=  newDate.getHours();
        let minutes= newDate.getMinutes();
        let secs= newDate.getSeconds();

        if(today.getDate() === day && today.getMonth() === newDate.getMonth() && today.getFullYear() === year){
            time= today.getHours() - newDate.getHours();
            minutes= today.getMinutes() - newDate.getMinutes();
            secs= today.getSeconds() - newDate.getSeconds();

            return time!==0 ? time + ' h' :(minutes!==0 ? minutes + ' min': secs +'s')
        } 

        return day + ' ' + month + (year === today.getFullYear()? '' : year) + ', ' + time + ':' + minutes;
    }
     const renderPosts=()=>{
        const htmlPosts=posts.map(post=>
            `
            <div class="post card" data-post-id="${post.id}">
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
                         <a class="flexDiv"><i data-icon="like" width="20" height="20" image></i> <span class="nb-like" post="${post.id}">${post['nb_likes']}</span></a>
                    </div>

                    <div class="flexDiv" style="gap:15px;">
                        <a class="comment" post="${post.id}">${post['nb_comments']} commentaires</a>
                        <a>${post.share?post.share+' '+'partages': ''}</a>
                    </div>
                </div>
                <hr style="margin:10px auto 5px;">
                <div class="interactions flexDiv" style="gap:0;">
                    <div class="flexDiv fade-hover like" post="${post.id}"><i class="like-icon ${post['is_liked']==1?'liked':''}" data-lucide="thumbs-up" post="${post.id}"></i> J'aime</div>
                    <div class="flexDiv fade-hover comment" post="${post.id}"><i data-lucide="message-circle" post="${post.id}"></i> Commenter</div>
                    <div class="flexDiv fade-hover share" post="${post.id}"><box-icon name='share' style="transform:rotateY(180deg);" post="${post.id}"></box-icon> Partager</div>
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
        await apiRequest('user/posts/all').then(response=>{
            if(response && response.success){
                console.log(response.data);
                allPosts=response.data;
            }else{
                showNotification(response.message);
            }  
        });
        
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
    // handlePostInteractions();
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
    const like= document.querySelectorAll('.like');
    const comments= document.querySelectorAll('.comment');
    const share=document.querySelectorAll('.share');


/* 
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     Like Section
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


    like.forEach((btn)=>{
        btn.onclick=async function (e){
            const svg= document.querySelector(`svg[post='${e.target.getAttribute('post')}']`);

            if(svg){
                svg.classList.toggle('liked');

                //Simuler les likes et dislike en front avant la requete
                const nbLike=document.querySelector(`.nb-like[post="${e.target.getAttribute('post')}"]`);
                nbLike.textContent=parseInt(nbLike.textContent)+(svg.getAttribute('class').includes('liked') ? 1 : (-1));
                
                const key=`Lkp${svg.getAttribute('post')}`;
                        if(sessionStorage.getItem(key)){
                       clearTimeout(JSON.parse(sessionStorage.getItem(key)).split[0]);

                       sessionStorage.removeItem(key);
                       return;
                    }
                
                const dblike=setTimeout(async()=>{
                
                await apiRequest(`user/posts/${e.target.getAttribute('post')}/like`,'POST', {
                    user_id: document.getElementById('me').value,
                    post_id:this.getAttribute('post'),
                    likes:JSON.parse(sessionStorage.getItem(key)).split('/')[1]    
                })
                sessionStorage.removeItem(`Lkp${this.getAttribute('post')}`); 

            },10000);

            sessionStorage.setItem(`Lkp${svg.getAttribute('post')}`,JSON.stringify(dblike+'/'+ (svg.getAttribute('class').includes('liked')? 1 : 0) ));
        }
      }
    })



/* 
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     Comments Section
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

    async function getComments(postId){
       await apiRequest(`user/posts/${postId}/comments`)
            .then(response=>{
                if(response && response.data){
                    allComments= response.data;
                }
            }).catch(err=>{console.error(err)
                return [];
            });
    }

    async function renderAllComments(postId,author){
        await getComments(postId);
        const commentsSection= document.querySelector('.comments-elements');
        commentsSection.innerHTML=renderComments(allComments, author);
    }

    function renderComments(Comments,author){

        const comments=Comments;

        if(comments && comments.length === 0){
            return `
                <div class="no-comment">
                    <p> Pas de commentaires. </p>
                </div>
            `
        }
       
        return comments.map(comment=>
            `
                <div class="flexDivStart" style="max-width: calc(100% - 20px); margin: 10px; ">
                    <img width="35" height="35" style="border-radius: 100%; padding:5px; background:rgba(215, 215, 215, 0.64);" src="../assets/media/${comment.profile_picture ? `posts/user-${comment.user_id}/${comment.profile_picture}` : `images/${comment.gender}.png`}"/>

                    <div style="text-align:left; background:rgba(207, 207, 207, 0.72); border-radius:10px; padding:10px;">
                    <strong>${comment.firstname+ ' ' + comment.lastname}</strong> ${comment.user_id === author ? '<span style="font-size:0.8em; padding-left: 5px; color:rgb(59, 46, 32);">Author</span>' : '' }
                    <p>${comment.comments} </p>
                    </div>
                </div>
            `
        ).join('');
    
    }

    function animateOnAwaitComments(){

    }

    function openCommentModal (post){
        const commentModal= document.createElement('dialog');

        const renderThisPost=(postId)=>{
            const post=document.querySelector(`.post[data-post-id="${postId}"]`).cloneNode(true);
            post.style.margin="20px 10px";
            post.style.width="calc(100% - 40px)"
            return post;
        }
        commentModal.innerHTML=`

            <div class="flexDiv" style="position:fixed; top: 0; left: 0; width:100%; z-index:10; background-color:white; box-shadow: 0 0 10px 0 rgba(168, 168, 168, 0.34);">
                <h2 style="padding:22px; width:calc(100% - 20px); position:relative;">Publication de ${post?.username || (post?.firstname + ' ' + post?.lastname)}<div class="closeModal comment-modal-close"><i data-lucide="x" class="standard-hover cancel-icon"></i></div>
                </h2>
            </div>
            
            <div class="comment-modal-main">
                ${(renderThisPost(post.id)).outerHTML}    

                <div style="margin-bottom:20px;" class="comments-elements">
                    ${animateOnAwaitComments()}
                </div>
            </div>
            

            <div class="comment-modal-zone flexDiv">
                <i data-icon="account" class="standard-hover" style="transform:translate(5px, -25px) scale(50);"></i>
                <form class="noFormRootStyle" style="position: relative; width:90%; height:calc(100% - 20px); margin: 10px 0;">
                    <textarea name="comment" data-post-id="${post.id}" class="comment-textarea" placeholder="Ecrivez un commentaire public..." required></textarea>
                    
                    <div class="insert-element-comment flexDivBetween">
                        <div class="flexDivStart"> 
                            <i data-lucide="smile" width="20" height="20"></i>
                            <i data-lucide="camera" width="20" height="20"></i>
                            <box-icon name='file-gif' type='solid' color='rgb(105, 105, 105)' width="20" height="20" ></box-icon>
                        </div>
                        <button type="submit" class="send-comment standard-hover flexDiv">
                            <i data-lucide="send-horizontal" stroke="rgba(69, 68, 68, 0.72)"></i>
                        </button>
                    </div>
                </form>
            </div>
        `
        commentModal.className="card post-comment-modal on-window-click-remove"
        document.body.appendChild(commentModal);
        const div=document.createElement('div');
        div.className="overlay";

        document.body.appendChild(div);
        document.body.classList.add('overflow');

        lucide.createIcons();
        commentModal.showModal();

        renderAllComments(post.id, post.author);

        commentModal.style.cssText=`
            position:fixed;
            top:calc((100vh - ${commentModal.offsetHeight + 100 +'px'})/2);
        `

        document.querySelector('.comment-modal-close').onclick=()=>{
            document.querySelector('.post-comment-modal').remove();
            document.querySelector('.overlay').remove();
            document.body.classList.remove('overflow');
        }

        const form=document.querySelector('.post-comment-modal form');
        form.onsubmit=async(e)=>{
        e.preventDefault();
        const textarea= document.querySelector('.post-comment-modal .comment-textarea');
        await apiRequest(`user/posts/${textarea.getAttribute('data-post-id')}/comment`, 'POST', {
            user_id:document.getElementById('me').value,
            comment: textarea.value
        }).then(response => {
       
           const newComment= renderComments([response.data]);
           document.querySelector('.no-comment')?.remove();z
           document.querySelector('.comments-elements').insertAdjacentHTML('afterbegin',newComment);
        })
      }
    }

    
    comments.forEach((comment)=>{
        comment.onclick=async (e)=>{
            e.stopPropagation();
            const post = allPosts.find((post)=>post.id == e.target.getAttribute('post'))
            openCommentModal(post);
        }
    })
    
}

/////////////////////////////////////////////////////////////////////////////