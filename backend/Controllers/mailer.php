<?php
    namespace App\Controllers;
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require $_SERVER['DOCUMENT_ROOT'].'/headers.php';

    trait mailer{
        private function generateMailerCode(){
            $letter="ABC3DE0FGHIJ1KLM2NO9PQR7S4T8UVWXYZ56";
            $code="";
            for($i=0; $i<6; $i++){
                $code.=$letter[rand(0,35)];
            }
           return $code; 
        }
    
        public function mailerSend($fullname,$type){

            try{
                $mail=new PHPMailer();
                $mail->isSMTP();
                $mail->Host=$_ENV['MAILER_HOST'];
                $mail->SMTPAuth=true;
                $mail->Username=$_ENV['MAILER_USERNAME'];
                $mail->Password=$_ENV['MAILER_PASSWORD'];
                $mail->SMTPSecure= 'tls';
                $mail->Port= $_ENV['MAILER_PORT'];
    
                if(isset($_SESSION['resetPassCode']) && $type==="resetPassCode"){
                    $message="Plus qu'une étape avant de réinitialiser votre mot de passe. $fullname, Nous avons recu votre demande de réinitialisation de mot de passe. Saisissez le code suivant dans le champ requis sur le site pour effectuer la modification: <br> <br> <strong  style='background:rgb(77, 118, 255); width:max-content; border-radius:10px; padding:10px 15px; display:block; margin:auto;'>".$_SESSION['resetPassCode']."</strong>. <br><br>
                    <p>Vous n'avez pas demandé ce code? Signalez-ce mail.<p>";
                }else{
                    if(isset($_SESSION['registerCode']) && $type==="register")
                    $message="Bienvenue $fullname sur Facebook Clone. Validez votre e-mail avec le code suivant pour accéder à des fonctionnalités uniques et communiquer avec vos amis: <br><br> <strong style='background:rgb(77, 118, 255); width:max-content; border-radius:10px; padding:10px 15px; display:block; margin:auto;'>".$_SESSION['registerCode']."</strong>. <br><br>
                    Vous n'avez pas demandé ce code? Signalez-ce mail.";
                }
                $mail->setFrom($_ENV['MAILER_USERNAME'],'Facebook Clone');
                $mail->addAddress($_ENV['MAILER_ADMINISTRATOR'],'New Facebook User');
                
                $mail->isHTML();
                $mail->CharSet='UTF-8';
                $mail->Subject="Code de confirmation.";
                $mail->Body=$message;
                // $mail->SMTPDebug=4;
                // $mail->Debugoutput='html';
                // $mail->send();
            }catch(Exception $e){
                echo json_encode(['message'=>$mail->ErrorInfo]);
            }
             
    }

    }