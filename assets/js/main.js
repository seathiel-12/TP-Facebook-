const loadJsModule=(bodyId)=>{
    switch(bodyId){
        case 'register':
            import('./modules/register.js')
               .then(module=>{
                module.initRegister();
                document.title="Register";
            })
                .catch(error=>console.error('Error loading register module:', error));
          break;
        case 'auth':
            import('./modules/auth.js')
              .then(module=>{
                 module.initAuth();
              })
              .catch(error=>console.error('Error loading auth module:', error));
            document.title="Authenfication-login";
          break;
    }
}

const fetchPageContent=async(url)=>{
  await fetch(url)
    .then(response=>response.text())
        .then(html=> {
            const parser= new DOMParser();
            html=parser.parseFromString(html,'text/html');
            document.body.innerHTML=html.body.innerHTML;
            document.body.id=html.body.id;
            loadJsModule(document.body.id);
         })
    .catch(error=>console.error('Error fetching page content:', error));
}

const form=document.querySelector('form');
form.onsubmit=(e)=>{
  e.preventDefault();
  loadJsModule('auth')
}
