<?php
namespace App\Models;
require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';

use Dotenv\Dotenv;
use PDOException;

$dotenv = Dotenv::createImmutable(__DIR__.'/../../');
$dotenv->load();

class Database{
    private static $db;
    private static $dsn;

    public static function getDb(){
        if(is_null(self::$db)){
            self::$dsn="mysql:host=".$_ENV['APP_HOST'].";dbname=".$_ENV['APP_DBNAME'].";port=".$_ENV['APP_PORT'].";charset=utf8;";
        try{
            self::$db=new \PDO(self::$dsn, $_ENV['APP_USER'], $_ENV['APP_PASSWORD']);
            self::$db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            self::$db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);

            if(self::$db){
                try{
                    self::$db->query("SET sql_mode = 'STRICT_TRANS_TABLES'");
                }catch(PDOException $e){
                    throw new PDOException($e->getMessage());
                }
            }
            return self::$db;
        }catch(\PDOException $e){
            echo "Erreur de connexion à la base de données: ".$e->getMessage();
        }
      }
      try{
        self::$db->query("SET sql_mode = 'STRICT_TRANS_TABLES'");
    }catch(PDOException $e){
        throw new PDOException($e->getMessage());
    }
       return self::$db;
  }
}

