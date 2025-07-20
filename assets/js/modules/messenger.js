
let allChats= null;
let date= null;
let valid=null;
let me =null;
const param='with='
let chatInfos=null;

export async function initMessenger(){
    valid=document.getElementById('valid').value;
    me=document.getElementById('me').value;
    await loadChats();
    handleMessagesSidebar();
    const user=location.href.split(param)[1];
    if(user){
        const chat = document.querySelector(`.all-chats li[valid="${user}"]`)
        renderCurrentChat(user, chat);
    }
}

function handleMessagesSidebar(){
    const chatsDiv= document.querySelectorAll('.all-chats li');

    chatsDiv.forEach( chat=>{
        chat.onclick=()=>{
            renderCurrentChat(chat.getAttribute('valid'), chat);
            history.pushState({},'', '/messenger?with='+chat.getAttribute('valid'));
        }
    })
}

async function getAllChats(){
   await apiRequest('discussions/get')
            .then(response=>{
                if(response && response.success){
                    allChats=response.data;
                    return;
                }
            });
}

async function loadChats(){
    await getAllChats();
    console.log('users');
    const chatsDiv=document.querySelector(".all-chats");
    if(Array.isArray(allChats) && allChats.length === 0){
        chatsDiv.innerHTML=`
            <div class="no-discussions">
                <p>Pas de discussions</p>
                <button style='margin: 10px auto;'>Ecrivez à vos amis</button>
            </div>
        `  
        return;
    }

    chatsDiv.innerHTML=renderDiscussions(allChats);
    lucide.createIcons();
}

function renderDiscussions(discussions){
    return discussions.map(disc=>`
        <li class="flexDivBetween" valid="${disc.valid}" dtjat="${disc.created_at}">
            <div class="flexDivStart">
                <div><img src="${disc.profile_picture}" width="50" height="50" style="border-radius:100%;" alt=""></div>
                    <div class="flexDivColumn">
                        <p class="name">${disc.username}</p>
                        <p class="message-preview" ${(disc.is_read === 0  && disc.sender !== valid)? "style='font-weight:bold; color: black;'" : ''}>
                           ${disc.sender === valid ? '<i data-lucide="mouse-pointer-2" width="15" height="15" style="transform: translateY(3px);"></i>' : ''} ${disc.content.length > 30? disc.content.slice(0, 30) + '...' : disc.content}
                        </p>
                    </div>
                </div>           
            ${(disc.is_read === 0  && disc.sender !== valid) ? "<div class='chat-count flexDiv'></div>" : ''}
        </li>
    `).join('');
}

async function getAllMessages(valid){
    return await apiRequest('discussions/messages/get/'+valid)
            .then(response=> {
                if(response && response.success){
                    chatInfos=response.infos;
                    return response.data;
                }
            })
            .catch(err=>console.error(err));
}

async function renderMessages(validate, message=null){
    let messages=[{
        valid:validate,
        content:message
    }];
    console.log(validate)
    if(!message){
         messages = await getAllMessages(validate);
    }

    return messages.map(message=>`
            <div data-as="${message.ID}" class="${message.valid === valid ? 'flexDivEnd message-blue my-message' : 'flexDivStart message-gray'}">
                <div>
                    <p class="content">${message.content}</p>
                    ${message.is_edited ? '<p style="width:100%; text-align: right; font-size:0.8em;">(edited)</p>' : ''} 
                </div>
            </div>
        `).join('');
}

