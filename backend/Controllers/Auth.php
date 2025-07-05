<?php
namespace App\Controllers;
use \PDOException;
use \DateTime;

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

}