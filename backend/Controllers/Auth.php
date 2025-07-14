<?php
namespace App\Controllers;
use \PDOException;
use \DateTime;
use App\Models\User;
require $_SERVER['DOCUMENT_ROOT'].'/headers.php';

trait Auth{
    public function verifyEmailOrPhone($data){
        $key=array_key_exists('email',$data)?'email':'phone';
            if($key==='email' && !filter_var($data['email'],FILTER_VALIDATE_EMAIL)){
                throw new PDOException('Email invalide');
            }else if($key==='phone' && !is_numeric(str_replace(' ','',$data['phone']))){
                throw new PDOException('Numéro invalide');
            }
            return $key;
    }

    public function logout(){
        session_start();
        session_unset();
        session_destroy();
        setcookie('PHPSESSID','', time()-3600);
    }

    public function startSession($sessionInfo){
        if(!isset($_SESSION['connect'])){
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
            try{
                $user=new User()->getRequestedUserData(['id'=>$_SESSION['id']],['cover_picture', 'profile_picture', 'gender']);

            }catch(PDOException $e){
                throw $e;
            }
            $_SESSION['profile_picture']= $user['profile_picture'] ? 'posts/user-' . $_SESSION['id'] . '/' .$user['profile_picture'] : 'images/' . $user['gender'] . '.png';
            $_SESSION['cover_picture']= 'posts/user-' . $_SESSION['id'] . '/' . $user['cover_picture'];

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

}