async function renderCurrentChat(chatInfo, elem, infos){

    const currentChat=document.createElement('section');

    currentChat.innerHTML=` 
        <header class="header-top flexDivBetween">
            <div class="flexDivStart">
                <img src="${elem.querySelector('img').src}" width="50" height="50" style="border-radius:100%; border:solid 3px var(--bg-button-primary);" alt="">
                <div class="flexDivstart">
                    <p style="text-align:left;">${elem.querySelector('.name').textContent}</p>
                    <div class="flexDiv" style="color:rgba(72, 72, 72, 0.71); font-weight:600; font-size:0.9em;">
                        <p class="online"></p>
                        <p class="online-green-round" style="height:10px; width: 10px; border-radius:100%; background: var(--bg-button-secondary); display:block; transform: translateY(2px);"></p>
                    </div>
                </div>
            </div>
            <div class="flexDivEnd" style="width: max-content;">
                <div class="rounded-icon fade-hover chat-icon"><i  data-lucide="phone" ></i></div>
                <div class="rounded-icon fade-hover chat-icon"><i  data-lucide="video" ></i></div>
                <img src="/assets/media/images/split.svg" width="24" height="24" class="rounded-icon fade-hover split-icon" alt="">
            </div>
        </header>

        <main>
            <div class="chat-container-middle">
                <section class="chat-container">
                    <div class="first-element-of-chat">
                        <img src="${elem.querySelector('img').src}" width="120" height="120" style="border-radius:100%; border:solid 3px var(--bg-button-primary);" alt="">
                        <p style="font-weight: 600; font-size: 1.2em;">${elem.querySelector('.name').textContent}</p>
                        <p>Joined at <strong>${renderDate(elem.getAttribute('dtjat'))}</strong></p>
                    </div>

                    <div class="all-messages">
                        ${await renderMessages(chatInfo)}
                    </div>

                </section>
                <section class="input-zone">
                    <input type="text" placeholder="Rechercher un message...">
                </section> 
            </div>
           <section class="send-message-zone flexDiv">
               <div class="flexDiv chat-icon rounded-icon standard-hover"><i data-lucide="plus"></i></div>
                <form valid="${chatInfo}" class="noFormRootStyle flexDiv" style="width:87%; margin:0 5px 0 5px; gap:10px; background:none;">
                    <input type="text" id="send-message" placeholder="Envoyer un message..." required>
                    <div class="send-btn rounded-icon standard-hover flexDiv" style="width: max-content;"><i data-lucide="send-horizontal"></i></div>
                </form>
               <div class="flexDiv standard-hover rounded-icon"><i data-lucide="camera"></i></div>
               <div class="flexDiv standard-hover rounded-icon"><i data-lucide="mic"></i></div>
           </section>
        </main>
    `

    currentChat.className="current-chat";
    currentChat.id=chatInfo;

    document.querySelector('.current-chat').replaceWith(currentChat);
    lucide.createIcons();
    
    updateCurrentChatHeader(chatInfos);
    handleSendMessage();
    handleMessages();
}

function updateCurrentChatHeader(infos){
    console.log(infos)
    const online=document.querySelector('.online')
    online.textContent = infos['online'] ? 'Active now' : `Last seen at ${infos['last_seen']}`;
    if(!infos['online']) document.querySelector('.online-green-round')?.remove()
}

function renderDate(date){
    const newDate=new Date(date);
    const months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const today= new Date();
    const day= newDate.getDate();
    const month = months[newDate.getMonth()];
    const year=newDate.getFullYear();

    return day + ' ' + month + ' ' + year
}

function handleSendMessage(){
    const sendMessage= document.getElementById('send-message');
    const sendMessageForm=document.querySelector('.send-message-zone form');
    const sendBtn=document.querySelector('.send-btn');

    if(sendBtn)
    sendBtn.onclick=()=>{
        sendMessageForm.requestSubmit();
    }
    
    sendMessageForm.onsubmit= async(e)=>{
        e.preventDefault();
        if(!sendMessage.hasAttribute('edit')){
            await apiRequest('discussions/messages/send', 'POST', {
                sender_id: me,
                receiver_id: sendMessageForm.getAttribute('valid'),
                content:  sendMessage.value
            }).then(async (response)=>{
                if(response && response.success){
                    updateMessageView();
                    return;
                }
                showNotification("Une erreur s'est produite!");
                return;
            }).catch(err => console.error(err));   
        }else{
            await apiRequest('discussions/messages/update', 'POST', {
                content: sendMessage.value,
                valid: sendMessage.getAttribute('edit')
            }).then(response => {
                if(response && response.success){
                    const updated=document.querySelector(`.my-message[data-as="${sendMessage.getAttribute('edit')}"] div`);
                    updated.innerHTML=`
                        ${sendMessage.value} <p style="width:100%; text-align: right; font-size:0.8em;">(edited)</p>
                    `

                    initFormZone(sendMessageForm);
                }
            })
        }
    }
}

