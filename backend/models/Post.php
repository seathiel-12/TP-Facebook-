<?php
namespace App\Models;
use App\Models\Model;
use PDOException;

    class Post extends Model{

        private $managed_table=['posts', 'posts_interactions'];
        private $table;

        public function __construct($table=null, $data=null)
        {
            $this->table='posts';
            if(!is_null($table) && is_string($table)){
                if(in_array($table, $this->managed_table))
                     $this->table=$table;
                else throw new PDOException('Table non administée.');
            }
            if(is_array($data)){  
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
                            "WITH post AS(
                                    WITH p AS (
                                        SELECT * FROM posts LIMIT 50 
                                    )
                                    SELECT p.id, p.author, p.file_path, p.background, p.created_at, p.caption, u.username, u.firstname, u.lastname, u.gender, u.profile_picture,
                                    COUNT(pi.likes) AS nb_likes, COUNT(comments) AS nb_comments
                                    FROM users u 
                                    JOIN p ON  p.author=u.id 
                                    LEFT JOIN posts_interactions pi ON pi.post_id=p.id GROUP BY(p.id)
                                    ) 
                                    SELECT p.id, p.author, p.file_path, p.background, p.created_at, p.caption, p.username, p.firstname, p.lastname, p.gender, p.profile_picture, p.nb_likes, p.nb_comments, (pi.user_id=? AND pi.likes=1) AS is_liked
                                    FROM post p 
                                    LEFT JOIN posts_interactions pi 
                                    ON p.id=pi.post_id GROUP BY id;
                                    ";
                        $result = Database::getDb()->prepare($query);
                        $result->execute([$_SESSION['id']]);
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