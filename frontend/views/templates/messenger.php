<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discussions</title>
</head>
<body id="messenger">
    <?php require_once('../includes/header.php'); ?>

    <main>
        <aside class="messenger-aside">
            <header class="find-chat">
                <input type="text" id="search-chat" placeholder="Chercher une discussion..."/>
                <div class="archived-message-btn flexDivStart standard-hover">
                    <box-icon type='solid' name='message-rounded-detail' style="transform:translateY(3px);"></box-icon>
                    <span>Discussions archivées</span>
                </div>
            </header>

            <ul class="all-chats">
             
            </ul>
        </aside>

        <!-- <section class="current-chat">
            <header class="header-top flexDivBetween">
                <div class="flexDivStart">
                    <img src="/assets/media/images/male.png" width="50" height="50" style="border-radius:100%; border:solid 3px var(--bg-button-primary);" alt="">
                    <div class="flexDivstart">
                        <p style="text-align:left;">Username</p>
                        <div class="flexDiv" style="color:rgba(72, 72, 72, 0.71); font-weight:600; font-size:0.9em;"><p>Active now</p><p style="height:10px; width: 10px; border-radius:100%; background: var(--bg-button-secondary); display:block; transform: translateY(2px);"></p></div>
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
                        <img src="/assets/media/images/boy.png" width="120" height="120" style="border-radius:100%; border:solid 3px var(--bg-button-primary);" alt="">
                        <p>Username</p>
                        <p>Joined at January 02 2025</p>
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
      </section> -->

      <section class="current-chat" style="display:flex; flex-direction: column;">
        <div style="margin:auto auto;">
            <div><i data-lucide="message-square-text" width="100" height="100"></i></div>
            <h2>Cliquez sur Une discussion pour la voir s'afficher ici.</h2>
        </div>
      </section>
    </main>

</body>
</html>

<script>
    lucide.createIcons();
</script>