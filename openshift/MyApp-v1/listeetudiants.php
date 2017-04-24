<?php     
define('DB_HOST', getenv('OPENSHIFT_MYSQL_DB_HOST'));
define('DB_USER',getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
define('DB_PASS', getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
try
{
$bdd = new PDO('mysql:host='.DB_HOST.';dbname=gestionetudiants',DB_USER,DB_PASS);
}
catch(Exception $e)
{
        die('Erreur : '.$e->getMessage());
}
$req="SELECT * FROM etudiant";
$reponse = $bdd->query($req);
if($reponse->rowCount()>0) {
	$out = "<table>";
while ($row = $reponse ->fetch(PDO::FETCH_ASSOC)) {
$out=$out."<tr><td>".$row ['cin'].'</td><td>'. $row ['nom'].'</td><td>'.$row ['prenom'].'</td><td>'.$row ['email'].'</td><td>'.$row ['Classe'].'</td></tr>';
}
 $out=$out."</table>";
 echo $out;
}
else
	echo "Table vide";
 
?>
