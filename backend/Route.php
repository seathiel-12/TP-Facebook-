<?php

namespace App\Routes;


class Route{
    
    private $url;
    private $httpMethod;

    public function __construct()
    {
        $this->httpMethod = $_SERVER['REQUEST_METHOD'];
        $action=str_replace('backend/api/','',$_SERVER['REQUEST_URI']);
        $this->url= explode('/',$action);
    }

    public function forwards(){
        $correspond=[
            'user'=>
            [
                'auth'=>['AuthController','verifyEntries'],
                'verifyOnline'=>['AuthController','verifyOnline'],
                'register'=>['Register','register'],
            ]
        ];

        if(isset($this->htppMethod) && $this->httpMethod === 'GET'){
            
        }else{
            $this->post();
        }
    }

    public function get($uri){
        //api/role/{method}/{action}
        
    }

    public function post(){

    }
}