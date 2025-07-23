-- Active: 1750739211247@@127.0.0.1@3306@facebook

SET sql_mode=''


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
    online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (email LIKE '%@%.%'), CHECK (email IS NOT NULL OR phone IS NOT NULL),
    FOREIGN KEY (profession) REFERENCES professions(id),
    FOREIGN KEY (lives_at) REFERENCES country(id)
);

DROP Table users

CREATE TABLE professions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (255) NOT NULL
);

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

CREATE TABLE friends(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT REFERENCES users (id),
    friend_id INT REFERENCES users (id),
    CHECK(user_id != friend_id), 
    UNIQUE (user_id, friend_id)
);

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

CREATE TABLE stickers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    path VARCHAR (255) NOT NULL
)

