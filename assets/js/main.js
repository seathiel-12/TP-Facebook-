
const DOCUMENT_ROOT={};

const routeManager={
  index:{
    path:'/index.php',
    uri:'/'
  },
  register:{
    path:'/frontend/views/usersClients/register.php',
    uri:'/register'
  },
  auth:{
    path:'/frontend/views/usersClients/auth.php',
    uri:'/auth'
  },
  home:{
    path:'/frontend/views/templates/homeT.php',
    uri:'/home'
  },
  friends:{
    path:'/frontend/views/templates/friendsT.php',
    uri:'/friends',
    subpages:{
      all:{
      path:'/frontend/views/includes/allFriendsPage.php',
      uri:'/friends/all'
      },
      invits:{
      path:'/frontend/views/includes/invitPage.php',
      uri:'/friends/invits'
      },
    suggestions:{
      path:'/frontend/views/includes/suggestPage.php',
      uri:'/friends/suggestions'
      },
    personals:{
      path:'/frontend/views/includes/friendsPersonalsPage.php',
      uri:'/friends/personals'
      }
  },
}, 
  profil:{
    path:'/frontend/views/templates/profilPage.php',
    uri:'/profil?valid=',
    param:'valid'
  },
  messenger:{
    path:'/frontend/views/templates/messenger.php',
    uri:'/messenger?with=',
    param:'with'
  },
  fallback:{
    path:'frontend/index.html',
    uri:'/fallback'
  }
}

function createOverlay(){
  const div=document.createElement('div');
  div.className="overlay";
  document.body.appendChild(div);
}

function closeOverlay(){
  document.querySelector('.overlay')?.remove();
}

const loadJsModule=async(bodyId)=>{
    switch(bodyId){
        case 'register':
            document.title="Register";
            await import('./modules/register.js')
               .then(module=>{
                  const formRegister=document.getElementById('form-register');
                  module.showInfoIconDiv();
                  window.addEventListener('click',(e)=>{
                    module.hideInfoIconDiv(e);
                  })
                  formRegister.onsubmit=async (e)=>{
                   e.preventDefault();
                  await module.initRegister();
                }
            })
                .catch(error=>console.error('Error loading register module:', error));
          break;
        case 'auth':
            document.title="Authenfication-login";
            await import('./modules/auth.js')
              .then(module=>{
                module.handleForgotPassword();
                const formAuth=document.getElementById('form-auth');
                formAuth.onsubmit=(e)=>{
                  e.preventDefault();
                  module.initAuth();
                }                
              })
              .catch(error=>console.error(`Error loading auth module: ${error}`));
          break;
          case 'home':
            document.title="Acceuil-Home"
            await import('./modules/home.js')
              .then(async(module)=>{
                await module.initHome();
                document.querySelector('.sidebar').onmouseenter=(e)=> e.target.style.overflowY="scroll";
                document.querySelector('.sidebar').onmouseleave=(e)=> e.target.style.overflowY="hidden";

              })
              .catch(err=>console.error(`Error loading module home: ${err}`));
          break;
          case 'friends':{
            await import('./modules/header.js')
                  .then(module=> module.initHeader('friends'));
            await import('./modules/friends.js')
                  .then(module=> module.initFriendPage(document.body.className));

                break;
          }
          case 'profil':{
            await import('./modules/header.js')
                  .then(module=> module.initHeader());
            await import('./modules/profil.js')
                  .then(module=>{
                    module.initProfil();
                  });
            break;
          }
          case 'messenger':{
            await import('./modules/header.js')
                  .then(module=> module.initHeader());
            await import('./modules/messenger.js')
                  .then(module=> module.initMessenger());
          }
    }
}


const fetchPageContent=async(url)=>{
  await fetch(url)
    .then(response=>response.text())
        .then(async(html)=> {
            const parser= new DOMParser();

            html=parser.parseFromString(html,'text/html');
             const header=html.querySelector('header');
            
                  if(header && header.id && header.getAttribute('id') === document.querySelector('header')?.id){
            
                      const main= html.body.querySelector('main');
                      if(main && html.body.className){
                        document.body.querySelector('main').innerHTML=main.innerHTML;
                        document.body.id=html.body.id;
                        document.body.className=html.body.className;
                        lucide.createIcons();
                        return document.body.id;
                      }
                  }
                  document.body.innerHTML=html.body.innerHTML;
                  document.body.id=html.body.id;
                  console.log(document.body.id);
                  lucide.createIcons();
                  return document.body.id;
              })
            .then(async (id)=>  await loadJsModule(id))
    .catch(error=>console.error('Error fetching page content:', error));
}

const verifyEmailOrPhone=(input)=>{
    const emailRegex=/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex=/^\+[0-9]{1,3}\s\d{8,13}$/;

    if(emailRegex.test(input.trim())){
        return 'email';
    }else if(phoneRegex.test(input.trim())){
        return 'phone';
    }else{
        return null;
    }
}

