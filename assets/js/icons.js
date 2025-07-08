const createIcons=()=>{
    const icons=document.querySelectorAll('i[data-icon]');
    icons.forEach(async(icon)=>{
   try{
        if(icon.hasAttribute('image')){
            const img=document.createElement('img');
            img.src='/assets/media/images/svgIcon/'+icon.getAttribute('data-icon')+'.svg';
            if(icon.hasAttribute('width')) img.setAttribute('width',icon.getAttribute('width'));
            if(icon.hasAttribute('height')) img.setAttribute('height',icon.getAttribute('height'));
    
            icon.replaceWith(img);
            return;
        }
    const svgIconDiv =document.createElement('div');
    const svgElement=await fetch(`/assets/media/images/svgIcon/${icon.getAttribute('data-icon')}.svg`);
        svgIconDiv.innerHTML= await svgElement.text();
        
        svg=svgIconDiv.querySelector('svg');
        svg.setAttribute('width', icon.getAttribute('width') || '30');
        svg.setAttribute('height',icon.getAttribute('height') || '30');
        svgIconDiv.className='bIcon flexDivIcon';

        path=svg.querySelectorAll('path');
        if(!icon.hasAttribute('noTranslate')){
            path[0]?.setAttribute('transform','translate(14,2) scale(0.05)');
            path[1]?.setAttribute('transform','translate(17,7) scale(0.05)');    
            path[2]?.setAttribute('transform','translate(17,7) scale(0.05)');    
        }
        if(icon.hasAttribute('style')) svg.setAttribute('style',icon.getAttribute('style'));
        if(icon.hasAttribute('width')) svg.setAttribute('width',icon.getAttribute('width'));
        if(icon.hasAttribute('height')) svg.setAttribute('height',icon.getAttribute('height'));

        icon.replaceWith(svgIconDiv);
   }catch(err){
    console.log("Icone non trouvée: "+ err);
   }    
})
}
