

<section class="main-section">
    <div class="home-top-post card">
        <div>
            <div class="noFormRootStyle flexDiv" style="width:95%; padding:0 10px;">
                <i data-icon="account" style="transform:scale(1.5) translateY(1px); fill:rgba(125, 125, 125, 0.87);"></i>
                <div style="background-color:rgba(212, 212, 212, 0.74); width:100%; padding: 12px 10px 10px; margin:10px; text-align:left; border-radius:50px;" class="standard-hover createPostBtn">Quoi de neuf, <?= $_SESSION['username'] ?>?</div>
            </div>
            <hr style="border-color:rgba(210, 210, 210, 0.32); margin:5px 0; ">
        </div>
        <div class="flexDivIcon">
            <div class="flexDivIcon options standard-hover"><i data-lucide="video" fill="red" stroke="red"></i> <p>Video en direct</p></div>
            <div class="flexDivIcon options standard-hover"><i data-lucide="images" stroke="rgb(115, 227, 145)" ></i> <p>Photo et Video</p></div>
            <div class="flexDivIcon options standard-hover"><i data-lucide="smile" stroke="rgb(215, 224, 90)"></i> <p>Humeur/Activité</p></div>
        </div>
    </div>
    
    <div class="home-top-post card">
        <div class="flexDivStart story" style="gap:10px;">
            <i data-lucide="plus" stroke="rgb(44, 70, 219)" style="background:#ebf5ff; padding:10px; border-radius:50%;"></i>
            <p style="text-align: left;"><strong>Créer une story</strong> <br> <span style="opacity:0.6;">Partagez une photo ou un message</span> </p>
        </div>
    </div>

</section>

<aside class="right">
     <p style="text-align:left; margin-bottom:10px; font-size:1.15em; color:rgb(71, 70, 70);">Discussions de groupe</p>
    <div class="flexDivStart standard-hover groups">
        <i data-lucide="plus" style="background:#e2e5e9; padding:5px; border-radius:50%;"></i>
        <p>Créer une discussion de groupe</p>
    </div>
</aside>


<!-- includes -->

<form class="noFormRootStyle modal card on-window-click-close" style="max-width:100%!important;" enctype="multipart/form-data">
    <h2 style="padding:10px; width:calc(100% - 20px); position:relative;">Créer une publication <div class="closeModal"><i data-lucide="x" class="standard-hover cancel-icon"></i></div>
    </h2>
    <hr style="border-color:rgba(210, 210, 210, 0.32); margin-bottom:5px;">

    <div style="padding:0 ; width:100%; max-with:100%;">
        <div class="flexDivStart" style="padding: 0 20px; width: calc(100% - 40px);">
            <i data-icon="account" style="transform:scale(1.2) translateY(2px);"></i>
            <div style="width:max-content; text-align:start;" >
                <p style="width:max-content;"><?= $_SESSION['username'] ?></p>
                <div class="visibility flexDiv" style="transform: translate(-10px) scale(0.8);"><i data-icon="friends" style="transform:scale(0.9) translateY(3px);"></i><p>Ami(e)s</p> <box-icon type='solid' name='down-arrow'></box-icon></div>
            </div>
        </div>

        <div class="file-and-caption">
            <textarea name="caption" id="post-text" placeholder="Quoi de neuf, <?= $_SESSION['username'] ?>?"></textarea>
            <div class="file"></div>
        </div>

        <div class="flexDivBetween color-smile" style="width:calc(100% - 40px); padding: 10px 20px 0;">
            <div class="background flexDivIcon"><p>Aa</p></div>
            <div style="width:max-content;" ><i data-lucide="smile" style="transform: translateY(5px);"></i></div>
        </div>

        <div class="add-type flexDivBetween">
            <strong>Ajouter une publication</strong>
            <div style="width:max-content;" class="flexDiv">
                <label for="file" title="Photo/video"><i data-lucide="images" stroke="rgb(115, 227, 145)" style="transform: translateY(2px); padding:5px;" class="fade-hover"></i></label>
                <input type="file" hidden name="file" id="file" accept="video/*"> 
                <img src="/assets/media/images/svgIcon/mention.svg" title="Identifier des personnes" class="fade-hover" width="35" height="35" style="border-radius:100%;" alt="">
                <div title="Humeur/Activité"><i data-lucide="laugh" stroke="yellow" style="padding:5px; border-radius:100%;" class="fade-hover"></i></div>
                <img src="/assets/media/images/svgIcon/map.svg" title="Je suis là" style="padding:5px; border-radius:100%;" class="fade-hover" width="25" height="25" alt="">
            </div>
        </div>

        <button type="submit" id="submit" style="width:calc(100% - 40px); margin:20px;" disabled>Publier</button>
    </div>
