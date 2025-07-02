<?php 
namespace App\Models;
use App\Models\Database;
use \PDOException;

require_once $_SERVER['DOCUMENT_ROOT'].'/headers.php';

class Manager extends Model{
    private $table='manager';

    
    public function __construct($data){
        return $this->createEntry($this->table, $data);
    } 

    public function getAll(){
        return $this->getAll($this->table);
    }

    public function update($data, $id){
        return $this->update($this->table, $data, $id);
    }

    public function delete($id){
        return $this->delete($this->table, $id);
    }    
}