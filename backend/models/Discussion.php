<?php 
namespace App\models;

use App\Models\Database;
use App\Models\Model;
use \Exception;
use PDOException;

class Discussion extends Model{
    private $table = 'messages';

    public function __contruct($data=null){
        if(is_array($data)){  
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
                                content,
                                uuid_mID,
                                created_at
                            FROM messages
                            WHERE sender_id = ? OR receiver_id = ?
                        ),
                        ranked AS (
                            SELECT *,
                                ROW_NUMBER() OVER (PARTITION BY id_u ORDER BY created_at DESC) AS rang
                            FROM classm
                        )
                        SELECT 
                            u.id AS id,
                            u.created_at,
                            u.uuid_uID,
                            u.username,
                            u.firstname,
                            u.lastname,
                            u.profile_picture,
                            r.content AS content,
                            r.created_at AS last_message_date
                        FROM ranked r
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
    
    public function update(int $id, array $data)
    {
        Model::updateEntry($this->table, $data, $id);
    }

    public function delete(int $id)
    {
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
            $query="SELECT content, created_at FROM messages WHERE sender_id = ? OR receiver_id = ?";
            $result=Database::getDb()->prepare($query);
            $result->execute(array_fill(0, 2, $_SESSION['id']));

            return $result->fetchAll();
        }catch(PDOException $e){
            throw $e;
        }
    }

}