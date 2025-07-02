<?php
    namespace  App\Controllers;
    require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';
    class Controller {

        public function __contruct(){

        }

       public function cleanData($data){
            if(is_array($data)){
                foreach($data as $key => $value){
                    $data[$key]=htmlspecialchars($value,ENT_QUOTES,'UTF-8');
                }
                return $data;
            }
            return htmlspecialchars($data);
       }
    }