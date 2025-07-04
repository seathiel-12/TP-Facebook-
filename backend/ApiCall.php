<?php
namespace App;
use App\Controllers\Controller;
use App\Controllers\AuthController;
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
            $data=new Controller()->cleanData($data);
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
                                if(isset($this->uri[4]) && $this->uri[4]==='mailVerify'){
                                      $data=$this->getRequestData();
                                      if(!filter_var($data['email'],FILTER_VALIDATE_EMAIL)){
                                        echo json_encode(['success'=>false,'message'=>'Email invalide']);
                                        return;
                                      }
                                      if(session_status() == PHP_SESSION_ACTIVE){                                        
                                        new AuthController()->logout();
                                      }
                                      session_set_cookie_params([
                                        'lifetime'=>time()+PASSCODE_LIFETIME+60,
                                        'secure'=>false,
                                        'httpOnly'=>true
                                    ]);
                                        session_start();
                                      $_SESSION['registerCode']=$this->generateMailerCode();
                                      $_SESSION['registerCode_sent_time']=time();
                                      new AuthController()->generateCSRFToken();
                                      $fullname=$data['fisrtname']. ' ' . $data['lastname'];
                                      new AuthController()->mailerSend($fullname,'register');
                                      echo json_encode(['success'=>true, 'data'=>$data,'csrf_token'=>$_SESSION['csrf_token'],'code'=>$_SESSION['registerCode']]);
                                    break;
                                }

                                if(isset($this->uri[4]) && $this->uri[4]==='codeVerify'){
                                    session_start();
                                    if(isset($_SESSION['registerCode_sent_time'])){  
                                        if(time() - $_SESSION['registerCode_sent_time'] > PASSCODE_LIFETIME){
                                            echo json_encode(['success'=>false, 'message'=>'Code expiré! Veuillez vous inscrire à nouveau.']);
                                            return;
                                        }    
                                    }else{
                                        echo json_encode(['success'=>false, 'message'=>'Veuillez demander un nouveau code et réessayer.']);
                                        return;
                                    }
                                    $data=$this->getRequestData();
                                    if($this->verifyCSRFToken()===200){
                                        if(isset($_SESSION['registerCode']) && $_SESSION['registerCode'] === $data['code']){
                                           
                                            new AuthController()->logout();
                                            unset($data['code'], $data['csrf_token']);

                                            new AuthController()->register($data);
                                            return;
                                        }else{
                                            new AuthController()->logout();
                                            echo json_encode(['succes'=>false, 'message'=>'Code invalide! Demandez un nouveau code et réessayer.']);

                                            return;
                                        }
                                    }else{
                                        echo json_encode(['success'=>false, 'message'=>'Alerte de securité! Veuillez vous reconnecter!']);

                                        new AuthController()->logout();
                                        
                                    }
                                    return;
                                }
                                
                                if(isset($this->uri[4]) && $this->uri[4]==='otherInfo'){

                                }
                            break;
                            }
                            //Route 'api/user/forgotPassword'
                            case 'forgotPassword':{
                                if(isset($this->uri[4]) && $this->uri[4]==='find'){
                                    $findwith=$this->getRequestData();
                                    
                                    if(!filter_var($findwith['email'],FILTER_VALIDATE_EMAIL)){
                                        echo json_encode(['success'=>false,'message'=>"Email invalide"]);
                                        return;
                                    }
                                    $userData= new User()->getRequestedUserData($findwith,['id','username', 'email', 'firstname', 'lastname', 'gender','profil_picture']);
                                    
                                    session_start();
                                    new AuthController()->generateCSRFToken();
                                    
                                    echo json_encode(
                                        [
                                            'success'=>true,
                                            'data'=> $userData,
                                            'csrf_token'=>$_SESSION['csrf_token']
                                        ]);
                                    break;
                                }

                                if(isset($this->uri[4]) && $this->uri[4]==='retrieveCode'){
                                    $user=$this->getRequestData();
                                    $userData= new User()->getRequestedUserData(["email"=>$user['email']],['id','username','firstname', 'lastname', 'gender','profil_picture']);
                                    
                                    foreach($userData as $key=>$data){
                                        if($userData[$key]!=$user[$key] || !filter_var($user['email'],FILTER_VALIDATE_EMAIL)){
                                            echo json_encode(['success'=>false, 'message'=>'Données utilisateur non valides!']);
                                            return;
                                        }
                                    }
                                    

                                    if(session_status() == PHP_SESSION_ACTIVE){
                                        $sessionTemp=$_SESSION;
                                        new AuthController()->logout();
                                    }
                                    session_set_cookie_params([
                                        'lifetime'=>time()+PASSCODE_LIFETIME+300,
                                        'secure'=>false,
                                        'httpOnly'=>true
                                    ]);

                                    session_start();
                                    $_SESSION=$sessionTemp;

                                    if($this->verifyCSRFToken()===200){
                                        $_SESSION['resetPassCode']=$this->generateMailerCode();
                                        $_SESSION['id']=$user['id'];
                                        $_SESSION['username']=$user['username']?$user['username']:($user['firstname'].' '.$user['lastname']);
                                        

                                        if($_SESSION['connect'])
                                        unset($_SESSION['connect']);

                                        $user['fullname']=$user['firstname'].' '.$user['lastname'];
                                        new AuthController()->mailerSend($user['fullname'],'resetPassCode');

                                        $_SESSION['passCode_sent_time']=time();
                                        echo json_encode(['success'=>true, 'email'=>$user['email'], "csrf_token"=>$_SESSION['csrf_token']]);
                                        break;    
                                    }
                                    echo json_encode('Méthode GET ou user non authentifié!');
                                    break;
                                } 

                                if(isset($this->uri[4]) && $this->uri[4]==='codeVerify'){
                                    session_start();
                                    if(!isset($_SESSION['passCode_sent_time'])){
                                        echo json_encode(['success'=>false, 'message'=>'Code expiré! Veuillez demander un nouveau code et réessayer!']);
                                         return;
                                    }
                                    if(time()-$_SESSION['passCode_sent_time'] > PASSCODE_LIFETIME){
                                        echo json_encode(['success'=>false, 'message'=>'Code expiré! Veuillez demander un nouveau code et réessayer!']);
                                        new AuthController()->logout();
                                        return;
                                    }
                                    $code=$this->getRequestData();
                                    $this->verifyCSRFToken();
                                    
                                    if(isset($_SESSION['resetPassCode'])){
                                        if($_SESSION['resetPassCode']===$code['code']){
                                            
                                            echo json_encode(['success'=>true, "fullname"=>$_SESSION['username'], "csrf_token"=>$_SESSION['csrf_token']]);
                                        }
                                        else {
                                            echo json_encode(['success'=>false, 'message'=>'Code non valide.']);
                                        }
                                        break;
                                    }
                                    echo json_encode(['success'=>false, 'message'=>'Une erreur esr survenue. Veuillez demander un nouveau code et rééssayer.']);
                                    break;
                                }

                                if(isset($this->uri[4]) && $this->uri[4]==='reset'){
                                    session_start();
                                    if(!isset($_SESSION['resetPassCode'])){
                                        echo json_encode(['success'=>false, 'message'=>'Timeout! Veuillez demander un nouveau code de reinitialisation.']);
                                        return;
                                    }
                                    $password=$this->getRequestData();
                                    if($this->verifyCSRFToken() === 200){
                                        new User()->update(['password'=>$password['newPassword']], $_SESSION['id']);
                                        unset($_SESSION['resetPassCode'], $_SESSION['passCode_sent_time']);
                                        new AuthController($_SESSION);
                                        echo json_encode(['success'=>true]);
                                    }
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