</form>

<script>
    createIcons();
</script>

<style>
    .modal #post-text{
        border:none;
        resize:none;
        scrollbar-width: none;
        width: calc(100% - 40px);
        padding: 10px 20px;
        height:80px;
        font-size:1.5em;
        outline:none;
    }

    .changed-color{
        text-align:center;
        font-size:2em;
        margin-top:10px;
        font-weight:bold;
        color:white;
    }
    .cancel-icon{
        background:#e2e5e9; 
        padding:5px; 
        border-radius:50%; 
        cursor:pointer; 
        position: absolute;
        right:20px; top:25%;
        z-index:5;
    }
    .post-media{
        border-radius: 10px;
        margin: 10px 20px;
        width: calc(100% - 40px);
        max-height: 290px;
    }
    .file-and-caption{
        max-width: 100%;
        /* overflow-x: hidden; */
        max-height: 350px;
        overflow-y: auto;
        scrollbar-width: none;
        margin-bottom: 7px;
    }
    .modal #post-text::placeholder{
        color:rgb(88, 88, 88);
    }
    .add-type{
        border-radius:10px;
        padding:10px 20px;
        border:solid 1px gray;
        width: calc(100% - 80px);
        margin:20px !important;
    }
    .background{
        border-radius: 5px;
        background:linear-gradient(to right, rgb(212, 49, 49), rgb(255, 255, 93));
        height:30px;
        width: 30px;
        font-weight: 600;
        color: purple;
        box-shadow: 0 0 10px rgb(205, 199, 199);
        cursor: pointer;
    }
    .visibility{
        width:max-content;
        padding:5px;
        background: rgba(190, 189, 189, 0.67);
        border-radius: 5px;
        width:100px;
        height:20px;
        font-size:0.9em;
        font-weight:500;
        transform: scale(0.8) translateX(-8px);
    }
    .modal{ 
        position: absolute;
        background-color: white;
        width: 550px!important;
        left:calc((100vw - 550px)/2);
        z-index: 15;
        display: none;
        margin: auto;   
    }

    .color{
        border-radius:5px;
        padding: 0!important;
        height: 30px;
        width: 30px;
    }
    .groups{
        padding: 10px;
        width: 90%;
    }
    aside.right{
        background-color: var(--bg-secondary);
    }
    section.main-section{
        width: 50%;
    }
    .home-top-post, .post{
        padding: 10px;
        width: 80%;
        margin: 20px auto;
    }
    .home-top-post .options{
        padding:10px;
        cursor: pointer;
        border-radius: 10px;
        width: calc(100%/3 - 10px);
        font-weight: 600;
        color:rgb(69, 68, 68);
    }
    .home-top-post .options:hover{
        background-color: rgba(176, 176, 176, 0.64);
    }
    .home-top-post .story{
        padding: 7px;
        border-radius: 10px;
        cursor: pointer;
    }
    .home-top-post .story:hover{
        background-color: rgba(215, 215, 215, 0.68);
    }
    
</style>


<!-- includes -->

