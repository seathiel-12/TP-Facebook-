<?php 
 namespace App\Controllers;
    use App\Models\Database;
    use App\Models\User;
    use PDOException;
    use App\Controllers\Controller;
    use App\Models\Model;
    use DateTime;

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    use Dotenv\Dotenv;

    Dotenv::createImmutable(__DIR__.'/../../')->load();

    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
  class AuthController extends Controller{
        use Auth;
        use mailer;

    public function __construct($sessionInfo=null){
        if(is_array($sessionInfo)){
            $this->startSession($sessionInfo);
        }
    }

    public function forgotPassword($step){
        //api/{method}/{step}

        //step 1: findUser
        if(isset($step) && $step==='find'){
            $findwith=$this->getRequestData();
            
            if(!filter_var($findwith['email'],FILTER_VALIDATE_EMAIL)){
                echo json_encode(['success'=>false,'message'=>"Email invalide"]);
                return;
            }
            $userData= new User()->getRequestedUserData($findwith,['id','username', 'email', 'firstname', 'lastname', 'gender','profil_picture']);
            
            session_start();
            $this->generateCSRFToken();
            
            echo json_encode(
                [
                    'success'=>true,
                    'data'=> $userData,
                    'csrf_token'=>$_SESSION['csrf_token']
                ]);

            return;
        }

        // Step 2: send Code
        if(isset($step) && $step==='retrieveCode'){
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
                $this->logout();
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

                if(isset($_SESSION['connect']) && $_SESSION['connect'])
                unset($_SESSION['connect']);

                $user['fullname']=$user['firstname'].' '.$user['lastname'];
                $this->mailerSend($user['fullname'],'resetPassCode');

                $_SESSION['passCode_sent_time']=time();
                echo json_encode(['success'=>true, 'email'=>$user['email'], "csrf_token"=>$_SESSION['csrf_token']]);
                return;
            }
            echo json_encode('Méthode GET ou user non authentifié!');
            return;
        } 

        //Step 3: Verify Code
        if(isset($step) && $step==='codeVerify'){
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
                return;
            }
            echo json_encode(['success'=>false, 'message'=>'Une erreur esr survenue. Veuillez demander un nouveau code et rééssayer.']);
        }

        // Step 4: Reset Password
        if(isset($step) && $step==='reset'){
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
    }
    
    public function verifyOnline(){
        session_start();

        if(isset($_SESSION['passCode_sent_time'])){
            if(time() - $_SESSION['passCode_sent_time'] > PASSCODE_LIFETIME){
                $this->logout();
                return false;
            }
        }
    
        if(isset($_SESSION['connect']) && $_SESSION['connect'] && isset($_SESSION['id'])){
           $user = new User()->find(['id'=>$_SESSION['id']]);
            if(!$user || !$user['online']){
                $this->logout();
                return false;
            }
            $this->limitLogin();
            $this->generateCSRFToken();
            return true;
        }
        return false;
    }

    public function verifyEntries(array $data){
        $data=$this->getRequestData();
        try{
            $emailOrPhone=$this->verifyEmailOrPhone($data);

            $db=Database::getDb();
            $query="SELECT * FROM users WHERE $emailOrPhone=?";
            $result=$db->prepare($query);
            $result->execute([$data[$emailOrPhone]]);
            $result=$result->fetch();
            if(password_verify($data['password'],$result['password'])){
                $this->startSession($result);
                    
                echo json_encode(['success'=>true]);
                return;
            }
            echo json_encode(['success'=>false,'message'=>'Email/numéro ou mot de passe incorrect.']);

        }catch(PDOException $e){
            echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
            throw new PDOException ("Erreur d'authenfication: $e");
        }
    }

    private function limitLogin(){
        if(isset($_SESSION['attempt']) && isset($_SESSION['first_try_time'])){
            $delay=new DateTime(date('H:i:s'))->getTimestamp() - $_SESSION['first_try_time'];
            
            if($delay<=MAX_CONNECTION_ATTEMPT_TIME && $_SESSION['attempt']>MAX_CONNECTION_ATTEMPT){
                
                echo json_encode(['success'=>false, 'message'=>'Trop de tentatives de connection. Veuillez réessayer dans 5h.']);
                exit();
            }
        }
    }

    public function generateCSRFToken(){
        if(
            !isset($_SESSION['csrf_token']) || 
            (isset($_SESSION['csrf_token']) && 
            isset($_SESSION['token_lifetime']) && 
            time() - $_SESSION['token_set_time']>TOKEN_LIFETIME)
            )
        {
            $_SESSION['csrf_token']=bin2hex(random_bytes(32));
            $_SEssion['token_set_time']=time();    
        }
    }
        
 }