-- Active: 1750739211247@@127.0.0.1@3306@facebook
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid_uID VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(255) UNIQUE DEFAULT NULL,
    email VARCHAR(255) UNIQUE DEFAULT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    profile_picture VARCHAR(255) DEFAULT NULL,
    cover_picture VARCHAR(255) DEFAULT NULL,
    bio VARCHAR(255) DEFAULT null,
    profession INT DEFAULT NULL,
    lives_at INT DEFAULT NULL,
    about TEXT DEFAULT NULL,
    study_level ENUM ('CEP', 'bepc', 'baccalauréat', 'licence', 'master', 'doctorat', 'cap', 'dti'),
    relationship_status ENUM('single', 'couple', 'married', 'divorced') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (email LIKE '%@%.%'), CHECK (email IS NOT NULL OR phone IS NOT NULL),
    FOREIGN KEY (profession) REFERENCES professions(id),
    FOREIGN KEY (lives_at) REFERENCES country(id)
);

ALTER TABLE users ADD COLUMN online BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

DROP Table users

CREATE TABLE professions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (255) NOT NULL
);

SELECT id, uuid_uID, firstname, lastname, username, profile_picture, gender FROM users WHERE id!= 2
                    AND (id NOT IN(
                        SELECT receiver_id FROM friends_requests WHERE requester_id = 2 AND status != 'rejected'
                    )
                    AND id NOT IN (
                        SELECT requester_id FROM friends_requests WHERE receiver_id = 2 AND (status = 'accepted' OR status='rejected' AND DATEDIFF(NOW() , updated_at) < 30 ) 
                    )
                ) LIMIT 50;


SELECT requester_id FROM friends_requests WHERE receiver_id = 2 AND (status = 'accepted' OR status='rejected' AND DATEDIFF(NOW() , updated_at) < 30 ) ;
-- Insertion de 50 professions variées
INSERT INTO professions (name) VALUES
('Médecin'),
('Ingénieur informatique'),
('Enseignant'),
('Avocat'),
('Architecte'),
('Comptable'),
('Infirmier'),
('Dentiste'),
('Vétérinaire'),
('Pharmacien'),
('Pilote'),
('Chef cuisinier'),
('Journaliste'),
('Photographe'),
('Designer graphique'),
('Développeur web'),
('Analyste financier'),
('Consultant en management'),
('Psychologue'),
('Kinésithérapeute'),
('Électricien'),
('Plombier'),
('Mécanicien'),
('Chauffeur'),
('Serveur'),
('Coiffeur'),
('Esthéticienne'),
('Vendeur'),
('Agent immobilier'),
('Notaire'),
('Huissier'),
('Expert-comptable'),
('Auditeur'),
('Chef de projet'),
('Responsable marketing'),
('Commercial'),
('Recruteur'),
('Formateur'),
('Traducteur'),
('Interprète'),
('Acteur'),
('Musicien'),
('Écrivain'),
('Peintre'),
('Sculpteur'),
('Danseur'),
('Chorégraphe'),
('Réalisateur'),
('Producteur'),
('Monteur vidéo'),
('Sound designer');

CREATE TABLE hobbies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Insertion de 20 hobbies variés
INSERT INTO hobbies (name) VALUES
('Lecture'),
('Sport'),
('Musique'),
('Cuisine'),
('Photographie'),
('Voyage'),
('Jeux vidéo'),
('Peinture'),
('Danse'),
('Jardinage'),
('Cinéma'),
('Théâtre'),
('Randonnée'),
('Natation'),
('Football'),
('Basketball'),
('Tennis'),
('Golf'),
('Escalade'),
('Yoga');


CREATE TABLE managers(
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE DEFAULT NULL,
    role ENUM('admin', 'moderator') NOT NULL,
    profile_picture VARCHAR(255) DEFAULT NULL,
    cover_picture VARCHAR(255) DEFAULT NULL,
    bio VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (email LIKE '%@%.%')
);

DROP Table posts_interactions

CREATE TABLE posts(
    id INT PRIMARY KEY AUTO_INCREMENT,
    caption TEXT,
    uuid_pID VARCHAR(255) NOT NULL UNIQUE,
    author INT,
    file_path VARCHAR(255) DEFAULT NULL,
    background VARCHAR(255) DEFAULT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (
        (file_path IS NOT NULL AND background IS NULL) 
            OR
        (file_path IS NULL AND background IS NULL)
            OR
        (file_path IS NULL AND background IS NOT NULL)
    ), 
    FOREIGN KEY (author) REFERENCES users (id) ON DELETE CASCADE
)


