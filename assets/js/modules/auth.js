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
           await loadThisPage('home');
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

/**
 * Anime l'apparition d'un texte lettre par lettre dans un élément.
 * @param {HTMLElement} element - L'élément cible.
 * @param {string} text - Le texte à afficher.
 * @param {number} delay - Délai entre chaque lettre (ms).
 * @param {'fade'|'immediate'} style - Style d'apparition.
 */
export async function animateTextLetterByLetter(element, text, delay = 40, style = 'fade') {
    if (!element) return;
    element.innerHTML = '';
    // Découper le texte en tenant compte des <br>
    const parts = text.split(/(<br\s*\/?>)/i);
    for (let partIdx = 0; partIdx < parts.length; partIdx++) {
        const part = parts[partIdx];
        if (/^<br\s*\/?>$/i.test(part)) {
            element.appendChild(document.createElement('br'));
            continue;
        }
        for (let i = 0; i < part.length; i++) {
            const span = document.createElement('span');
            span.textContent = part[i] === ' ' ? '\u00A0' : part[i];
            if (style === 'fade') {
                span.style.opacity = 0;
                element.appendChild(span);
                setTimeout(() => {
                    span.animate([
                        { opacity: 0 },
                        { opacity: 1 }
                    ], {
                        duration: 200,
                        fill: 'forwards'
                    });
                }, (element.textContent.length + i) * delay);
            } else {
                element.appendChild(span);
            }
            if (style === 'immediate') {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    if (style === 'fade') {
        await new Promise(res => setTimeout(res, text.replace(/<br\s*\/?>/ig, '').length * delay));
    }
}

// export const animateAuthElements = () => {
//     const container = document.querySelector('.main-auth-content');
//     if (container) {
//         container.classList.remove('auth-animate-hidden');
//     }
//     const logo = document.querySelector('.main-auth-content img');
//     const intro = document.querySelector('.main-auth-content p');
//     const form = document.getElementById('form-auth');
//     const createPage = document.querySelector('.main-auth-content > p:last-of-type');

//     if (logo) {
//         logo.animate([
//             { transform: 'translateY(-30px)', opacity: 0 },
//             { transform: 'translateY(0)', opacity: 1 }
//         ], {
//             duration: 700,
//             fill: 'forwards',
//             easing: 'ease-out'
//         });
//     }
//     if (intro) {
//         // Animation lettre par lettre avec effet fade
//         animateTextLetterByLetter(intro, "Avec Facebook, partagez et restez <br> en contact  avec votre entourage.", 20, 'fade');
//     }
//     if (form) {
//         form.animate([
//             { transform: 'translateY(20px)', opacity: 0 },
//             { transform: 'translateY(0)', opacity: 1 }
//         ], {
//             duration: 700,
//             delay: 400,
//             fill: 'forwards',
//             easing: 'ease-out'
//         });
//     }
//     if (createPage) {
//         createPage.animate([
//             { opacity: 0 },
//             { opacity: 1 }
//         ], {
//             duration: 700,
//             delay: 600,
//             fill: 'forwards',
//             easing: 'ease-out'
//         });
//     }
// }

// /**
//  * Anime l'apparition d'un élément texte.
//  * @param {HTMLElement} element - L'élément à animer.
//  * @param {'top'|'bottom'|'left'|'right'|null} direction - Direction de l'animation.
//  * @param {number} duration - Durée de l'animation en ms.
//  * @param {'immediate'|'fade'} style - Style d'apparition.
//  */
// export function animateTextAppear(element, direction = null, duration = 700, style = 'fade') {
//     if (!element) return;

//     let fromTransform = 'none';
//     switch (direction) {
//         case 'top': fromTransform = 'translateY(-30px)'; break;
//         case 'bottom': fromTransform = 'translateY(30px)'; break;
//         case 'left': fromTransform = 'translateX(-30px)'; break;
//         case 'right': fromTransform = 'translateX(30px)'; break;
//         default: fromTransform = 'none';
//     }

//     if (style === 'immediate') {
//         element.style.opacity = 1;
//         element.style.transform = 'none';
//         return;
//     }

//     // Style "fade" (opacité + translation)
//     element.animate([
//         { opacity: 0, transform: fromTransform },
//         { opacity: 1, transform: 'none' }
//     ], {
//         duration: duration,
//         fill: 'forwards',
//         easing: 'ease-out'
//     });
// }