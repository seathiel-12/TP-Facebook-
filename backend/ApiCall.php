<?php
namespace App;
use App\Controllers\Controller;
use App\Controllers\AuthController;
use App\Models\User;
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
        if(isset($_SESSION['csrf_token']) && !empty($_SESSION['csrf_token'])){
            if($this->method!=='GET'){
                $request=file_get_contents('php://input');
                $data=json_decode($request,true);
                if(!isset($data['csrf_token']) || $data['csrf_token']!== $_SESSION['csrf_token']){
                    echo json_encode(['success'=>false, 'message'=>'CSRF token not valid']);
                    return;
                }
            }
            echo json_encode(['success'=>true]);
            return;
        }
        echo json_encode(['success'=>false, 'message'=>'CSRF token not found']);
        return;
    }

    private function getRequestData(){
        if($this->method!=='GET'){
            $data=json_decode(file_get_contents('php://input'),true);
            $data=new Controller()->cleanData($data);
            return $data;
        }else{
            echo json_encode('Pas de donnée à récupérer via la methode GET.');
        }
    }

    private function generateMailerCode(){
        $letter="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $nbrDigit=rand(5,7);
        $code="";
        for($i=0; $i<$nbrDigit; $i++){
            $code.=$letter[$i];
        }
        session_start();
        session_unset();
        session_destroy();
        if(isset($_COOKIE['PHPSESSID']))
        setcookie('PHPSESSID','', time()-3600);

        session_start();
        $_SESSION['resetPassCode']=password_hash($code,PASSWORD_ARGON2I);
    }

    public function requestTreatment(){
//Route 'api/{action}'
       if(isset($this->method) && isset($this->uri)){

            try{
                switch($this->uri[2]){
                    //Route 'api/user/{case}'
                    case 'user':{

                        switch($this->uri[3]){
                            //Route 'api/user/forgotPassword'
                            case 'forgotPassword':{
                                if(isset($this->uri[4]) && $this->uri[4]==='find'){
                                    $findwith=$this->getRequestData();
                                    $userData= new User()->getRequestedUserData($findwith,['username', 'firstname', 'lastname', 'gender','profil_picture']);
                                    
                                    echo json_encode(
                                        [
                                            'success'=>true,
                                            'data'=> $userData
                                        ]);
                                    return;
                                }

                                if(isset($this->uri[4]) && $this->uri[4]==='retrieveCode'){
                                    $this->generateMailerCode();
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
                    case 'register':{
                            $data=json_decode(file_get_contents('php://input'),true);
                            new AuthController()->register($data);
                        break;
                    }
                    case 'verifyToken':{
                        $this->verifyCSRFToken();
                        break;
                    }
                    case 'generateCSRF':{
                        try{
                            new AuthController()->generateCSRFToken();
                            echo json_encode(
                                [
                                    'success'=>true,
                                    'token'=> $_SESSION['csrf_token']??null
                                ]
                                );
                        }catch(PDOException $e){
                            echo json_encode(['success'=>false]);
                        }
                        break;
                    }
                    case 'mailVerify':{
                        $data=json_decode(file_get_contents('php://input'),true);
                        new AuthController()->mailerSend($data['email']);
                        break;
                    }

                }
            }catch(PDOException $e){
                throw new PDOException("Erreur lors de l'execution de la requête!:".$e->getMessage());
            }

       }else{
         
       }
    }
}

