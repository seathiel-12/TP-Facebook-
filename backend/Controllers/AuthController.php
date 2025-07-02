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
use PHPMailer\PHPMailer\PHPMailer as PHPMailerPHPMailer;

    Dotenv::createImmutable(__DIR__.'/../../')->load();

    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
  class AuthController extends Controller{
        
    public function __construct(){
        
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
            if($delay<600 && $_SESSION['attempt']>5){
                die('Too much attempt');
            }
        }
    }

    public function generateCSRFToken(){
        if(isset($_SESSION['id'])){
            $_SESSION['csrf_token']=bin2hex(random_bytes(32));
        }
    }

    private function startSession($sessionInfo){
        if(session_status() == PHP_SESSION_ACTIVE && !isset($_SESSION['id'])){
            ini_set('session.cookie_httponly',1);
            session_set_cookie_params(
                [
                    'lifetime'=>time()+3600,
                    'httponly'=>true,
                    'secure'=>false,
                ]
            );        
            session_start();
            $_SESSION['id']=$sessionInfo['id'];
            $_SESSION['username']=$sessionInfo['username'];
            $_SESSION['attempt']=1;
            $_SESSION['first_try_time']=new DateTime(date('H:i:s'))->getTimestamp();
           
            $this->generateCSRFToken();
            return true;
        }
        session_regenerate_id(true);
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
    
    public function mailerSend(){

        try{
            $mail=new PHPMailer();
            $mail->isSMTP();
            $mail->Host=$_ENV['MAILER_HOST'];
            $mail->SMTPAuth=true;
            $mail->Username=$_ENV['MAILER_USERNAME'];
            $mail->Password=$_ENV['MAILER_PASSWORD'];
            $mail->SMTPSecure= 'tls';
            $mail->Port= $_ENV['MAILER_PORT'];

            $mail->setFrom($_ENV['MAILER_USERNAME'],'Clone Project');
            $mail->addAddress($_ENV['MAILER_ADMINISTRATOR'],'New Facebook User');
            
            $mail->Subject="Code de confirmation";
            $mail->Body="Merci de rejoindre Facebook Clone.";
            // $mail->SMTPDebug=4;
            // $mail->Debugoutput='html';
            // $mail->send();
            
            echo json_encode(['success'=>true]);
        }catch(Exception $e){
            echo json_encode(['message'=>$mail->ErrorInfo]);
        }
       
        
    }
    
 }