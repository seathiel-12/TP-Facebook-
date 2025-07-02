<?php 
namespace App\Models;
use App\Models\Database;
use \PDOException;
use \PDO;

require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';

class Model{
    private static $db;

    public static function getAllData($table){
      
        try{
            self::$db=Database::getDb();
            $result=self::$db->query("SELECT * FROM $table");
            $result=$result->fetchAll();
            return $result;
        }catch(PDOException $e){
            throw new PDOException ("Erreur lors de la récupération des données de la table $table: ".$e->getMessage()); 
        }
    }

     public static function createEntry(string $table, $data){
        $keys=implode(',', array_keys($data));
        $values=implode(',', array_fill(0, count($data), '?'));
        try{
            if($table==='users') {
                $data['password']=password_hash($data['password'], PASSWORD_DEFAULT);
            }
            $query="INSERT INTO $table ($keys) VALUES ($values)";
            self::$db=Database::getDb();
            $result=self::$db->prepare($query);
            $result->execute(array_values($data));
            $result=$result->rowCount();
            return $result;
        }catch(PDOException $e){
            throw new PDOException("Erreur lors de la création du champ dans la table $table: ".$e->getMessage());
        }
    }

     public static function updateEntry(string $table, array $data, int $id){
        try{
            $keys=implode('=?,', array_keys($data));
            $keys.= count($data)>=1 ? '=? ':'';
            self::$db=Database::getDb();
            if($table==='users') {
                $data['password']=password_hash($data['password'], PASSWORD_DEFAULT);
            }
            $query="UPDATE $table SET $keys WHERE id=?";
            $result=self::$db->prepare($query);
            $data['id']=$id;
            $result->execute(array_values($data));
            return $result->rowCount();

        }catch(PDOException $e){
            throw new PDOException("Erreur lors de la mise à jour du champ dans la table $table: ".$e->getMessage());
        }
    }

    public static function deleteEntry ($table, $id){
        try{
            $query="DELETE FROM $table WHERE id=?";
            self::$db=Database::getDb();
            $result=self::$db->prepare($query);
            $result->execute([$id]);
            return $result->rowCount();
        }catch(PDOException $e){
            throw new PDOException("Erreur lors de la suppression du champ dans la table $table: ". $e->getMessage());
        }
    }

    public static function getEntry(string $table, array $condition){
        try{
            $binding=array_keys($condition)[0].'=?';
            $db=Database::getDb();
            $query="SELECT * FROM $table WHERE $binding";
            $result=$db->prepare($query);
            $result->execute(array_values($condition));
            return $result->rowCount() > 0 ? $result->fetch() : false;
        }catch(PDOException $e){
            throw new PDOException("Erreur lors de la récupération de la donnée: $e");
        }
    }
}

