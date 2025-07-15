<?php
    namespace  App\Controllers;

use PDOException;

    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
    class Controller {

        private $method;
        protected $uri;

        public function __contruct(){

        }

       protected function cleanData($data){
            if(is_array($data)){
                foreach($data as $key => $value){
                    if($key!=='csrf_token'){
                        $data[$key]=htmlspecialchars($value,ENT_QUOTES,'UTF-8');
                    }
                }
                return $data;
            } 
            return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');   
       }

       protected function getRequestData(){
        if($this->method!=='GET'){
            $data=json_decode(file_get_contents('php://input'),true);
            $data=$this->cleanData($data);
            return $data;
        }else{
            echo json_encode('Pas de donnée à récupérer via la methode GET.');
            return;
        }
      }

      protected function verifyCSRFToken($array=null){
        session_start();
        if(isset($_SESSION['csrf_token']) && !empty($_SESSION['csrf_token'])){
            if($this->method!=='GET'){

                $data=null;

                if(!$array){

                    $request=file_get_contents('php://input');
                    $data=json_decode($request,true);

                }else $data=$array;

                    if(isset($data['csrf_token'])){
                    if($data['csrf_token'] === $_SESSION['csrf_token']){
                        return 200;
                    }
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

     public function verifyRequestMethod($method){
        if($_SERVER['REQUEST_METHOD'] !== $method){
            echo json_encode(['success'=>false,'message'=>'Methode non autorisée!'], 405);
            throw new PDOException("Méthode $method non autorisée pour cette requete!");
        }
     }

     protected function debug($data){
        echo '<pre>';
        print_r($data);
        echo '</pre>';
    }
}