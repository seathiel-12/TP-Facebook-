<?php
namespace App\Models;
use App\Models\Model;
    class Post extends Model{

        private $table='posts';

        public function __construct($data=null)
        {
            if(is_array($data)){
               Model::createEntry($this->table, $data);
            }
        }

        public function update(int $id, array $data)
        {
            Model::updateEntry($this->table, $data, $id);
        }

        public function delete(int $id){
            Model::deleteEntry($this->table, $id);
        }
    }