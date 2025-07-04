<?php
namespace App\Models;

use App\Models\Model;

class Security extends Model{
    
    private $table='security_log';

    public function __construct($data=null){
        if(!is_null($data) && is_array($data)){
            return Model::createEntry($this->table, $data);
        }
    }

}