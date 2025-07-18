
let allChats= null;
let date= null;
const valid=document.getElementById('valid').value;
const me =document.getElementById('me').value;

export async function initMessenger(){
    await loadChats();
    handleMessagesSidebar();
}

function handleMessagesSidebar(){
    const chatsDiv= document.querySelectorAll('.all-chats li');

    chatsDiv.forEach( chat=>{
        chat.onclick=()=>{
            renderCurrentChat(chat.getAttribute('valid'), chat);
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
    console.log('users')
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
}

function renderDiscussions(discussions){
    return discussions.map(disc=>`
        <li class="flexDivBetween" valid="${disc.valid}" dtjat="${disc.created_at}">
            <div class="flexDivStart">
                <div><img src="${disc.profile_picture}" width="50" height="50" style="border-radius:100%;" alt=""></div>
                    <div class="flexDivColumn">
                        <p class="name">${disc.username}</p>
                        <p class="message-preview">
                           ${disc.valid !== valid ? 'You: ' : disc.username + ' :'} ${disc.content.length > 30? disc.content.slice(0, 30) + '...' : disc.content}
                        </p>
                    </div>
                </div>           
            <div class="chat-count flexDiv"></div>
        </li>
    `).join('');
}

async function getAllMessages(valid){
    return await apiRequest('discussions/messages/get/'+valid)
            .then(response=> {
                if(response && response.success){
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
         messages=await getAllMessages(validate);
    }

    return messages.map(message=>`
            <div class="${message.valid === valid ? 'flexDivEnd message-blue my-message' : 'flexDivStart message-gray'}">
                <div>
                    <p>${message.content}</p>
                </div>
            </div>
        `).join('');
}

async function renderCurrentChat(chatInfo, elem){



    const currentChat=document.createElement('section');

    currentChat.innerHTML=` 
        <header class="header-top flexDivBetween">
            <div class="flexDivStart">
                <img src="${elem.querySelector('img').src}" width="50" height="50" style="border-radius:100%; border:solid 3px var(--bg-button-primary);" alt="">
                <div class="flexDivstart">
                    <p style="text-align:left;">${elem.querySelector('.name').textContent}</p>
                    <div class="flexDiv" style="color:rgba(72, 72, 72, 0.71); font-weight:600; font-size:0.9em;">
                        <p>Active now</p>
                        <p style="height:10px; width: 10px; border-radius:100%; background: var(--bg-button-secondary); display:block; transform: translateY(2px);"></p>
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
    
    handleSendMessage();
    handleMessages();
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

    sendBtn.onclick=()=>{
        sendMessageForm.requestSubmit();
    }
    sendMessageForm.onsubmit= async(e)=>{
        e.preventDefault();
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
    }
}

async function updateMessageView(){
    const sendMessage= document.getElementById('send-message');
    const allMessages=document.querySelector('.all-messages');
    const message= await renderMessages( valid, sendMessage.value);
    allMessages.insertAdjacentHTML('beforeend', message);
    document.querySelector('.message-preview').textContent = sendMessage.value;
    sendMessage.value="";
}

function handleMessages(){
    const messages= document.querySelectorAll('.my-message');
    messages.forEach(message=>{
        message.ondblclick=(e)=>{
            e.preventDefault()
            const overlay=document.createElement('div');
            overlay.className="overlay on-window-click-close";
            document.body.appendChild(overlay);
            const mess=message.cloneNode(true);
            mess.style.cssText=`
                position:fixed;
                z-index: 1000;
                bottom:100px;
            `;

            const optionDiv=document.createElement('ul');
            optionDiv.innerHTML=`
                <li class="flexDiv"><i data-lucide="pencil" width="15" height="15" ></i>Modifier</li>
                <li class="flexDiv"><i data-lucide="pencil" width="15" height="15" ></i>Supprimer</li>
            `

            optionDiv.style.cssText=`
                position:fixed;
                bottom: calc();
            `
            document.body.appendChild(optionDiv);


            mess.classList.add('on-window-click-remove')
            document.body.appendChild(mess);
        }
    })
    
}
 