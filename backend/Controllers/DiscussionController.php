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

            echo json_encode(['success'=>true, 'data'=>$message, 'infos'=>[
                'created_at'=>$user['created_at'],
                'online'=>$user['online'],
                'last_seen'=>$user['last_seen']
                ]]);
            return;
        }

        public function manageMessages($data, $action){
            $this->verifyRequestMethod('POST');
            if($this->verifyCSRFToken() !== 200){
                echo json_encode(['success'=>false, 'message'=>'CSRF problem']);
                return;
            }
            $data=$this->getRequestData();
            unset($data['csrf_token']);

            if(!$data){
                throw new Exception('Content needed');
            }

            switch($action){
                case 'send':{
                        try{
                            new Discussion($data);
                            echo json_encode(['success'=>true]);
                            return;
                        }catch(PDOException $e){
                            throw $e;
                        }     
                        return;
                    echo json_encode(['success'=>false]);
                    break;           
                }
                case 'update':{
                    try{
                        new Discussion()->update($data['valid'], ['content'=>$data['content']]);
                        echo json_encode(['success'=>true]);
                        return;
                    }catch(PDOException $e){
                        throw $e;
                    }
                    break;
                }
                case 'delete':{
                    try{
                        new Discussion()->delete($data['valid']);
                        echo json_encode(['success'=>true]);
                        return;
                    }catch(PDOException $e){
                        throw $e;
                    }
                    break;
                }
            }
        }
        
    }