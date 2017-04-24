<?php 

define('DB_HOST', getenv('OPENSHIFT_MYSQL_DB_HOST'));
define('DB_USER',getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
define('DB_PASS', getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));   
$cin=$_REQUEST['cin'];
$nom=$_REQUEST['nom'];
$prenom=$_REQUEST['prenom'];
$email=$_REQUEST['email'];
$adresse=$_REQUEST['adresse'];
$pwd=$_REQUEST['pwd'];
$classe=$_REQUEST['classe'];

try
{
$bdd = new PDO('mysql:host='.DB_HOST.';dbname=gestionetudiants',DB_USER,DB_PASS);
}
catch(Exception $e)
{
        die('Erreur : '.$e->getMessage());
}
$req="insert into etudiant values('$email','$pwd',$cin,'$nom','$prenom','$adresse','$classe')";
$reponse = $bdd->exec($req) or die("error");
if($reponse) echo "OK";
else echo "Not OK";
?>
