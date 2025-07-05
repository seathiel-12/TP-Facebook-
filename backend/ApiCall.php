<?php
namespace App;
use App\Controllers\Controller;
use App\Controllers\AuthController;
use App\Controllers\Register;
use App\Models\User;
use Exception;
use \PDOException;
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
    

    private function verifyCSRFToken(){
        session_start();
        if(isset($_SESSION['csrf_token']) && !empty($_SESSION['csrf_token'])){
            if($this->method!=='GET'){
                $request=file_get_contents('php://input');
                 $data=json_decode($request,true);
                if(isset($data['csrf_token'])){
                    if($data['csrf_token']===$_SESSION['csrf_token']){
                        return 200;
                    }
                    session_start();
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

    public function requestTreatment(){
    //Route 'api/{action}'
        
       if(isset($this->method) && isset($this->uri)){
        
            try{
                switch($this->uri[2]){
                    //Route 'api/user/{case}'
                    case 'user':{

                        switch($this->uri[3]){
                            //Route 'api/user/register'
                            case 'register':{
                                new Register()->{$this->uri};
                            break;
                            }
                            //Route 'api/user/forgotPassword'
                            case 'forgotPassword':{
                                if(isset($this->uri[4])){
                                    new AuthController()->forgotPassword($this->uri);
                                }else{
                                    throw new Exception();
                                }
                                break;
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
                        new AuthController()->verifyOnline();
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

