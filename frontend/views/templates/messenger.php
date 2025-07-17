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
                <input type="text" placeholder="Chercher une discussion...">
            </header>

            <ul class="all-chats">
                <li class="flexDivBetween">
                    <div class="flexDivStart">
                        <div><img src="/assets/media/images/male.png" width="50" height="50" style="border-radius:100%;" alt=""></div>
                        <div class="flexDivColumn">
                            <p>Username</p>
                            <p class="message-preview">Hey, je viens de te voir passer...</p>
                        </div>
                    </div>           
                    <div class="chat-options">
                        <i data-lucide="ellipsis-vertical" class="this-chat-option"></i>
                    </div>
                </li>

                <li class="flexDivBetween">
                    <div class="flexDivStart">
                        <div><img src="/assets/media/images/male.png" width="50" height="50" style="border-radius:100%;" alt=""></div>
                        <div class="flexDivColumn">
                            <p>Username</p>
                            <p class="message-preview">Hey, je viens de te voir passer...</p>
                        </div>
                    </div>           
                    <div class="chat-options">
                        <i data-lucide="ellipsis-vertical" class="this-chat-option"></i>
                    </div>
                </li>
            </ul>
        </aside>

        <section>
            <header class="current-chat-header">

            </header>
        </section>
    </main>

</body>
</html>

<script>
    lucide.createIcons();
</script>