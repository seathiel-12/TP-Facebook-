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
        
    public function __construct($sessionInfo=null){
        if(is_array($sessionInfo)){
            $this->startSession($sessionInfo);
        }
    }

    public function verifyOnline(){
        session_start();
        if(isset($_SESSION['connect']) && $_SESSION['connect']){
            $this->limitLogin();
            $this->generateCSRFToken();
            echo json_encode(true);
            return;
        }
        echo json_encode(false);
    }

    public function verifyEntries(array $data){
        try{
            $emailOrPhone=$this->verifyEmailOrPhone($data);
            $data=$this->cleanData($data);

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

    public function logout(){
        session_start();
        session_unset();
        session_destroy();
        setcookie('PHPSESSID','', time()-3600);
    }

    private function startSession($sessionInfo){
        if(session_status() == PHP_SESSION_ACTIVE && !isset($_SESSION['connect'])){
            
            $this->logout();
            ini_set('session.cookie_httponly',1);
            session_set_cookie_params(
                [
                    'lifetime'=>time()+SESSION_LIFETIME,
                    'httponly'=>true,
                    'secure'=>false,
                ]
            );        
            session_start();
            
            $_SESSION['id']=$sessionInfo['id'];
            $_SESSION['username']=$sessionInfo['username']?$sessionInfo['username']:($sessionInfo['firstname'].' '.$sessionInfo['lastname']);
            $_SESSION['attempt']=1;
            $_SESSION['connect']=true;
            $_SESSION['first_try_time']=new DateTime(date('H:i:s'))->getTimestamp();
           
            $this->generateCSRFToken();
            return true;
        }
        session_regenerate_id(true);
        session_start();
        $this->generateCSRFToken();
        $_SESSION['attempt']+=1;
        $this->limitLogin();
    }

    private function verifyEmailOrPhone($data){
        $key=array_key_exists('email',$data)?'email':'phone';
            if($key==='email' && !filter_var($data['email'],FILTER_VALIDATE_EMAIL)){
                throw new PDOException('Email invalide');
            }else if($key==='phone' && !is_numeric(str_replace(' ','',$data['phone']))){
                throw new PDOException('Numéro invalide');
            }
            return $key;
    }

    public function register($data){
        try{
            $data=$this->cleanData($data);
            if($this->verifyEmailOrPhone($data)){
                new User($data);

                $user=Model::getEntry('users', ['email'=>$data['email']]);
                $this->startSession($user);
                echo json_encode(['success'=>true]);
            }
        }catch(PDOException $e){
            echo json_encode(['success'=>false]);
            throw new PDOException("Erreur de création de compte: $e");
        }
    }
    
    public function mailerSend($fullname,$type){

            try{
                $mail=new PHPMailer();
                $mail->isSMTP();
                $mail->Host=$_ENV['MAILER_HOST'];
                $mail->SMTPAuth=true;
                $mail->Username=$_ENV['MAILER_USERNAME'];
                $mail->Password=$_ENV['MAILER_PASSWORD'];
                $mail->SMTPSecure= 'tls';
                $mail->Port= $_ENV['MAILER_PORT'];
    
                if(isset($_SESSION['resetPassCode']) && $type==="resetPassCode"){
                    $message="Plus qu'une étape avant de réinitialiser votre mot de passe. $fullname, Nous avons recu votre demande de réinitialisation de mot de passe. Saisissez le code suivant dans le champ requis sur le site pour effectuer la modification: <br> <br> <strong  style='background:rgb(77, 118, 255); width:max-content; border-radius:10px; padding:10px 15px; display:block; margin:auto;'>".$_SESSION['resetPassCode']."</strong>. <br><br>
                    <p>Vous n'avez pas demandé ce code? Signalez-ce mail.<p>";
                }else{
                    if(isset($_SESSION['registerCode']) && $type==="register")
                    $message="Bienvenue $fullname sur Facebook Clone. Validez votre e-mail avec le code suivant pour accéder à des fonctionnalités uniques et communiquer avec vos amis: <br><br> <strong style='background:rgb(77, 118, 255); width:max-content; border-radius:10px; padding:10px 15px; display:block; margin:auto;'>".$_SESSION['registerCode']."</strong>. <br><br>
                    Vous n'avez pas demandé ce code? Signalez-ce mail.";
                }
                $mail->setFrom($_ENV['MAILER_USERNAME'],'Facebook Clone');
                $mail->addAddress($_ENV['MAILER_ADMINISTRATOR'],'New Facebook User');
                
                $mail->isHTML();
                $mail->CharSet='UTF-8';
                $mail->Subject="Code de confirmation.";
                $mail->Body=$message;
                // $mail->SMTPDebug=4;
                // $mail->Debugoutput='html';
                // $mail->send();
            }catch(Exception $e){
                echo json_encode(['message'=>$mail->ErrorInfo]);
            }
             
    }
    
 }