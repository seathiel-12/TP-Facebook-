<?php
namespace App\Models;
use App\Models\Model;
use Exception;
use PDOException;

    class Post extends Model{

        private $managed_table=['posts', 'posts_interactions'];
        private $table;
        private $known_as = [
            'posts' => 'uuid_pID',
            'posts_interactions' => 'uuid_pIID'
        ];

        public function __construct($table=null, $data=null)
        {
            $this->table='posts';
            if(!is_null($table) && is_string($table)){
                if(in_array($table, $this->managed_table))
                     $this->table=$table;
                else throw new PDOException('Table non administée.');
            }
            if(is_array($data)){  
               $data[$this->known_as[$this->table]] = $this->generateUUID();
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

        public function getAllPosts($condition=null, $user=null){
            
                try{
                    $binding= $user ? "WHERE author = ?" : '';
                    $with= $user ? [$_SESSION['id'], $_SESSION['id']] : [$_SESSION['id']];
                        $query=  
                            "WITH post AS(
                                    WITH p AS (
                                        SELECT * FROM posts $binding LIMIT 50 
                                    )
                                    SELECT p.id, p.uuid_pID, p.author, p.file_path, p.background, p.created_at, p.caption, u.username, u.firstname, u.lastname, u.gender, u.profile_picture, p.updated_at,
                                    COUNT(pi.likes) AS nb_likes, COUNT(comments) AS nb_comments
                                    FROM users u 
                                    JOIN p ON  p.author=u.id 
                                    LEFT JOIN posts_interactions pi ON pi.post_id=p.id GROUP BY(p.id)
                                    ) 
                                    SELECT p.id, p.uuid_pID, p.author, p.file_path, p.background, p.updated_at, p.created_at, p.caption, p.username, p.firstname, p.lastname, p.gender, p.profile_picture, p.nb_likes, p.nb_comments, (pi.user_id=? AND pi.likes=1) AS is_liked
                                    FROM post p 
                                    LEFT JOIN posts_interactions pi 
                                    ON p.id=pi.post_id AND pi.comments IS NULL;
                                    ";
                        $result = Database::getDb()->prepare($query);
                        $result->execute($with);
                        $result = $result->fetchAll();
                          return $result;
                }catch(PDOException $e){
                    throw new PDOException($e->getMessage());
                }
        }

        public function get($condition){
            return Model::getEntry($this->table, $condition);
        }

        public function getThisPostComments(int $id){
            if($this->table !== 'posts_interactions') throw new Exception("Table posts_interaction requise pour cette méthode!");
            
            try{
                $query= "WITH comments AS (
                    SELECT id, comments, uuid_pIID, user_id, created_at, updated_at FROM posts_interactions WHERE post_id=? AND comments IS NOT NULL
                    )
                SELECT c.id, c.comments, c.user_id, c.created_at, c.updated_at, u.username, u.firstname, u.uuid_uID, u.lastname, u.gender, u.profile_picture FROM comments c JOIN users u ON u.id=c.user_id; ";

                $result=Database::getDb()->prepare($query);
                $result->execute([$id]);
                $result=$result->fetchAll();

                $author=(new Post()->get(['id'=>$id]))['author'];
                foreach($result as $key => $value){
                    $result[$key]['username'] = $result[$key]['username'] ?? $result[$key]['firstname'] . ' ' . $result[$key]['lastname'];
                }
                $result[]['author']=$author;

                return $result;
            }catch(PDOException $e){
                throw new PDOException("Erreur lors de la récupération des commentaires de ce post: ".$e->getMessage());
            }
            
        }
    }