async function updateMessageView(){
    const sendMessage= document.getElementById('send-message');
    const allMessages=document.querySelector('.all-messages');
    const message= await renderMessages( valid, sendMessage.value);
    allMessages.insertAdjacentHTML('beforeend', message);
    document.querySelector('.message-preview').innerHTML = `
        <div class="flexDiv"><i data-lucide="mouse-pointer-2" width="15" height="15" style="transform: translateY(2px);"></i>${sendMessage.value}</div>
    `;
    lucide.createIcons();
    sendMessage.value="";
}

function handleMessages(){
    
    const messages= document.querySelectorAll('.my-message');
    messages.forEach((messageDiv)=>{

        const message=messageDiv.querySelector('div');

        message.ondblclick=(e)=>{   
            e.preventDefault();

            if(document.getElementById('send-message').hasAttribute('edit')) return;
            const rect = message.getBoundingClientRect();
            const overlay=document.createElement('div');
            overlay.className="overlay on-window-click-close";
            overlay.style.backdropFilter="blur(15px)";
            document.body.appendChild(overlay);

            const mess=message.parentNode.cloneNode(true);
            mess.style.cssText=`
                position:fixed;
                top:${rect.top}px;
                left:${rect.left}px;
                height:max-content;
                width:max-content;
                max-width: calc(28% - 20px);
                z-index: 1000;
                bottom:100px;
            `;

            mess.firstElementChild.style.maxWidth="100%";
            mess.classList.add('on-window-click-remove', 'clone')
            message.classList.add('m-selected');
            document.body.appendChild(mess);

            const animation=mess.animate(
                [
                    {transform:"translateY(0)"},
                    {transform:`translateY(-${rect.height}px)`}
                ],
                {
                    duration:500,
                    fill:"forwards",
                    easing:"ease"
                }
            );
            


            animation.onfinish=()=>{
                const optionDiv=document.createElement('ul');
                optionDiv.innerHTML=`
                    <li data-as="${messageDiv.getAttribute('data-as')}" class="flexDivStart standard-hover edit-message" style="padding:10px; width: calc(100% - 20px); border-radius:10px 10px 0 0;"><i data-lucide="pencil" width="15" height="15" ></i>Modifier</li>
                    <li data-as="${messageDiv.getAttribute('data-as')}" class="flexDivStart red-on-hover delete-message" style="padding:10px; width: calc(100% - 20px); border-radius:0 0 10px 10px;"><i data-lucide="trash-2" width="15" height="15" ></i>Supprimer</li>
                `
                optionDiv.style.width="150px"
                document.body.appendChild(optionDiv);
                console.log(optionDiv.clientWidth)
                optionDiv.style.cssText=`
                    position:fixed;
                    top:${rect.top}px;  
                    left:${rect.left + rect.width - optionDiv.offsetWidth}px;
                    z-index: 1000;
                    width: 150px;
                    background-color: white;
                    border-radius: 10px;
                    margin:10px 0;
                `
                optionDiv.className='card message-option on-window-click-remove';
                lucide.createIcons();
                handleOptionMessage(message);
            }
        }
    })
    
}
 
function handleOptionMessage(elem){
    const editMessage=document.querySelector('.edit-message');
    const deleteMessage=document.querySelector('.delete-message');

    editMessage.onclick=()=>{
        const formZone=document.querySelector('.send-message-zone')
        editMessage.parentNode.remove(); 
        const ed=document.createElement('p')
        ed.innerHTML="Ed"
        ed.style.cssText=`
            border-radius:100%;
            padding:2px;
            border:solid 2px gray;
            font-weight: 800;
            width:30px;
            color: gray;
        `
        ed.className='ed'

        elem.insertAdjacentHTML('afterend', ed.outerHTML);

        elem.animate(
            [
                {transform:"translateX(0)",
                },
                {transform:"translateX(-10px)",
                }
            ],
            {
                duration:1000,
                easing:"ease",
                fill:"forwards"
            }
        )
        
        formZone.querySelectorAll('div').forEach(svg=>svg.remove())
        formZone.classList.replace('flexDiv', 'flexDivStart')

        
        formZone.innerHTML+=`
            <img src="/assets/media/images/checked.svg"  class="edit-check scale"/>
            <i data-lucide="circle-x" class="cancel-on-edition cursp scale"></i>
        `
        lucide.createIcons();

        const input=document.getElementById('send-message');
        input.setAttribute('edit', editMessage.getAttribute('data-as'))
        input.value=document.querySelector('.m-selected .content').innerText;

        handleSendMessage();
        handleEditMode(elem);
    }    

    deleteMessage.onclick=()=>{
        const modal= document.createElement('dialog');
        modal.innerHTML=`
            <button class="supp" style="margin:5px auto; background:rgba(179, 50, 50, 0.67); width: calc(100% - 40px); font-size:600;">Supprimer</button>
            <button class="cancel" style=" margin:5px auto; background:rgba(164, 164, 164, 0.61); width: calc(100% - 40px); color:black; font-size:600;">Annuler</button>
        `;
        modal.className="card flexDivColumn modal";
        document.body.appendChild(modal);
        modal.showModal();

        const rect = modal.getBoundingClientRect();
        modal.style.cssText=`
            position:fixed;
            top: calc((100vh - ${rect.height}px)/2);
            left: calc((100vw - ${rect.width}px)/2);
            padding: 15px;
            margin:0;
            transition:none;
        `;
        document.querySelector('.message-option')?.remove();
        document.querySelector('.clone')?.remove();

        handleDeleteMessage();
    }
}

