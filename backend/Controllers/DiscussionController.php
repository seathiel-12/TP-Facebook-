<?php
namespace App\Controllers;
use App\Controllers\Controller;
use App\models\Discussion;
use App\Models\User;
use Exception;
use \PDOException;

    class DiscussionController extends Controller{

        public function __contruct()
        {
            
        }

        public function getAll($condition=null){
            try{
                $data = new Discussion()->getAll();
                $data=new UserController()->getValidUserData($data);
                echo json_encode(['success'=>true, 'data'=>$data]);
                return;
            }catch(PDOException $e){
                throw $e;
            }
        }

        public function getMessage($valid){
            $user=new User()->find(['uuid_uID'=>$valid]);
            if(!$user){
                throw new Exception('User not found!');
            }

            $message=new Discussion()->getMessage($user['id']);

            echo json_encode(['success'=>true, 'data'=>$message]);
            return;
        }
        
    }