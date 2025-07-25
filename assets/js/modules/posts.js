let allPosts=null;
let allComments= null;
let me=null;


export const loadPosts=async(posts)=>{
    if(!posts){
        await getAllPostsData();
        posts=allPosts;
    }
    allPosts=posts;
    const loadedPosts=document.querySelector('.loaded-posts');
    loadedPosts.innerHTML=renderPosts(posts);
    createPostOptions();
    enableProfiling();
    lucide.createIcons();
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


export const handleHomePostDiv=()=>{   
    const modal=document.querySelector('.modal');
    const postInput= document.querySelectorAll('.home-top-post .createPostBtn');
    const textareaPost=document.getElementById('post-text');  
    
    // Supprimer les anciens event listeners en clonant les éléments
    postInput.forEach(postInp=>{
        const newPostInp = postInp.cloneNode(true);
        postInp.parentNode.replaceChild(newPostInp, postInp);
    });
    
    // Récupérer les nouveaux éléments et ajouter les event listeners
    const newPostInputs = document.querySelectorAll('.home-top-post .createPostBtn');
    newPostInputs.forEach(postInp=>{
        postInp.onclick=(e)=>{
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
            handleCreatePostModal();
        }
    })
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

    handlePosting();
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


export const renderPosts=(posts)=>{
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

    if(posts.length === 0){
        return `
        <div class="home-top-post card">
            <h2>Aucun fil à explorer?</h2>

            <button class="createPostBtn">Créeons ensemble notre premier post</button>
        </div>
        `
    }

    const htmlPosts=posts.map((post, index)=>
        `
        <div class="post card" data-post-id="${post.id}">
            <div class="flexDivBetween">
                <div class="flexDivStart">
                <img src="/assets/media/${post['profile_picture'] ? 'posts/user-'+post.author+'/'+post['profile_picture'] : 'images/'+(post.gender==='male' ? 'boy' : (post.gender==='female' ? 'happy' : 'horse'))+'.png'}" width="40" height="40" class="image"/>
                    <p style="text-align:left;"><a class="profiling" refering="${post.valid}" style="color:black;"><strong>${post.firstname+' '+post.lastname}</strong></a> <br> <span style="font-size:0.9em;">${renderDate(post.created_at)}</span> </p>
                </div>
                <div class="flexDiv option-post-zone">
                    <div class="view-post-options" ref="${index}" post-author="${post.author}" post="${post.id}"><i data-lucide="ellipsis" class="standard-hover" stroke="gray" style="padding:5px; border-radius:100%;"></i></div>
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
                    <a class="comment" post="${post.id}"><span comment-count>${post['nb_comments']}</span> commentaires</a>
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


const handlePosting=()=>{
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
                        document.querySelector("#post-text").value=""
                        document.querySelector("#post-text").style.height="80px"
                        initPosts();
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
                    initPosts();
                    document.querySelector("#post-text").value=""
                    document.querySelector("#post-text").style.height="80px"
                    document.querySelector('.modal').classList.remove('visible');
                    document.body.classList.remove('overflow');
                    document.querySelector('.overlay')?.remove();
                }
            })
        }
    })
}

 function enableProfiling(){
    
    const profilingBtns=document.querySelectorAll('.profiling');
    profilingBtns.forEach(btn=>
        btn.onclick=async()=>{


            await loadThisPage('profil', btn.getAttribute('refering'));
            

            document.querySelector('.profil-contextuel')?.classList.remove('visible')
        }
    )
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


const createPostOptions=()=>{
    const optionsPoints=document.querySelectorAll(".view-post-options");

    optionsPoints.forEach((option,index)=>{
        option.onclick=(e)=>{
            e.stopPropagation();
            const exists=document.querySelector(`.this-option-${option.getAttribute('ref')}`);
            if(exists){
                document.querySelectorAll(".options-post")?.forEach(opt=>opt?.remove());
                return;
            }else{
                document.querySelectorAll(".options-post")?.forEach(opt=>opt?.remove()); 
            }
            const author= option.getAttribute('post-author');
            const post =option.getAttribute('post');
            const ul=document.createElement('ul');
            ul.className=`options-post this-option-${option.getAttribute('ref')} on-window-click-remove`
            ul.innerHTML=`
                <li class="flexDivStart" style="padding-left:15px;"><i data-lucide="bookmark" fill="#000"></i> <p>Enregistrer </p></li>
                <hr style="margin:0 auto; width:90%; border: solid 0.5px rgba(192, 190, 190, 0.45);">
                ${author == document.getElementById('me').value ? 
                `<li class="flexDivStart delete-post" post="${post}" style="padding-left:15px;"><i data-lucide="trash-2" ></i> <p>Supprimer le post</p></li>`:

                `<li class="flexDivStart" style="padding-left:15px;"><i data-lucide="user-round-x"></i><p>Bloquer ce profil</p></li>    
                <li class="flexDivStart" style="padding-left:15px;"><i data-lucide="message-square-warning"></i><p>Signaler la publication</p> </li>
                `
                }
            `
            document.body.querySelector('main').appendChild(ul);
            lucide.createIcons();

            if(author == document.getElementById('me').value)
            handleCreatePostOptionsBtns(post);

            ul.style.cssText=`
            position:absolute;
            top:${e.y + window.scrollY + 20}px;
            left:${e.x + window.screenX - ul.offsetWidth + option.offsetWidth - 40}px;
        `
        }  
    })    
}

const removePost=(postID)=>{
    document.querySelector(`div[data-post-id="${postID}"]`)?.remove();
}

const handleCreatePostOptionsBtns=(postID)=>{

    const deletePost=document.querySelector('.delete-post');
        deletePost.onclick=(e)=>{
            e.stopPropagation();
            const div = document.createElement('div');
            div.innerHTML=`
                <h3>Etes-vous sur de vouloir supprimer ce post?</h3>
                <p>Vous perdrez toutes les interactions associées.</p>
                <button class="cancel-delete-post" style="background:rgba(164, 164, 164, 0.64); color: black; width: 100%;">Annuler</button>
                <button class="delete-this-post" post="${postID}" style="background:rgba(255, 49, 49, 0.67); width:100%;">Supprimer</button>
            `
            document.body.appendChild(div);
        
            div.className="on-window-click-remove confirm-delete-post"
            div.style.cssText=`
            width:40%;
            padding: 15px 25px;
            background: white;
            box-shadow: 0 0 10px 0 rgba(66, 66, 66, 0.8);
            border-radius: 10px; 
            position:fixed;
            z-index:1000000;
            top: calc((100vh - ${div.offsetHeight}px)/2);
            left: calc((100vw - ${div.offsetWidth}px)/2);
            transform: translateX(60%);
            `
            const overlay=document.createElement('div');
            overlay.className="overlay"
            document.body.appendChild(overlay);
            document.body.classList.add("overflow")
            handleConfirmDeletePost()
        }
}

const deletePosts=async(postId)=>{
    await apiRequest('user/posts/delete','POST',{
        id: postId,
    }).then((response)=>{
        if(response && response.success){
            showNotification('Post supprimé.', 'success');
            closeDeletePostModale();
            removePost(postId);
        }
    }).catch(err=>{
        showNotification('Une erreur est survenue');
        console.error(err);
    })
}

const closeDeletePostModale=()=>{
    document.querySelector('.confirm-delete-post')?.remove();
    document.body.classList.remove('overflow');
    document.querySelector('.overlay')?.remove();
}

const handleConfirmDeletePost=()=>{
    const cancel=document.querySelector('.cancel-delete-post')
    const deleteThisPost=document.querySelector('.delete-this-post');
    cancel.onclick=()=>closeDeletePostModale();
    deleteThisPost.onclick=(e)=>deletePosts(e.target.getAttribute('post'));
}


/**
 * 
 * @param {*} element l'element option Points pour definir la zone d'option proche des optionsPoints
 * @param {*} commentId id du commentaire associé
 * @returns la zone d'options
 */
export function createCommentOptions(element,commentId){
    const options=document.createElement('ul');
    options.innerHTML=`
        <li class="flexDivBetween modify-comment" comment-id="${commentId}"><p comment-id="${commentId}">Modifier</p> <i data-lucide="pencil" comment-id="${commentId}" width="20" height="20"></i></li>
        <li class="flexDivBetween delete-comment backhere" comment-id="${commentId}"><p comment-id="${commentId}">Supprimer</p> <i data-lucide="trash-2" comment-id="${commentId}" width="20" height="20"></i></li>
    `
    options.style.cssText=`
        width: 160px;
        border-radius: 10px;
        background: white;
        box-shadow: 0 0 10px 0 rgba(181, 181, 181, 0.63);
        position: absolute;
        top : ${element.offsetTop - 25}px;
        left: ${element.offsetLeft + element.offsetWidth + 5}px;
    `
    options.onclick=(e)=>e.stopPropagation();
    options.className="option-window-click-close"
    return options; 
}

    function handlingComment(){
        const optionsPoints=document.querySelectorAll('.comment-options-points');
             optionsPoints.forEach(thisOptionPoints=>
            thisOptionPoints.onclick=(e)=> { 
                e.stopPropagation();
            if(!document.querySelector('.option-window-click-close')){
                thisOptionPoints.parentNode.appendChild(createCommentOptions(thisOptionPoints, thisOptionPoints.parentNode.getAttribute('comment-id')));

                const modifyComment=document.querySelector('.modify-comment');
                 modifyComment.onclick=(e)=>{
                const textarea=document.querySelector('.comment-textarea');
                const comment=document.querySelector(`p[comment-id="${e.target.getAttribute('comment-id')}"]`)
                textarea.value=comment.textContent;
    
                const editAttrValue=e.target.getAttribute('comment-id')+'/'+e.target.getAttribute('comment-id');
                textarea.setAttribute('edit',editAttrValue);
    
                createOnEditDiv();
                lucide.createIcons();
            }
            
            const deleteC= document.querySelector('.delete-comment');
            deleteC.onclick=(e)=>{
                e.stopPropagation();
                confirmDeleteComment();
            }
                lucide.createIcons();
            }else{
                document.querySelector('.option-window-click-close').remove();
            }     

    });
}

function confirmDeleteComment(){
    const deleteC= document.querySelector('.delete-comment');
    deleteC.onclick=()=>{};
    deleteC.innerHTML=`
    <div style="width:100%; margin:0;">
        <button class="cancel-delete-comment" style="background: rgba(186, 186, 186, 0.61); display: block; width: 95%; padding: 10px; margin:5px auto; color:black;">Annuler</button>
        <button class="delete-comment" comment-id="${deleteC.getAttribute('comment-id')}" style="background: rgba(255, 49, 49, 0.67); display: block; width:95%; padding: 10px; margin:5px auto">Supprimer</button>
    </div>
    `
    deleteC.style.padding="5px"
    deleteC.style.background="white";
    deleteC.classList.remove('delete-comment');

    document.querySelector('.cancel-delete-comment').onclick=(e)=> {
        e.stopPropagation();
        const back=document.querySelector('.backhere');
        back.innerHTML=`
            <p comment-id="${document.querySelector('.modify-comment').getAttribute('.modify-comment')}">Supprimer</p> <i data-lucide="trash-2" comment-id="${document.querySelector('.modify-comment').getAttribute('comment-id')}" width="20" height="20"></i>
       `

       back.classList.add('delete-comment');
       back.style.background=""
       back.style.padding="10px 25px";
       lucide.createIcons();
    }

    const confirmDelete=document.querySelector('.delete-comment');
    confirmDelete.onclick=async function(){        
        await apiRequest(`user/posts/comment/delete`, 'POST', {
            id:document.querySelector('.delete-comment').getAttribute('comment-id')
        }).then(response=>{
            if(response && response.success){
                showNotification('Commentaire supprimé.', 'success');

                document.querySelector(`div[comment-id="${this.getAttribute('comment-id')}"]`)?.remove();
                
                initCommentTextarea();
                return;
            }
        }).catch(err=>{
            showNotification('Erreur survenue!');
            console.error(err);
        })
    }
}


function createOnEditDiv(){
    const onedition=document.createElement('div');
    onedition.innerHTML=`
        <p >Edition</p>
        <div class="flexDiv standard-hover stop-edit" style="justify-content: end; width:max-content;"><i style=' transform:translateY(2px);'  data-lucide="x"></i></div>
    `
    onedition.className="flexDivBetween onedition";
    onedition.style.cssText=`
        position: absolute;
        border-radius:20px;
        padding:5px 10px;
        box-shadow: 0 0 5px rgba(101, 82, 82, 0.59);
        top:10px;
        right:10px;
        width: 100px;
        background:linear-gradient(45deg, rgba(172, 148, 148, 0.62), rgba(222, 185, 135, 0.77));
        transform:scale(0.7) translateY(-10px);
    `
    const textarea=document.querySelector('.comment-textarea');

    document.querySelectorAll('.onedition').forEach(edit=>edit.remove())
    textarea.parentNode.appendChild(onedition);

    onedition.querySelector('.stop-edit').onclick=(e)=>{
        e.stopPropagation();
        initCommentTextarea()
    }

}

function initCommentTextarea(){
    const textarea=document.querySelector('.comment-textarea');
        textarea.value=""
        textarea.removeAttribute('edit');
        document.querySelector('.send-comment').disabled=false;
        document.querySelector('.onedition')?.remove();
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
                       clearTimeout(JSON.parse(sessionStorage.getItem(key)).split('/')[0]);

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
            }).catch(err=>{
                console.error(err)
                return [];
            });
    }



    async function renderAllComments(postId){
        await getComments(postId);
        const author=allComments.pop().author;
        const commentsSection= document.querySelector('.comments-elements');
        commentsSection.innerHTML=renderComments(allComments, author);
        
        handlingComment();
        lucide.createIcons();
    }

    function renderComments(Comments,author){

        const comments=Comments;
        const me =document.getElementById('me').value;
        if(comments && comments.length === 0){
            return `
                <div class="no-comment">
                    <p> Pas de commentaires. </p>
                </div>
            `
        }
       
        return comments.map(comment=>
            `   
              <div class="flexDivStart" style="align" style="position:relative;" comment-id="${comment.id}">
                <div class="flexDivStart" style="max-width: calc(100% - 20px); margin: 5px; ">
                        <img width="35" height="35" style="border-radius: 100%; padding:5px; background:rgba(215, 215, 215, 0.64);" src="${comment.profile_picture}"/>

                    <div style="text-align:left; background:rgba(207, 207, 207, 0.72); border-radius:15px; padding:10px;">
                    <strong>${comment.username}</strong> ${(parseInt(me) === comment.user_id || parseInt(me) === author) ? '<span style="font-size:0.8em; padding-left: 5px; color:rgb(89, 64, 37);">Author</span>' : '' }
                    ${comment.created_at !== comment.updated_at ? '<span>(edited)</span>' : ''}
                    <p comment-id="${comment.id}">${comment.comments} </p>
                    </div>
                </div>

                ${(parseInt(me) === comment.user_id || parseInt(me) === author) ? `<div class="comment-options-points rounded-icon fade-hover flexDiv" style="width:20px; height: 20px; transform: translate(-5px, -5px);"><i data-lucide="ellipsis" stroke="rgba(132, 132, 132, 0.96)" width="15" height="15"></i></div>` : ''}
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

        commentModal.showModal();

        renderAllComments(post.id);

        commentModal.style.cssText=`
            position:fixed;
            top:calc((100vh - ${commentModal.offsetHeight + 100 +'px'})/2);
        `

        document.querySelector('.comment-modal-close').onclick=()=>{
            // console.log('ici')
            document.querySelector('.post-comment-modal')?.remove();
            document.querySelector('.overlay')?.remove();
            document.body.classList.remove('overflow');
        }

        const form=document.querySelector('.post-comment-modal form');
        form.onsubmit=async(e)=>{
        e.preventDefault();

        const textarea= document.querySelector('.post-comment-modal .comment-textarea');

        if(!textarea.hasAttribute('edit')){
            await apiRequest(`user/posts/${textarea.getAttribute('data-post-id')}/comment`, 'POST', {
                user_id:document.getElementById('me').value,
                comment: textarea.value
            }).then(response => {
                console.log(response);
               const newComment= renderComments([response.data], response.author);
               createCommentOptions(newComment,null);

               document.querySelector('.no-comment')?.remove();
               document.querySelector('.comments-elements').insertAdjacentHTML('afterbegin',newComment);
               lucide.createIcons();

            });
        }else{

            const ids=textarea.getAttribute('edit').split('/');
            const comment=document.querySelector(`p[comment-id="${ids[1]}"]`);

            if(comment.textContent == textarea.value){
                showNotification('Aucune modification effectué.');
                return;
            }else{
                await apiRequest(`user/posts/comment/update`, 'POST', {
                    id:ids[1],
                    comments:textarea.value
                }).then(response=> {
                    if(response && response.success){
                        showNotification('Modification effectuée.','success');
                        comment.textContent=textarea.value;

                        if(!comment.parentNode.innerText.includes('(edited)')){
                            const span=document.createElement('span');
                            span.textContent="(edited)"
                            comment.insertAdjacentElement('beforebegin', span);    
                        }

                        initCommentTextarea();
                        return;
                    }
                }).catch(err => {
                    showNotification('Erreur survenue!'); 
                    console.error(err);
            })
            }
        }
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


export async function initPosts(){
    handleHomePostDiv();
    handlePostInteractions();
    changeColor();
    createPostOptions();
    createIcons();
}