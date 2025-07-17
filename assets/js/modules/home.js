
let allPosts=null;
let allComments= null;
let me=null;


//Gerer les bouton de la section main-section : zone ou se chargnt les posts

export const initHome=async()=>{
    await import('./header.js')
          .then(module=> module.initHeader('home'));

    await import('./posts.js')
            .then(async(module)=>{
                await module.loadPosts();
                await module.initPosts();
            }) 
    createIcons();
}

