<?php 
namespace App\Controllers;

    use App\Controllers\Controller;
    use App\Models\User;
    use \PDOException;
    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';    
    class Register extends Controller{
        use mailer;
        use Auth;

        public function mailVerify(){
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

                $this->mailerSend($fullname,'register');
                
                echo json_encode(['success'=>true, 'data'=>$data,'csrf_token'=>$_SESSION['csrf_token'],'code'=>$_SESSION['registerCode']]);
          }
        }

        public function codeVerify(){
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
                       
                        $this->logout();
                        unset($data['code'], $data['csrf_token']);

                        $this->register($data);
                        return;
                    }else{
                        $this->logout();
                        echo json_encode(['succes'=>false, 'message'=>'Code invalide! Demandez un nouveau code et réessayer.']);

                        return;
                    }
                }else{
                    echo json_encode(['success'=>false, 'message'=>'Alerte de securité! Veuillez vous reconnecter!']);
                    $this->logout();  
                }
                return;
            }
        }

        public function register($data){
            try{
                $data=$this->cleanData($data);
                if($this->verifyEmailOrPhone($data)){
                    new User($data);
    
                    $user=new User()->find(['email'=>$data['email']]);
                    new AuthController()->startSession($user);
                    echo json_encode(['success'=>true]);
                }
            }catch(PDOException $e){
                echo json_encode(['success'=>false]);
                throw new PDOException("Erreur de création de compte: $e");
            }
        }

        private function otherInfo(){
            if(isset($this->uri[4]) && $this->uri[4]==='otherInfo'){

            }
        }

    }