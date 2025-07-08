<?php
namespace App\Controllers;

use App\Models\Model;
use App\Models\Post;

class UserController extends Controller{

    public function createPost(){
        $this->verifyRequestMethod('POST');
        $data=$this->getRequestData();
        if(isset($_FILES['file'])){
            $file=$_FILES['file'];
            if($file['error']){
                $extensions=['mp4','webm','mov'];

                $this->debug($file);
                return;
            } else{
                echo json_encode(['success'=>false,'message'=>"Erreur d'upload du/des fichiers!"]);
                return;
            }          
        }
        // return Model::createEntry('posts',$data);
    }

    public function deletePost($id){
        $this->verifyRequestMethod('POST');

        $post=new Post()->get(['id'=>$id]);

        if(!$post){
            echo json_encode(['success'=>false,'message'=>'Ce post a déjà eté supprimé ou n\'a jamais existé!'], 404);
        }

        if($post['author']!==$id){
            echo json_encode(['success'=>false, "Vous n'êtes pas authorisé à supprimer ce post", 403]);
        }

        //Supprimer post et image si associé
    }

    public function updatePost(){

    }

}