<?php
namespace App\Controllers;

use App\Models\Database;
use App\Models\Model;
use App\Models\Post;
use App\Models\User;
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
        session_start();
        if(isset($_SESSION['id']) && isset($_SESSION['connect']) && $_SESSION['connect']){
            $post=new Post()->get(['id'=>$id]);
            if(!$post){
                echo json_encode(['success'=>false,'message'=>'Ce post a déjà eté supprimé ou n\'a jamais existé!'], 404);
                return;
            }
    
            if($post['author']!==$_SESSION['id']){
                echo json_encode(['success'=>false, "Vous n'êtes pas authorisé à supprimer ce post", 403]);
                return;
            }
        }
       
            if($post['file_path']){
                $path=$_SERVER['DOCUMENT_ROOT'] . '/assets/media/posts/user-'. $_SESSION['id'] .'/' . $post['file_path'];
                if(file_exists($path)){
                    if(!unlink($path)){
                        echo json_encode(['success'=>false, 'message'=>'Erreur lors de la suppression du post.']);
                        return;
                    }   
                }
            }

            new Post()->delete($post['id']);
            echo json_encode(['success'=>true]);
            return;
        
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

                    $author=(new Post()->get(['id'=>$id]))['author'];
                    

                    echo json_encode(['success'=>true, 'message'=>'Commentaire ajouté', 'data'=>[
                        'profile_picture'=>$_SESSION['picture'],
                        'username'=>$_SESSION['username'],
                        'comments'=>$data['comment'],
                    ], 'author'=>$author]);
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


    public function comment($action){
        if(isset($action)){
            if($action === 'update'){
                $data=$this->getRequestData();
                try{
                    new Post('posts_interactions')->update($data['id'],['comments'=>$data['comments']]);
                    echo json_encode(['success'=>true]);
                    
                    return;
                }catch(PDOException $e){
                    throw $e;
                }

            }

            if($action === 'delete'){
                $id=$this->getRequestData();
                try{
                    new Post('posts_interactions')->delete($id['id']);
                    echo json_encode(['success'=>true]); 
                    return;
                }catch(PDOException $e){
                    throw $e;
                }
            }
        }
    }

    public function friends($case, $action=null){
        
        if(isset($case)){
            switch($case){
                case 'suggestions':{
                    if(isset($action) && $action){
                        $this->manageSuggestions($action); 
                        return;           
                    }else{
                        return 'Action required';
                    }
                }
                case 'get':{
                    $id=$action ? ($action==='me' ? $_SESSION['id'] : $action) : null;
                    if(!$id) throw new Exception('User required');
                    $friends=new User()->getFriends($id);
                    echo json_encode(['success'=>true, 'friends'=>$friends]);
                    return;
                }
                case 'invit': {
                    if(isset($action)){
                        $this->manageInvits($action);
                        return;
                    }

                }
                default:{
                    throw new Exception('Action required!');
                }
                // case 'accept':{
                //     $this->verifyRequestMethod('POST');
                //     if($this->verifyCSRFToken()===200){
                //         $data=$this->getRequestData();
                //         $result=Database::getDb()->prepare('SELECT * FROM friends WHERE (user_id= ? AND friend_id=?) OR (friend_id=? AND user_id=?)');
                //         $result->execute([$_SESSION['id'], $data['id'], $data['id'], $_SESSION['id']]);

                //         if($result){
                //             echo json_encode(['success'=>false,'message'=>'Vous êtes dejà amis avec cette personne.']);
                //             return;
                //         }

                //         Model::createEntry('friends',['user_id'=>$_SESSION['id'], 'friend_id'=>$data['id']]);
                    
                //     }
                // }
            }
        }
    }

    public function manageSuggestions($action){
        if(isset($action)){
            if($action === 'get'){
                $suggestions=new User()->getSuggestions();
                foreach($suggestions as $key=>$value){
                    $suggestions[$key]['profile_picture']= $suggestions[$key]['profile_picture'] ? (PICTURE_PATH . $suggestions[$key]['id'] .'/' . $suggestions[$key]['profile_picture']) : GENDER_PATH . $suggestions[$key]['gender'] .'.png';
                    
                    $suggestions[$key]['username']= $value['username'] ?? $value['firstname'] . ' ' . $value['lastname'];
                    unset($suggestions[$key]['gender'], $suggestions[$key]['firstname'], $suggestions['key']['lastname']);
                }
                echo json_encode(['success'=>true, 'data'=>$suggestions]);
                return;
            }

            if($action === 'add'){
                // $this->verifyRequestMethod();
                if($this->verifyCSRFToken() === 200){
                    $data=$this->getRequestData();
                    $result=new User()->manageSuggestion($data['id']);
                    if($result === 'created')
                    echo json_encode(['success'=>true, 'message'=>'Demande envoyée.']);
                    else if($result === 'accepted')
                    echo json_encode(['success'=>true, 'message'=> 'Vous êtes maintenant amis.']);
                    return;
                }

            }
        }       
    }

    public function getValidUserData($data){
        foreach($data as $key=>$value){
            $data[$key]['profile_picture']= $data[$key]['profile_picture'] ? (PICTURE_PATH . $data[$key]['id'] .'/' . $data[$key]['profile_picture']) : GENDER_PATH . $data[$key]['gender'] .'.png';
            
            $data[$key]['username']= $value['username'] ?? $value['firstname'] . ' ' . $value['lastname'];
            unset($data[$key]['gender'], $data[$key]['firstname'], $data['key']['lastname']);
        }
        return $data;
    }

    public function manageInvits($action){

        if(isset($action)){
            switch($action){
                case 'get&sent' :
                case 'get&received': {
                    $type = $action === 'get&sent' ? 'sent' : 'received';
                    $invits=new User()->getInvits($type);
                    $invits=$this->getValidUserData($invits);
                    echo json_encode(['success'=>true, 'data'=>$invits]);
                    return;
                } 
                case 'accept' :{
                    $this->verifyRequestMethod('POST');
                    $user=$this->getRequestData();
                    if($this->verifyCSRFToken() === 200){
                        new User()->manageInvits($user);
                        echo json_encode(['success'=>true]);
                    }
                    return;
                }
                default:{
                    throw new Exception('Action required for this method!');
                } 
            }
        }
    }
}
  
