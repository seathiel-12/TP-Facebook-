const DOCUMENT_ROOT={};
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
            await import('./modules/home.js')
              .then(async(module)=>{
                await module.loadPosts();
                module.createPostOptions();
                module.handlePostInteractions();
                module.initHome();
                module.changeColor();
                module.handlePosting();
                document.querySelector('.sidebar').onmouseenter=(e)=> {e.target.style.overflowY="scroll"; console.log("id")};
                document.querySelector('.sidebar').onmouseleave=(e)=> e.target.style.overflowY="hidden";

              })
              .catch(error=>console.error(`Error loading module home: ${error}`));
          break;
    }
}

const fetchPageContent=async(url)=>{
  await fetch(url)
    .then(response=>response.text())
        .then(async(html)=> {
            const parser= new DOMParser();
            html=parser.parseFromString(html,'text/html');
            document.body.innerHTML=html.body.innerHTML;
            document.body.id=html.body.id;
            console.log(document.body.id);
            await loadJsModule(document.body.id);
            lucide.createIcons();
         })
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
        data['csrf_token']=document.getElementById('csrf_token').value;
        options.body=JSON.stringify(data);  
      }else{
        showNotification("Données manquantes lors de l'envoi vers l'api!");
        return;
      }
    }

    try{
      console.log(options);
      const request= 
      await fetch(`/api/${url}`, options)
              .then(response=> response.json())
              .catch(error=> console.warn(`Erreur lors de l\'appel API ${url} :${error}`))  
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


  window.addEventListener('DOMContentLoaded',async ()=>{
    
          await apiRequest('isOnline')
        .then(async (data)=> {
          if(data){
            await fetchPageContent('/frontend/views/templates/homeT.php');
            lucide.createIcons();
          }else{
            showNotification('Veuillez vous reconnecter!', 'error');
            await fetchPageContent('/frontend/views/usersClients/auth.php');
            lucide.createIcons();
          }
        })
        .catch(error=>console.error('Erreur de connection:', error));
          
        // // Regenerer le csrf chaque 10min

        setInterval(async()=>{

          // Gérer les collisions lors des requetes
          // const collision=(e)=>{
          //   e.preventDefault();
          // }
          // const forms=document.querySelectorAll('form');
          // forms.forEach(form=>form.onsubmit=collision)
    
          const generateCRSF=await apiRequest('generateCSRF');
          if(generateCRSF && generateCRSF.success){
            const csrfInput=document.getElementById('csrf_token');
            csrfInput.value=generateCRSF['csrf_token'];
          }
        },600000);

        createIcons();
        // await import('./modules/register.js')
        // .then(module=>{module.showLoadingPage(); lucide.createIcons()})
        // .catch(err=>console.log(err));

        window.addEventListener('click',(e)=>{
          const toClose=document.querySelectorAll('.on-window-click-close');
            toClose.forEach(close=> {
              if(close.classList.contains('visible') && !close.contains(e.target)){
                close.classList.remove('visible')
                document.body.classList.remove('overflow');
                document.querySelector('.overlay')?.remove();
              }
            });

          const toRemove=document.querySelectorAll('.on-window-click-remove');
           toRemove.forEach(remove=> {
            if(remove && !remove.contains(e.target)){
              remove.remove()
              document.body.classList.remove('overflow');
              document.querySelector('.overlay')?.remove();
            }
          });
         });
      });

  
    

  
