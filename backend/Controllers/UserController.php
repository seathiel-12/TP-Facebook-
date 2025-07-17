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
    private $known_as=['uuid_uID', 'uuid_pID', 'uuid_fID', 'uuid_pIID'];

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
                        'profile_picture'=>$_SESSION['profile_picture'],
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

    public function profiling($uuid_uID){
        if($uuid_uID === 'me') 
            $uuid_uID = $_SESSION['valid'];
        $profil=new User()->profiling($uuid_uID);
        $profil=$this->getValidUserData($profil);
        echo json_encode(['success'=>true, 'data'=>$profil]);
        return;
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
                    $friends=$this->getValidUserData($friends);
                    echo json_encode(['success'=>true, 'data'=>$friends]);
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
                $suggestions=$this->getValidUserData($suggestions);
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
            
            if(array_key_exists('profile_picture', $value)){
                $data[$key]['profile_picture']= $data[$key]['profile_picture'] ? (PICTURE_PATH . $data[$key]['id'] .'/' . $data[$key]['profile_picture']) : GENDER_PATH . $data[$key]['gender'] .'.png';   
            }
                   
            if(array_key_exists('username', $value)){
                $data[$key]['username'] = $value['username'] ?? $value['firstname'] . ' ' . $value['lastname'];
            }

            if(array_key_exists('uuid_uID', $value)){
                $data[$key]['valid']=$data[$key]['uuid_uID'];
            } 
            unset($data[$key]['gender'], $data[$key]['firstname'], $data[$key]['lastname'], $data[$key]['id'], $data[$key]['uuid_uID']);  
        }
        return $data;
    }

    private function getValidateDataToSend($data){
        if(array_keys($data, $this->known_as)){
            
        }
    }

    public function manageInvits($action){

        if(isset($action)){
            switch($action){
                case 'get&sent' :
                case 'get&received': {
                    $type = $action === 'get&sent' ? 'sent' : 'received';
                    $invits=new User()->getInvits($type);
                    $invits=$this->getValidUserData($invits);

                    foreach($invits as $key => $value){
                        if(isset($value['uuid_fID'])){
                            $invits[$key]['ID']=$invits[$key]['uuid_fID'];
                            unset($invits[$key]['uuid_fID']);
                        }
                    }
                    
                    echo json_encode(['success'=>true, 'data'=>$invits]);
                    return;
                } 
                case 'accept':
                case 'reject':
                case 'cancel':{
                    session_start();
                    $this->verifyRequestMethod('POST');
                    $data=$this->getRequestData();
                    if($this->verifyCSRFToken() === 200){
                        if($action === 'cancel'){
                            new User()->manageInvits($data['ID'], null, 'cancel');
                            echo json_encode(true);
                            return;
                        }

                        $response=new User()->manageInvits($data['ID'], $data['valid'], $action);

                        if($response ==='noUpdate'){
                            echo json_encode(['success'=>false]);
                        }else{
                            echo json_encode(['success'=>true]);
                        }                        
                    }
                    return;
                }default:{
                    throw new Exception('Action required for this method!');
                } 
            }
        }
    }
}
  
