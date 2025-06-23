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

const validateLogin=(data)=>{
    const {text, password}=data;
    const type=verifyEmailOrPhone(text);
    if(!type){
        const p=document.getElementById('error-text');
        p.innerHTML=`
        <i data-lucide="circle-x" style="width:17px; height:17px"></i>
        <span> Exemple: meta@gmail.com ou numéro: +123 12345678</span>
        `
        document.querySelector('input[type="text"]').style.borderColor='red';
    }
    if(!validatePassword(password)){
        const p=document.getElementById('error-password');
        p.innerHTML=`
        <i data-lucide="circle-x" width="17px" height="17px"></i>
        <span>Entrez un mot de passe valide d'au moins 8 caractères.</span>
        `
        document.querySelector('input[type="password"]').style.borderColor='red';
    }
    lucide.createIcons();
}

export const initAuth=()=>{
    const form=document.querySelector('form');
        const data={
            text:form.querySelector('input[type="text"]').value,
            password:form.querySelector('input[type="password"]').value
        }
    validateLogin(data);
}