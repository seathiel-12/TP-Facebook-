
let allChats=null;

export async function initMessenger(){
    await loadChats();
    handleMessagesSidebar();
}

function handleMessagesSidebar(){
    const chatsDiv= document.querySelectorAll('.all-chats li');

    chatsDiv.forEach( chat=>{
        chat.onclick=()=>{
            renderCurrentChat(chat.getAttribute('valid'));
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
        <li class="flexDivBetween" valid="${disc.valid}">
            <div class="flexDivStart">
                <div><img src="${disc.profile_picture}" width="50" height="50" style="border-radius:100%;" alt=""></div>
                    <div class="flexDivColumn">
                        <p>${disc.username}</p>
                        <p class="message-preview">
                            ${disc.content}
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

async function renderMessages(validate){
    const messages=await getAllMessages(validate);
    console.log(messages);
    const valid=document.getElementById('valid');
    return messages.map(message=>`
            <div class="${message.valid === valid ? 'flexDivEnd message-blue' : 'flexDivStart message-gray'}>""
                <div>
                    <p>${message.content}</p>
                </div>
            </div>
        `).join('')
}

function renderCurrentChat(chatInfo){

    const currentChat=document.createElement('section');

    currentChat.innerHTML=`
        <header class="header-top flexDivBetween">
            <div class="flexDivStart">
                <img src="${chatInfo.profile_picture}" width="50" height="50" style="border-radius:100%; border:solid 3px var(--bg-button-primary);" alt="">
                <div class="flexDivstart">
                    <p style="text-align:left;">Username</p>
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
                        <img src="${chatInfo.profile_picture}" width="120" height="120" style="border-radius:100%; border:solid 3px var(--bg-button-primary);" alt="">
                        <p>Username</p>
                        <p>${renderDate(chatInfo.created_at)}</p>
                    </div>

                    <div class="all-messages">
                        ${renderMessages(chatInfo)}
                    </div>

                </section>
                <section class="input-zone">
                    <input type="text" placeholder="Rechercher un message...">
                </section> 
            </div>
           <section class="send-message-zone flexDiv">
               <div class="flexDiv chat-icon rounded-icon standard-hover"><i data-lucide="plus"></i></div>
               <div class="flexDiv" style="width:87%; margin:0 10px 0 5px;"> <input type="text" id="send-message" placeholder="Envoyer un message..."></div>
               <div class="flexDiv standard-hover rounded-icon"><i data-lucide="camera"></i></div>
               <div class="flexDiv standard-hover rounded-icon"><i data-lucide="mic"></i></div>
           </section>
        </main>
    `

    currentChat.className="current-chat";

    document.querySelector('.current-chat').replaceWith(currentChat);
    lucide.createIcons();
}


function renderDate(date){
    const newDate=new Date(date);
    const months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const today= new Date();
    const day= newDate.getDate();
    const month = months[newDate.getMonth()];
    const year=newDate.getFullYear();

    return day + ' ' + month + (year === today.getFullYear()? '' : year) 
}