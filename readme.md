# Facebook Clone – Documentation Technique

## 1. Architecture du Projet

### a. Structure Générale

- **Backend (PHP, PSR-4, MVC)**
  - `backend/Controllers/` : Contrôleurs (Auth, User, Register, Discussion, etc.)
  - `backend/models/` : Modèles (User, Post, Discussion, etc.)
  - `backend/database/` : Fichiers SQL (structure de la base, migrations)
  - `backend/ApiCall.php` : Point d’entrée API, dispatch des requêtes
  - `backend/Route.php` : Routage interne (en cours de développement)
  - `public/index.php` et `index.php` : Entrées principales du site et de l’API

- **Frontend (HTML, JS, CSS)**
  - `frontend/views/` : Vues PHP/HTML (auth, register, home, profil, messenger, etc.)
  - `assets/js/modules/` : Modules JS (auth, posts, messenger, profil, friends, etc.)
  - `assets/styles/` : Feuilles de style CSS
  - `assets/media/` : Images, SVG, icônes

- **Configuration & Dépendances**
  - `composer.json` : Dépendances PHP (PHPMailer, MailerSend, Dotenv, Guzzle, etc.)
  - `package.json` : Dépendances JS (Vite, BrowserSync, Lucide, etc.)

---

## 2. Fonctionnalités Principales

### a. Authentification & Sécurité

- Inscription sécurisée avec vérification email/téléphone et code de validation
- Connexion avec gestion de session sécurisée (CSRF, cookies HttpOnly)
- Mot de passe oublié (processus en plusieurs étapes)
- Déconnexion et gestion de l’état en ligne
- Protection CORS, gestion des headers de sécurité

### b. Utilisateurs & Profils

- Création de profil utilisateur
- Gestion des informations personnelles (bio, photo, couverture, etc.)
- Système de niveaux d’étude, profession, statut relationnel

### c. Amis & Réseaux

- Envoi, acceptation, refus de demandes d’amis
- Liste d’amis, suggestions, invitations en attente
- Vérification de l’état d’amitié entre utilisateurs

### d. Publications & Interactions

- Création de posts (texte, image, vidéo, fond personnalisé)
- Fil d’actualité personnalisé
- Likes, commentaires, nombre d’interactions par post
- Suppression et modification de posts/commentaires

### e. Messagerie & Discussions

- Système de messagerie privée (en temps réel via JS)
- Gestion des messages (texte)
- Indicateur de lecture, statut en ligne/hors ligne

### f. Autres

- Sidebar dynamique (accès rapide : amis, discussions)
- Gestion des notifications (en cours)

---

## 3. Spécifications Techniques

- **Backend** : PHP 7+, PSR-4, PDO, PHPMailer, MailerSend, Dotenv, Guzzle
- **Frontend** : HTML5, CSS3, JavaScript (modules ES6), Vite, BrowserSync, Lucide, Boxicons
- **Base de données** : MySQL (tables : users, posts, friends, messages, etc.)
- **Sécurité** : Sessions sécurisées, CSRF, validation des entrées, gestion des erreurs
- **Organisation** : MVC (Modèle-Vue-Contrôleur) côté PHP, modules JS côté client

---

## 4. Conditions d’Utilisation & Installation

### a. Prérequis

- PHP >= 7.4
- Composer (pour les dépendances PHP)
- Node.js & npm (pour les outils frontend)
- MySQL/MariaDB

### b. Installation

1. **Cloner le dépôt**
   ```bash
   git clone <repo-url>
   cd Facebook\ Clone
   ```

2. **Installer les dépendances backend**
   ```bash
   composer install
   ```

3. **Installer les dépendances frontend**
   ```bash
   npm install
   ```

4. **Configurer l’environnement**
   - Copier `.env.example` en `.env` et renseigner les variables (DB, mail, etc.)
   - Importer le fichier SQL `backend/database/facebook.sql` dans votre base de données

5. **Lancer le serveur**
   - Backend : `php -S localhost:8000 -t ./`
   - Frontend (dev) : `npm run dev` (BrowserSync ou Vite)

6. **Accéder à l’application**
   - Ouvrir [http://localhost:8000](http://localhost:8000) dans votre navigateur

### c. Utilisation

- Créez un compte ou connectez-vous
- Personnalisez votre profil
- Ajoutez des amis, publiez, commentez, likez
- Utilisez la messagerie pour discuter en temps réel

---

## 5. Limitations & Points à Améliorer

- Certaines fonctionnalités sont en cours de développement (
    __posts public/privé, 
    __notifications, 
    __admin , 
    __modérateur, 
    __modification de profil, 
    __suppression de compte,
    __message video/audio/images
    __recherche sr la plateforme,
    __recherche de discussion && messages 
    __création de stories,
    __partage de posts,
    __masquage de profil,
    __signalement,
    __blocage de compte)

- Le routage backend est en cours de restructuration
- Les tests automatisés ne sont pas encore présents
- L’UI peut être enrichie pour une expérience plus proche de Facebook

---

## 6. Auteurs & Licence

- Auteur principal : Seathiel
- Licence : ISC (voir `package.json`)

---

**Résumé** : Ce projet est un clone presqu'entierement fonctionnel de Facebook, avec gestion de la connexion/inscription utilisateur, amis, posts, messagerie, et une architecture modulaire et sécurisée. Il est conçu pour être facilement extensible et personnalisable.
