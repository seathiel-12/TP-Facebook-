<?php 
namespace App\models;

use App\Models\Database;
use App\Models\Model;
use \Exception;
use PDOException;

class Discussion extends Model{
    private $table = 'messages';

    public function __construct($data=null){
        if(is_array($data)){  
           $data['receiver_id'] = new User()->getRequestedUserData(['uuid_uID'=>$data['receiver_id']], 'id');
           $data['uuid_mID'] = $this->generateUUID();
           Model::createEntry($this->table, $data);
        }
    }

    public function getAll(){
        session_start();
        try{
            $query="WITH classm AS (
                            SELECT 
                                CASE 
                                    WHEN sender_id = ? THEN receiver_id
                                    ELSE sender_id
                                END AS id_u,
                                sender_id,
                                content,
                                uuid_mID,
                                created_at,
                                is_read
                            FROM messages
                            WHERE sender_id = ? OR receiver_id = ?
                        ),
                        ranked AS (
                            SELECT *,
                                ROW_NUMBER() OVER (PARTITION BY id_u ORDER BY created_at DESC) AS rang
                            FROM classm 
                        ),
                        sender AS (
                            SELECT r.id_u, r.content, r.uuid_mID, r.is_read, r.created_at, r.rang, u.uuid_uID AS sender FROM ranked r JOIN users u ON
                            r.sender_id = u.id
                        )
                        SELECT 
                            r.sender,
                            r.is_read,
                            u.id AS id,
                            u.created_at,
                            u.online,
                            u.last_seen,
                            u.uuid_uID,
                            u.gender,
                            u.username,
                            u.firstname,
                            u.lastname,
                            u.profile_picture,
                            r.content AS content,
                            r.created_at AS last_message_date
                        FROM sender r
                        JOIN users u ON u.id = r.id_u
                        WHERE r.rang = 1;
                    ";

            $result=Database::getDb()->prepare($query);
            $result->execute(array_fill(0, 3, $_SESSION['id']));
            return $result->fetchAll();
        }catch(PDOException $e){
            throw $e;
        }
    }
    
    public function update(string $uuid, array $data)
    {
        $id=(Model::getEntry($this->table, ['uuid_mID'=>$uuid]))['id'];
        Model::updateEntry($this->table, $data, $id);
    }

    public function delete(string $uuid)
    {
        $id=(Model::getEntry($this->table, ['uuid_mID'=>$uuid]))['id'];
        Model::deleteEntry($this->table, $id);
    }

    public function find($condition){
        if(!is_array($condition) || sizeof($condition)>1){
            throw new Exception('An array with one key->value is required');
        }
        return Model::getEntry($this->table,$condition);
    }

    public function getMessage($with){
        try{
            $query=" WITH mess AS (
            SELECT sender_id, uuid_mID AS ID, content, created_at, (created_at != updated_at) AS is_edited FROM messages 
            WHERE sender_id = ? OR receiver_id = ?
            ) 
            SELECT u.uuid_uID AS valid, m.ID, m.content, m.created_at, m.is_edited  FROM users u JOIN mess m
            ON m.sender_id = u.id";
            $result=Database::getDb()->prepare($query);
            $result->execute(array_fill(0, 2, $_SESSION['id']));

            return $result->fetchAll();
        }catch(PDOException $e){
            throw $e;
        }
    }
    
}