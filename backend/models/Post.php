<?php
namespace App\Models;
use App\Models\Model;
use PDOException;

    class Post extends Model{

        private $managed_table=['posts', 'posts_interactions'];
        private $table='posts';

        public function __construct($table=null, $data=null)
        {
            if(is_array($data)){
                if(!is_null($table) && is_string($table)){
                    if(in_array($table, $this->managed_table))
                         $this->table=$table;
                    else throw new PDOException('Table non administée.');
                }
               Model::createEntry($this->table, $data);
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

        public function getAllPosts($condition=null){
            
                try{
                        $query=  
                            "WITH p AS (
                                SELECT * FROM posts LIMIT 50 
                                    )
                                    SELECT p.id, p.file_path, p.background, p.created_at, p.caption, u.username, u.firstname, u.lastname, u.gender, u.profile_picture,
                                    COUNT(pi.likes) AS nb_likes, COUNT(comments) AS nb_comments
                                    FROM users u 
                                    JOIN p ON  p.author=u.id 
                                    LEFT JOIN posts_interactions pi ON pi.post_id=p.id GROUP BY(p.id);
                                    ";
                        $result = Database::getDb()->query($query);
                        $result = $result->fetchAll();
                          return $result;
                }catch(PDOException $e){
                    throw new PDOException($e->getMessage());
                }
        }

        public function get($condition){
            return Model::getEntry($this->table, $condition);
        }
    }