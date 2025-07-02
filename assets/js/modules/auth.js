
const validateLogin= async (data)=>{
    const {text, password}=data;
    const type=verifyEmailOrPhone(text);
    let valid=true;
    if(!type){
        const p=document.getElementById('error-text');
        p.style.display="block"; 
        p.innerHTML=`
        <i data-lucide="circle-x" style="width:17px; height:17px"></i>
        <span> Exemple: meta@gmail.com ou numéro: +123 12345678</span>
        `
        document.querySelector('input[type="text"]').style.borderColor='red';
        // document.querySelector('input[type="text"]').onfocus=(e)=>{
        //     e.target.style.borderColor='';
        //     p.style.display="none"; 
        // }
        valid=false;
    }
    if(!validatePassword(password)){
        const p=document.getElementById('error-password');
        p.style.display="block";
        p.innerHTML=`
        <i data-lucide="circle-x" width="17px" height="17px"></i>
        <span>Entrez un mot de passe valide d'au moins 8 caractères.</span>
        `
        document.querySelector('input[type="password"]').style.borderColor='red';
        // document.querySelector('input[type="password"]').onfocus=(e)=>{
        //     e.target.style.borderColor='';
        //     p.style.display="none"; 
        // }
        valid=false;
    } 

    if(valid){
        data[type]=text;
        delete data.text;
        const request = await apiRequest('login', 'POST', data);
            console.log(request);
        if(request && request.success){
           await fetchPageContent('/frontend/views/templates/homeT.php');
           showNotification('Connexion réussie','success');
           lucide.createIcons();
        }else{
            const notification=document.querySelector('.borderOnNotification');
            if(notification){
            notification.animate([
                {borderColor:'red'},
                {borderColor:'transparent'}
            ],{
                duration:300,
                fill:'forwards',
                easing:'ease-in-out',
                iterations:3
            })
            return;
            }
            showNotification(request.message,'error');
        }
    }
}

export const handleForgotPassword=()=>{
    const forgotPassword=document.querySelector('.forgot-password');
        forgotPassword.onclick=async ()=>{
            await import('./includes.js')
            .then(module=>{
              module.createForgotPasswordDiv();
            })
            .catch(error=>console.error('Error loading includes module:', error));
        }
}

export const initAuth=(formClass='form')=>{
    const form=document.querySelector(formClass);
        const data={
            text:form.querySelector('input[type="text"]').value,
            password:form.querySelector('input[type="password"]').value
        }
    validateLogin(data);
}