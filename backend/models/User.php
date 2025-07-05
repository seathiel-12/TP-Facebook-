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
            return $requestedData;
        }
    }   
}