const validatePassword=(input)=>{
    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(input.trim()) || input.trim().length>=8;
}


const apiRequest=async (url, method='GET', data)=>{
    const options={
      method:method,
      headers:{
        'Content-Type':'application/json'
      }
    }

    if(method !=='GET'){
      if(data){
        data['csrf_token']=document.getElementById('csrf_token')?.value;
        options.body=JSON.stringify(data);  
      }else{
        showNotification("Données manquantes lors de l'envoi vers l'api!");
        return;
      }
    }

    try{
      const request= 
      await fetch(`/api/${url}`, options)
              .then(response=> response.json())
              .catch(error=> console.warn(`Erreur lors de l\'appel API ${url} :${error}`))  
              console.log(request);
      return request;
    }catch(error){
      console.warn(`Erreur lors de l\'appel API ${url} :${error}`)
    } 
  }



  const showNotification=(message,type='error', duration=5000)=>{
    const notification=document.createElement('div');
    notification.classList.add('borderOnNotification');

    const icon=document.createElement('i');
    icon.classList.add('icon');
    if(type==='error'){
      // notification.classList.add('error');
      icon.setAttribute('data-lucide','user-x');
    }else if(type==='success'){
      // notification.classList.add('success');
      icon.setAttribute('data-lucide','user-check');
    }

    notification.innerHTML=`
    <div class="notification ${type}">
      <div class="">
           ${icon.outerHTML}
        <p>${message}</p>
      </div>
    </div>
    `;

    if(document.querySelector('.notification'))
      document.querySelector('.notification').remove(); 

    document.body.appendChild(notification);
    lucide.createIcons();
    setTimeout(()=>{
      notification.animate([
        {transform:'translateX(0)', opacity:1},
        {transform:'translateX(100%)', opacity:0}
      ],{
        duration:500,
        fill:'forwards',
        easing:'ease-in-out'
      }).onfinish=()=>{
        notification.remove();
      }
    },duration);
  }

  const animateElement=(element)=>{

      element.animate([
        {transform:"translateX(10%)", opacity:0},
        {transform:"translateX(0)", opacity:1}
       ],
       {
        duration:1000,
        fill:"forwards",
        easing:"ease-in-out"
       } 
      )
  }


  async function loadThisPage(url, params='', subpage=''){
  
    let route="";
    if(Object.hasOwn(routeManager, url)){

      if(subpage && Object.hasOwn(routeManager[url],'subpages')){
        route=routeManager[url].subpages[subpage];
      }else{
        route =routeManager[url];
      }

      console.log(route)
      history.pushState({page:route.uri + params},'',route.uri+params);
      await fetchPageContent(route.path) 

    }else{
      console.warn('Unknow route '+ url);
     await fetchPageContent(routeManager.fallback.path);
      history.pushState({},'',routeManager.fallback.uri);
    }
  }
  

  window.addEventListener('DOMContentLoaded',async ()=>{

      // await import('./modules/includes.js').then((module)=>module.resetPassword());
      window.addEventListener('popstate',(event)=>{
       console.log(event.state)
       loadThisPage(event.state.page.split('/')[1])
      })
          await apiRequest('isOnline')
        .then(async (data)=> {
          if(data){

            const route=location.pathname.split('/');
            let params= new URLSearchParams(location.search);
            params=params.get(routeManager[route[1]].param)

            console.log(route)
             await loadThisPage(route[1], params ?? '', route[2] ?? '');
            lucide.createIcons();

          }else{
            showNotification('Veuillez vous reconnecter!', 'error');

            await loadThisPage('auth');
            lucide.createIcons();
          }
        })
        .catch(error=>console.error('Erreur de connection:', error));
          
        // // Regenerer le csrf chaque 10min
  
        setInterval(async()=>{
    
          const generateCRSF=await apiRequest('generateCSRF');
          if(generateCRSF && generateCRSF.success){
            const csrfInput=document.getElementById('csrf_token');
            csrfInput.value=generateCRSF['csrf_token'];
          }
        },600000);

        createIcons();

        
        window.addEventListener('click',(e)=>{
          const toClose=document.querySelectorAll('.on-window-click-close');
            toClose.forEach(close=> {
              if(close.className.includes('visible')  && !close.contains(e.target)){
                close.classList.remove('visible')
                document.body.classList.remove('overflow');
                document.querySelector('.overlay')?.remove();
              }
            });

          const toRemove=document.querySelectorAll('.on-window-click-remove');
           toRemove.forEach(remove=> {
            if(remove && !remove.contains(e.target)){
              remove.remove();  
              document.body.classList.remove('overflow');
              document.querySelector('.overlay')?.remove();
            }
          });

          const optionsDivToclose=document.querySelector('.option-window-click-close')
          if(optionsDivToclose && !optionsDivToclose.contains(e.target)){
            optionsDivToclose.remove();
          }
         });
      });

  
    

  
