<?php
namespace App\Models;
use App\Models\Database;
use App\Models\Model;
use PDOException;
use \Exception;

require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';

class User extends Model{
    private $table='users';
    
    public function __construct($data=null){
        if(!is_null($data) && is_array($data)){
            $data['uuid_uID']=$this->generateUUID();
            return Model::createEntry($this->table, $data);
        }
    } 

    public function getAll(){
        return Model::getAllData($this->table);
    }

    public function update($data, $id){
        return Model::updateEntry($this->table, $data, $id);
    }

    public function delete($id){
        return Model::deleteEntry($this->table, $id);
    }

    public function find($condition){
        if(!is_array($condition) || sizeof($condition)>1){
            throw new Exception('An array with one key->value is required');
        }
        return Model::getEntry($this->table,$condition);
    }

    public function getRequestedUserData(array $condition, $attributes=null){
        $user=$this->find($condition);
        if(!is_array($user)){
            throw new Exception('Utilisateur introuvable.');
        }
        if(is_array($attributes)){
            foreach($attributes as $attribute){
                $requestedData[$attribute]=$user[$attribute];
            }
        }
        if(is_string($attributes)){
            $requestedData=$user[$attributes];
        }
        return $requestedData;
    }   

    public function profiling($uuid_uID){
        try{
            $user= $this->getRequestedUserData(['uuid_uID'=>$uuid_uID], [
                'username',
                'id',
                'uuid_uID',
                'firstname', 
                'lastname', 
                'bio',
                'gender', 
                'created_at', 
                'profile_picture', 
                'cover_picture',
                'lives_at',
                'date_of_birth',
                'study_level',
                'about']);
            
                $query="SELECT * FROM friends_requests WHERE status='accepted' AND ((requester_id=? AND receiver_id=?) OR (requester_id=? AND receiver_id=?))";

                $isFriend=Database::getDb()->prepare($query);
                $isFriend->execute([$_SESSION['id'], $user['id'], $user['id'], $_SESSION['id']]);

            $user['isFriend']= $isFriend->rowCount() > 0;
            $friends = $this->getFriends($user['id']);
            $posts = new Post()->getAllPosts('LIMIT 20', $user['id']);
            return [
                'user'=>$user,
                'friends'=>$friends,
                'posts'=>$posts
            ];
        }catch(PDOException $e){
            throw $e;
        }
        
    }

    public function getFriends($id){
        session_start();
        try{
            $query="WITH friends_r AS (
                SELECT * FROM friends_requests 
                WHERE (requester_id = ? OR receiver_id = ?) AND status = 'accepted'
                ),
                friends AS (
                    SELECT 
                        CASE 
                        WHEN requester_id = ? THEN receiver_id
                        ELSE requester_id 
                        END AS id 
                        FROM friends_r
                        )
                SELECT u.firstname, u.firstname, u.username, u.lastname, u.profile_picture, u.gender
                FROM users u
                JOIN friends f ON f.id = u.id;
                ";
            $result=Database::getDb()->prepare($query);
            $result->execute(array_fill(0, 3 , $id));
            $result=$result->fetchAll();
            return $result;
        }catch(PDOException $e){
            throw $e;
        }
    }

    public function getSuggestions(){
        try{    
        $query="SELECT id, uuid_uID, firstname, lastname, username, profile_picture, gender FROM users WHERE id!=?
                    AND (id NOT IN(
                        SELECT receiver_id FROM friends_requests WHERE requester_id = ? AND status != 'rejected'
                    )
                    AND id NOT IN (
                        SELECT requester_id FROM friends_requests WHERE receiver_id = ? AND (status = 'accepted' OR status='rejected' AND DATEDIFF(NOW() , updated_at) < 30) 
                    )
                ) LIMIT 50" ;
        $result=Database::getDb()->prepare($query);
        $result->execute(array_fill(0,3,$_SESSION['id']));
        
        if($result->rowCount() > 0){
            if(rand(0, 1) === 1){
                $result=$result->fetchAll();
                shuffle($result);
                $result=array_slice($result,(count($result)/2),10);   
                return $result;
            }
            return $result->fetchAll();
        }
        return false;
    }catch(PDOException $e){
            throw $e;
        }
    }

    public function manageSuggestion($data){
        try {
            $user=$this->getRequestedUserData(['uuid_uID'=>$data], 'id');
            $query="SELECT * FROM friends_requests WHERE requester_id = ? AND receiver_id = ?";
            $result=Database::getDb()->prepare($query);
            $result->execute([$user, $_SESSION['id']]);
            $result=$result->fetch();

            if(!$result){
                try{
                Model::createEntry('friends_requests', [
                    'requester_id' => $_SESSION['id'],
                    'receiver_id' => $user,
                    'status' => 'pending',
                    'uuid_fID'=>$this->generateUUID()
                ]);
                return 'created' ;
            }catch(PDOException $e){
                throw $e;
            }
            }else{
                try{
                    Model::updateEntry('friends_requests', ['status'=>'accepted'], $result['id']);
                    return 'accepted';
                }catch(PDOException $e){
                    throw $e;
                }
            }
       } catch (PDOException $e) {
            throw $e;
        }
    }


    public function getInvits($type){
        try{
            $tab=[
                'sent'=> ['receiver_id', 'requester_id'],
                'received'=> ['requester_id', 'receiver_id']
            ];

            $query = sprintf(
                "WITH sent AS ( 
                SELECT %s, uuid_fID FROM friends_requests WHERE %s=? AND status='pending')
                SELECT s.uuid_fID, u.uuid_uID, u.username, u.profile_picture, u.gender, u.firstname, u.lastname FROM users u JOIN sent s ON %s=u.id;
                ", $tab[$type][0],  $tab[$type][1], $tab[$type][0]
            );
            $result = Database::getDb()->prepare($query);
            $result->execute([$_SESSION['id']]);
            $result=$result->fetchAll();
            return $result;
        }catch(PDOException $e){
            throw $e;
        }
    }

    public function manageInvits($uuid, $requester=null, $type){
        try{

            if($type === 'accept'){
                $user=$this->getRequestedUserData(['uuid_uID'=> $requester], 'id');
                $query="SELECT * FROM friends_requests WHERE ((requester_id = ? AND receiver_id = ?) OR (receiver_id = ? AND requester_id = ?)) AND status = 'accepted' ";
                $result=Database::getDb()->prepare($query);
                $result->execute([$user, $_SESSION['id'], $user, $_SESSION['id']]);
                if($result->rowCount()){
                    return 'noUpdate';
                }else{
                    $entry=Model::getEntry('friends_requests', ['uuid_fID'=>$uuid]);
                    Model::updateEntry('friends_requests', ['status'=>'accepted'], $entry['id']);
                    return 'created';
                }
            }elseif($type === 'reject'){
                $entry=Model::getEntry('friends_requests', ['uuid_fID'=>$uuid]);
                Model::updateEntry('friends_requests', ['status'=>'rejected'], $entry['id']);
                return true;
            }else if($type === 'cancel'){
                $entry=Model::getEntry('friends_requests', ['uuid_fID'=>$uuid]);
                Model::deleteEntry('friends_requests', $entry['id']);
                return true;
            }
        }catch(PDOException $e){
            throw $e;
        }
    }
}