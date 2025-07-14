<?php 
namespace App\Controllers;

    use App\Controllers\Controller;
use App\Models\Model;
use App\Models\User;
use GrahamCampbell\ResultType\Success;
use \PDOException;
    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';    
    class Register extends Controller{
        use mailer;
        use Auth;

        public function registering($step){

            try{
                // Step 1: Mail verify by sending coding
                if(isset($step) && $step==='mailVerify'){
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
                    
                    echo json_encode(['success'=>true, 'data'=>$data,'csrf_token'=>$_SESSION['csrf_token'], $_SESSION['registerCode']]);
              }

              //Step 2: code verify

              if(isset($step) && $step==='codeVerify'){
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
                        echo json_encode(['success'=>true,'csrf_token'=>$_SESSION['csrf_token']]);
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

            if(isset($step) && $step === 'select-data'){
                if(!isset($_SESSION['id']) || !isset($_SESSION['connect']) || !$_SESSION['connect']){

                    echo json_encode(['success'=>false, "message"=>"Accès non autorisé au formulaire!"]);

                    return; 
                }
                try{
                    $data['professions'] = Model::getAllData('professions');
                    $data['country'] = Model::getAllData('country');    
                    echo json_encode(['success'=>true,'data'=>$data]);
                    return;
                }catch(PDOException $e){
                    throw $e;
                }

            }

            if(isset($step) && $step === 'otherInfo'){

                if(!isset($_SESSION['id']) || !isset($_SESSION['connect']) || !$_SESSION['connect']){

                    echo json_encode(['success'=>false, "message"=>"Accès non autorisé au formulaire!"]);

                    return; 
                }
                
                if($this->verifyCSRFToken($_POST) === 200){
                    if(isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] == UPLOAD_ERR_OK) $files['profile_picture']=$_FILES['profile_picture'];
                    if(isset($_FILES['cover_picture']) && $_FILES['cover_picture']['error'] == UPLOAD_ERR_OK) $files['cover_picture']=$_FILES['cover_picture'];

                    $response="";
                    if($files)
                    foreach($files as $key => $value){
                        $extensions=['jpg', 'png', 'jpeg', 'svg', 'gif','webp'];
                        $ext=pathinfo($value['name'], PATHINFO_EXTENSION);
                        if(!in_array(strtolower($ext), $extensions)){
                            $response['ext']="Fichier " . $value['name'] . " non supporté.\n";
                            unset($files[$key]);
                        }

                        if($value['size'] > MAX_IMG_SIZE){
                            $response['size'].="Fichier " . $value['name'] . " trop volumineux.\n";
                            unset($files[$key]);
                        }

                        if($files[$key]){
                            $directory=$_SERVER['DOCUMENT_ROOT']."/assets/media/posts/user-". $_SESSION['id'];
                            $path=$key.uniqid(more_entropy:true).'.'.$ext;
                            if(!is_dir($directory)){
                                mkdir($directory);
                            }

                            if(move_uploaded_file($value['tmp_name'], $directory.'/'.$path)){
                                $_POST[$key]=$path;
                            }
                        }
                    }
                    try{
                        unset($_POST['csrf_token']);
                        new User()->update($_POST, $_SESSION['id']);
                        $_SESSION['profile_picture']= $_POST['profile_picture'] ?? $_SESSION['profile_picture'];
                        $_SESSION['cover_picture'] =$_POST['cover_picture'] ?? $_SESSION['cover_picture'];
                        echo json_encode(['success'=>true, 'message'=>$response]);
                        return;
                    }catch(PDOException $e){
                        throw $e;
                    }
                    return;
                }

                echo json_encode(['success'=>false, 'message'=>'CSRF not found']);
            }

            }catch(PDOException $e){
                echo json_encode(['success'=>false]);
                throw $e;
            }
        }

        public function register($data){
            try {
                $data=$this->cleanData($data);
                if($this->verifyEmailOrPhone($data)){
                    new User($data);
    
                    $user=new User()->find(['email'=>$data['email']]);
                    $this->logout();
                    new AuthController()->startSession($user);
                    // echo json_encode(['success'=>true]);
                }
            } catch (PDOException $e) {
                throw $e;
            }
        }

        private function otherInfo(){
            
        }

    }