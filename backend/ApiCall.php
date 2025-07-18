<?php
namespace App;
use App\Controllers\Controller;
use App\Controllers\AuthController;
use App\Controllers\DiscussionController;
use App\Controllers\Register;
use App\Controllers\UserController;
use App\models\Discussion;
use App\Models\Model;
use App\Models\Post;
use App\Models\User;
use Exception;
use \PDOException;
use PDORow;

  require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
//   header('Content-Type: application/json');
class ApiCall{
    private $method;
    private $uri;

    public function __construct(){
       $this->method = $_SERVER['REQUEST_METHOD'];
       $action=str_replace('backend/api/','',$_SERVER['REQUEST_URI']);
       $this->uri= explode('/',$action);
    }
    

    private function verifyCSRFToken($array=null){
        session_start();
        if(isset($_SESSION['csrf_token']) && !empty($_SESSION['csrf_token'])){
            if($this->method!=='GET'){

                $data=null;

                if(!$array){

                    $request=file_get_contents('php://input');
                    $data=json_decode($request,true);

                }else $data=$array;

                    if(isset($data['csrf_token'])){
                    if($data['csrf_token'] === $_SESSION['csrf_token']){
                        return 200;
                    }
                    session_unset();
                    session_destroy();
                    if(isset($_COOKIE['PHPSESSID']))
                     setcookie('PHPSESSID','', time()-3600);
                    throw new \Exception("Alerte de securité! Tentative d'envoi de données frauduleuses.");
                }
            }
            return 'Méthode GET!';
        }
        return 400;
    }

    public function verifyRequestMethod($method){
        if($this->method !== $method){
            echo json_encode(['success'=>false,'message'=>'Methode non autorisée!'], 405);
            throw new PDOException("Méthode $method non autorisée pour cette requete!");
        }
     }

    private function getRequestData(){
        if($this->method!=='GET'){
            $data=json_decode(file_get_contents('php://input'),true);
            return $data;
        }else{
            echo json_encode('Pas de donnée à récupérer via la methode GET.');
            return;
        }
    }

    private function generateMailerCode(){
        $letter="ABC3DE0FGHIJ1KLM2NO9PQR7S4T8UVWXYZ56";
        $code="";
        for($i=0; $i<6; $i++){
            $code.=$letter[rand(0,35)];
        }
       return $code; 
    }


    private function debug($data){
        echo '<pre>';
        print_r($data);
        echo '</pre>';
    }

