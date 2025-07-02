-- Active: 1750739211247@@127.0.0.1@3306@facebook
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    work_at VARCHAR(255) DEFAULT NULL,
    lives_at VARCHAR(255) DEFAULT NULL,
    relationship_status ENUM('single', 'couple', 'married', 'divorced') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (email LIKE '%@%.%'), CHECK (email IS NOT NULL OR phone IS NOT NULL)
);


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



CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('post', 'story', 'reel') NOT NULL,
    media_type ENUM('text', 'image', 'video') NOT NULL, 
)

DROP TABLE users;
SELECT * FROM users;

DELETE FROM users;
INSERT INTO users (firstname, lastname, email, date_of_birth, gender, profile_picture, cover_picture, username, bio, password, work_at,  lives_at, relationship_status) VALUES ('John', 'Doe', 'johndoe@gmail.com' ,'1990-01-01', 'male', 'profile.jpg', 'cover.jpg', 'johndoe', 'I am a software engineer', 'password123', 'Google', 'New York', 'single');