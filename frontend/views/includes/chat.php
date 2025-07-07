

<section class="main-section">
    <div class="home-top-post card">
        <div>
            <div class="noFormRootStyle flexDivIcon" style="width:95%; padding:0 10px;">
                <i data-icon="account" style="transform:scale(1.5) translateY(1px); fill:rgba(125, 125, 125, 0.87);"></i>
                <input type="text" style="background-color:rgba(212, 212, 212, 0.74);" class="standard-hover" placeholder="Quoi de neuf <?= $_SESSION['username'] ?>?" name='text' disabled>
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

<form class="noFormRootStyle modal card">
    <h2 class="flexDivBetween" style="padding:10px; width:80%; justify-self:flex-end;">Créer une publication <i data-lucide="x" style="background:#e2e5e9; padding:5px; border-radius:50%;"></i>
    </h2>
    <hr style="border-color:rgba(210, 210, 210, 0.32); ">

    <div class="flexDiv">
        <i data-icon="account" style="transform:scale(1.2) translateY(2px);"></i>
        <div>
            <p style="width:max-content;"><?= $_SESSION['username'] ?></p>
            <div class="visibility flexDiv"><i data-icon="friends" style="transform:scale(0.9) translateY(3px);"></i><p>Ami(e)s</p> <box-icon type='solid' name='down-arrow'></box-icon></div>
        </div>

        <textarea name="content" id="" placeholder="Quoi de neuf <?= $_SESSION['username'] ?>?"></textarea>
    </div>
</form>

<script>
    createIcons();
</script>

<style>
    .modal textarea{
        border:none;
        resize:none;
        scrollbar-width: none;
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
    }
    .modal{ 
        position: absolute;
        background-color: white;
        width: 25%;
    }
    .groups{
        padding: 10px;
        width: 90%;
    }
    .standard-hover{
        border-radius: 10px;
        cursor: pointer;
    }
    .standard-hover:hover{
        background-color: rgba(176, 176, 176, 0.64)!important;
    }
    aside.right{
        background-color: var(--bg-secondary);
    }
    section.main-section{
        width: 50%;
    }
    .home-top-post{
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
    .home-top-post input{
        width:85%;
        border-radius:20px;
        border:none;
        box-shadow: none;
    }
    .home-top-post .story{
        padding: 7px;
        border-radius: 10px;
    }
    .home-top-post .story:hover{
        background-color: rgba(215, 215, 215, 0.68);
    }
    
</style>


<!-- includes -->

