
let allPosts=null;
let allComments= null;
let me=null;


//Gerer les bouton de la section main-section : zone ou se chargnt les posts

async function profilingThisUser(thisUser){
    await apiRequest(`user/profiling/${thisUser}`)
            .then(response=>{
                if(res)
            })
    
}

export const initHome=async()=>{
    await import('./header.js')
          .then(module=> module.initHeader('home'));

    await import('./posts.js')
            .then(async(module)=>{
                await module.loadPosts();
                await module.initPosts();
            }) 
    createIcons();
    me=document.getElementById('me').value;
    const profilingBtns=document.querySelectorAll('.profiling');
    profilingBtns.forEach(btn=>
        btn.onclick=()=>{
            fetchPageContent('/frontend/views/templates/profilPage.php')
            document.querySelector('.profil-contextuel')?.classList.remove('visible')
        }
    )
}