    private function isOnline(){

    }
    public function requestTreatment(){
    //Route 'api/{action}'
        
       if(isset($this->method) && isset($this->uri)){
        
            try{
                switch($this->uri[2]){
                    //Route 'api/user/{case}'
                    case 'user':{
                        if(isset($this->uri[3])){
                            
                            if($this->uri[3] === 'register'){
                                if(isset($this->uri[4])){
                                    new Register()->registering($this->uri[4]);
                                    return;
                                }
                            }

                            if($this->uri[3] === 'forgotPassword'){
                                if(isset($this->uri[4])){
                                    new AuthController()->forgotPassword($this->uri[4]);
                                }else{
                                    throw new PDOException('Step required!');
                                }
                                return;
                            }

                            if($this->uri[3] === 'friends'){
                                if(!new AuthController()->verifyOnline()){
                                    throw new PDOException('Non autorisé! Veuillez vous authentifier.',401);
                                }

                                if(isset($this->uri[4]) && isset($this->uri[5])){
                                    new UserController()->friends($this->uri[4], $this->uri[5]);
                                }
                                return;
                            }

                            if($this->uri[3] === 'profiling'){
                                if(!new AuthController()->verifyOnline()){
                                    throw new PDOException('Non autorisé! Veuillez vous authentifier.',401);
                                }

                                if(isset($this->uri[4])){
                                    new UserController()->profiling($this->uri[4]);
                                    return;
                                }
                            }

                            if($this->uri[3] === 'posts'){
                                if(!new AuthController()->verifyOnline()){
                                    throw new PDOException('Non autorisé! Veuillez vous authentifier.',401);
                                }

                                if(isset($this->uri[4])){
                                    $user=new UserController();
                                    switch($this->uri[4]){
                                        case 'create':{
                                            $this->verifyRequestMethod('POST');
                                            $data=$_POST ?? null;
                                            if($this->verifyCSRFToken($data) === 200){
                                                $user->createPost();
                                            }else{
                                                throw new Exception('CSRF not found.');
                                            }
                                            break;
                                        }                                      
                                        case 'update':{
                                            $user->updatePost();
                                            break;
                                        }                                            
                                        case 'delete':{
                                            session_start();
                                            $this->verifyRequestMethod('POST');
                                            $data=$this->getRequestData();
                                            $user->deletePost($data['id']);
                                            break;
                                        }                                   
                                        case 'all':{
                                            try{
                                                $data = new Post()->getAllPosts('LIMIT 50');
                                                echo json_encode(['success'=>true, 'data'=>$data]);
                                                return;
                                            }catch(PDOException $e){
                                                throw new PDOException('Erreur lors de la récupération des posts: ',$e->getMessage());
                                            }
                                            break;
                                        }
                                        case 'comment':{
                                            $this->verifyRequestMethod('POST');
                                            if(isset($this->uri[5])){
                                                $user->comment($this->uri[5]);
                                                return;
                                            }
                                            break;
                                        }
                                        case 'get':{
                                            if(isset($this->uri[5]) && !is_null($this->uri[5])){
                                                try{
                                                    $posts = new Post()->getAllPosts(user: $this->uri[5]);
                                                    echo json_encode(['success'=>true, 'data'=>$posts]);
                                                    return;
                                                }catch(PDOException $e){
                                                    throw $e;
                                                }
                                            }else{
                                                throw new Exception('User required!');
                                            }
                                        }
                                        default:{
                                            // Route api/user/posts/{id}/{action}
                                            if(is_numeric($this->uri[4])){  
                                                if(isset($this->uri[5])){
                                                    if($this->uri[5] === 'comments'){
                                                        $comments=new Post('posts_interactions')->getThisPostComments($this->uri[4]);
                                                        echo json_encode(['success'=>true, 'data'=>$comments]);
                                                        return;
                                                    }
                                                    $this->verifyRequestMethod('POST');
                                                    $data = $_POST ?? null;
                                                    if($this->verifyCSRFToken($data) !== 200){
                                                        echo json_encode(['success'=>false, 'message'=>"CSRF non trouvé/valide!"]);
                                                        return;
                                                    }
                                                    $user->posts($this->uri[5], $this->uri[4]);
                                                    return;                                                      
                                                }else{
                                                    throw new Exception('Méthode required');
                                                }

                                            }else{
                                                throw new Exception('id required');
                                            }
                                            break;
                                        }
                                        
                                    }                                    
                                }else{
                                    throw new Exception('uri 4');
                                }

                               return;
                            }
                        }
                        break;
                    }
                    case 'discussions':{
                        if(isset($this->uri[3])){
                            if($this->uri[3] === 'get'){
                                if(!new AuthController()->verifyOnline()){
                                    throw new PDOException('Non autorisé! Veuillez vous authentifier.',401);
                                }
    
                                new DiscussionController()->getAll();
                                return;
                            }
    
                            if($this->uri[3] === 'messages'){
                                if(!new AuthController()->verifyOnline()){
                                    throw new PDOException('Non autorisé! Veuillez vous authentifier.',401);
                                }
    
                                if($this->uri[4] === 'get'){
                                    if(isset($this->uri[5])){
                                        new DiscussionController()->getMessage($this->uri[5]);
                                    }
                                }
                                if($this->uri[4] === 'send'){
                                    $this->verifyRequestMethod('POST');
                                    if($this->verifyCSRFToken() === 200){
                                        $data=$this->getRequestData();
                                        new DiscussionController()->manageMessages($data, $this->uri[4]);
                                        return;
                                    }
                                    echo json_encode(['success'=>false]);
                                }
                            }
                        }
                       break;
                    }
                    case 'login':{
                        $data=json_decode(file_get_contents('php://input'),true);
                         new AuthController()->verifyEntries($data);
                         
                        break;
                    }
                    case 'isOnline':{
                        if(new AuthController()->verifyOnline()){
                            echo json_encode(true);
                            return;
                        }
                        echo json_encode(false);
                        break;
                    }
                    case 'verifyToken':{
                        $verify=$this->verifyCSRFToken();
                       if($verify===200){
                         echo json_encode(['success'=>true]);
                         break;
                       }
                        echo json_encode(['success'=>false, 'message'=>'Utilisateur non authentifié.']);
                        break;
                    }
                    case 'generateCSRF':{
                        try{
                            new AuthController()->generateCSRFToken();
                            echo json_encode(
                                [
                                    'success'=>true,
                                    'token'=> $_SESSION['csrf_token']??null
                                ]);
                        }catch(PDOException $e){
                            echo json_encode(['success'=>false]);
                        }
                        break;
                    }
                    default :{
                        // new Fallback();
                        echo 'Code 400: Ressource not found.';
                    }
                }
            }catch(PDOException $e){
                throw new PDOException("Erreur lors de l'execution de la requête!:".$e->getMessage());
            }

       }else{
          echo 'Access denied';
       }
    }
}