function handleDeleteMessage(){
    const supp=document.querySelector('.supp');
    const cancel=document.querySelector('.cancel');
    supp.onclick=async()=>{
        await apiRequest('discussions/messages/delete','POST', {
            valid:document.querySelector('.m-selected').parentNode.getAttribute('data-as')
        }).then(response=>{
            if(response && response.success){
                const anim=document.querySelector('.m-selected').parentNode.animate(
                    [
                        {
                            transform: "translateX(-10px)",
                            opacity:1,
                        },
                        {
                         transform: "translateX(10px)",
                         opacity:0
                        }
                    ],
                    {
                        duration:1000,
                        easing:"ease",
                        fill:"forwards"
                    }
                )
                anim.onfinish=()=>document.querySelector('.m-selected').parentNode?.remove();
            }

            closeOverlay();
            document.querySelector('.modal').remove();
        }).catch(err=>console.error(err));
    }

    cancel.onclick=()=>{
        closeOverlay();
        document.querySelector('.modal').remove();
    }
}

function handleEditMode(elem){
    const form=document.querySelector('.send-message-zone form');
    const input=document.getElementById('send-message');
    const checked=document.querySelector('.edit-check');
    const cancel=document.querySelector('.cancel-on-edition');

    checked.onclick=()=>{
        if(input.value.trim()){
            if(input.value.trim() !== document.querySelector('.m-selected').innerText)
                form.requestSubmit();

            initFormZone(form);
            document.querySelector('.ed').remove();
            elem.animate(
                [
                    {transform:"translateX(-10px)",
                    },
                    {transform:"translateX(0)",
                    }
                ],
                {
                    duration:1000,
                    easing:"ease",
                    fill:"forwards"
                }
            )
        }
        else showNotification('Value required');
    }

    cancel.onclick=()=>{
        initFormZone(form);
            document.querySelector('.ed').remove();
            elem.animate(
                [
                    {transform:"translateX(-10px)",
                    },
                    {transform:"translateX(0)",
                    }
                ],
                {
                    duration:1000,
                    easing:"ease",
                    fill:"forwards"
                }
            )
    }

}

function initFormZone(form){
    document.querySelector('.send-message-zone').innerHTML=`
    <div class="flexDiv chat-icon rounded-icon standard-hover" style="transform: translateX(10px);"><i data-lucide="plus"></i></div>
                <form valid="${form.getAttribute('valid')}" class="noFormRootStyle flexDiv" style="width:87%; margin:0 5px 0 5px; gap:10px; background:none;">
                    <input type="text" id="send-message" placeholder="Envoyer un message..." required>
                    <div class="send-btn rounded-icon standard-hover flexDiv" style="width: max-content;"><i data-lucide="send-horizontal"></i></div>
                </form>
               <div class="flexDiv standard-hover rounded-icon"><i data-lucide="camera"></i></div>
    <div class="flexDiv standard-hover rounded-icon"><i data-lucide="mic"></i></div>
    `
    handleSendMessage();
    lucide.createIcons();

    document.querySelector('.m-selected').classList.remove('.m-selected');
}