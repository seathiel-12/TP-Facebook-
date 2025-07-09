

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

    <div class="loaded-posts">
        <div class="home-top-post card">
            <h2>Tu es probablement notre premier visiteur!"</h2>

            <button>Créeons ensemble notre premier post</button>
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

