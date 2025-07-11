<?php
namespace App\Controllers;

use App\Models\Database;
use App\Models\Model;
use App\Models\Post;
use Exception;
use PDOException;
use PHPMailer\PHPMailer\POP3;

class UserController extends Controller{


    public function __construct()
    {   

    }

    public function createPost(){
        if(isset($_FILES['file'])){
            $file=$_FILES['file'];
            if($file['error'] == UPLOAD_ERR_OK){

                if($_POST['author'] != $_SESSION['id']){
                    throw new PDOException('Post invalide!');
                }
                //Type -> max size
                $max_file_size=0;
                $type=$file['type'];
                if(strstr($type,'video')){
                    $max_file_size=MAX_VIDEO_SIZE;
                    $type='video';
                }else if(strstr($type,'image')){
                    $max_file_size=MAX_IMG_SIZE;
                    $type='image';
                }else{
                    echo json_encode(['success'=>false,'message'=>"Fichier non accepté"]);
                    throw new PDOException('Type de fichier non accepté!');
                }


                if($file['size']> $max_file_size){
                    echo json_encode(['success'=>false, 'message'=>"Fichier trop volumineux! La taille maximale est de ". ($type==='video'?(MAX_VIDEO_SIZE/(1024*1024)):(MAX_IMG_SIZE/(1024/1024)))." Mo pour les ".$type."s"]);

                    throw new PDOException('Fichier volumineux!');
                }

                $extensions= $type === 'video' ? ['mp4','webm','mov'] : ['jpg', 'png', 'jpeg', 'svg', 'gif','webp'];

                $ext=strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));
                if(!in_array($ext,$extensions)){
                    echo json_encode(['success'=>false, 'message'=>"Type de fichier non autorisé! Téleverser des fichiers $type"."s au format ". implode('/', $extensions)."."]);

                    throw new PDOException('Extension non autorisée');
                }   
                
                $directory=$_SERVER['DOCUMENT_ROOT'].'/assets/media/posts/user-'.$_SESSION['id'];
                if(!is_dir($directory)){
                    mkdir($directory);
                }
                
                $path=$type.uniqid();

                if(move_uploaded_file($file['tmp_name'], $directory.'/'.$path.'.'.$ext)){
                    try{
                        $_POST['file_path']=$path.'.'.$ext;
                        unset($_POST['csrf_token']) ;

                        $data=$this->cleanData($_POST);
                        if(new Post(data:$data))
                        echo json_encode(['success'=>true, "message"=>"Nouveau post mis en ligne."]);
                        return;
                    }catch(PDOException $e){
                        throw new PDOException($e->getMessage());
                    }
                }
            } else{
                echo json_encode(['success'=>false,'message'=>"Erreur d'upload du/des fichiers!"]);
                return;
            }          
        }
        try{
            $data=$this->getRequestData();
            unset($data['csrf_token']);
            new Post(data:$data);
            echo json_encode(['success'=>true, "message"=>"Nouveau post mis en ligne."]);
            return; 
         }catch(PDOException $e){
            throw new PDOException($e->getMessage());
        }
    }

    public function deletePost($id){

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


    public function posts($action, $id=null){
        if(isset($action)){
            switch($action){
                case 'like':{
                    $data=$this->getRequestData();
                    if(!$data) throw new PDOException('Données manquantes!');
                    unset($data['csrf_token']);
                    
                    if(isset($data['user_id']) && isset($data['post_id']) && isset($data['likes'])){
                        $data['likes']=$data['likes'] == 1 ? 1 : NULL;
                        try{
                            $query="SELECT * FROM posts_interactions WHERE post_id=? AND user_id=? AND likes IS NOT NULL";
    
                            $like= Database::getDb()->prepare($query);
                            $like->execute([$data['post_id'], $data['user_id']]);
                            $like=$like->fetch();
                            if($like){
                                if($like['likes'] === $data['likes']){
                                    echo json_encode(['no_update'=>true]);
                                    return;
                                }
    
                                new Post('posts_interactions')->update($like['id'], ['likes'=>$data['likes']]);
                                echo json_encode(['success'=>true, 'updated'=>true]);
                                return;
                            }
    
                            new Post('posts_interactions', $data);
                            echo json_encode(true);
                            return;
                        }catch(PDOException $e){
                            throw new PDOException($e->getMessage());
                        }
                    }
                break;
                }
                case 'comment':{
                    if(is_null($id)) throw new Exception('ID de post manquant');
                    $data=$this->getRequestData();
                    if(!isset($data['user_id']) || !isset($data['comment']) || empty($data['user_id']) || empty($data['comment'])) throw new Exception('Données de post manquantes');

                    if($data['user_id'] != $_SESSION['id']) throw new Exception('Données fraduleuses!');

                    new Post('posts_interactions', [
                        'user_id'=>$data['user_id'],
                        'post_id'=>$id,
                        'comments'=>$data['comment']
                    ]);

                    echo json_encode(['success'=>true, 'message'=>'Commentaire ajouté', 'data'=>[
                        'profile_picture'=>$_SESSION['picture'],
                        'username'=>$_SESSION['username'],
                        'comments'=>$data['comment']
                    ]]);
                    return;
                }
                default:{
                    throw new Exception('Action not found');
                    break;
                }
            }
        }else{
            echo json_encode('not found');
            return;
        }
    }


}