CREATE TABLE posts_interactions(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid_pIID VARCHAR (255) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    likes BOOLEAN,
    comments TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)

CREATE TRIGGER AFTER DELETE posts (
    DELETE FROM posts interactions WHERE post_id= OLD
);

DROP TABLE posts_interactions


CREATE TABLE security_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action ENUM('banned', 'unbanned', 'disabled', 'enabled') NOT NULL,
    reason VARCHAR(255) DEFAULT NULL,
    time_disabled INT DEFAULT NULL,
    ip_address VARCHAR(255) NOT NULL,
    user_agent VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id), 
    CHECK(
        (time_disabled IS NOT NULL AND action='disabled') 
            OR
         (time_disabled IS NULL AND action!= 'disabled')
         )
);


WITH comments AS (
    SELECT id, comments, user_id, created_at, updated_at FROM posts_interactions WHERE post_id=? AND comments IS NOT NULL
)
SELECT c.id, p.author, c.comments, c.user_id, c.created_at, c.updated_at, u.username, u.firstname, u.lastname, u.gender, u.profile_picture FROM comments c JOIN users u ON u.id=c.user_id;

SELECT * FROM posts WHERE author=4;

CREATE TABLE friends(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT REFERENCES users (id),
    friend_id INT REFERENCES users (id),
    CHECK(user_id != friend_id), 
    UNIQUE (user_id, friend_id)
);
DROP TABLE  friends_requests;
CREATE TABLE friends_requests(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid_fID VARCHAR(255) NOT NULL UNIQUE,
    requester_id INT ,
    receiver_id INT ,
    status ENUM ('pending', 'accepted', 'rejected') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id)
)

SELECT FROM friends_requests WHERE user_id = 1 and 


WITH friends_r AS (
    SELECT * FROM friends_requests 
    WHERE (requester_id = 2 OR receiver_id = 2) AND status = 'accepted'
),
friends AS (
    SELECT 
        CASE 
            WHEN requester_id = 2 THEN receiver_id
            ELSE requester_id 
        END AS id 
    FROM friends_r
)
SELECT u.firstname
FROM users u
JOIN friends f ON f.id = u.id;

SELECT u.username, u.id, u.firstname, u.lastname, u.profil_picture, u.gender 
FROM user u 
JOIN friends ON 



WITH sent AS (
    SELECT receiver_id FROM friends_requests WHERE requester_id = 20 AND status ='pending'
) 
SELECT u.username, u.profile_picture, u.gender, u.firstname, u.lastname FROM users u JOIN sent s ON receiver_id = u.id


CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid_mID VARCHAR (255) UNIQUE NOT NULL,
    sender_id INT REFERENCES users (id),
    receiver_id INT REFERENCES users (id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    file_path VARCHAR (255) DEFAULT NULL,
    sticker_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sticker_id) REFERENCES stickers (id),
    CHECK (sender_id != receiver_id)
);
DROP TABLE messages;

SELECT * FROM messages WHERE sender_id = 2 OR receiver_id = 2;
CREATE TABLE stickers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    path VARCHAR (255) NOT NULL
)


SET sql_mode=''

WITH users_disc AS (;


INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (1, 2, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (2, 3, 'accepted');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (3, 4, 'rejected');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (4, 5, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (5, 6, 'accepted');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (6, 7, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (7, 8, 'accepted');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (8, 9, 'rejected');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (9, 10, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (10, 11, 'accepted');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (11, 12, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (12, 13, 'accepted');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (13, 14, 'rejected');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (14, 15, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (15, 16, 'accepted');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (16, 17, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (17, 18, 'accepted');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (18, 19, 'rejected');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (19, 20, 'pending');
INSERT INTO friends_requests (requester_id, receiver_id, status) VALUES (20, 1, 'accepted');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (2, 5, 'pending');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (3, 6, 'accepted');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (4, 7, 'pending');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (5, 8, 'rejected');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (6, 9, 'pending');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (7, 10, 'accepted');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (8, 11, 'pending');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (9, 12, 'accepted');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (10, 13, 'rejected');
INSERT INTO friends_requests (requester_id, user_id, status) VALUES (11, 14, 'pending'); 