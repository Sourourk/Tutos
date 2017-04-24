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
 $outputs["etudiants"] = array();
    while ($row = $reponse ->fetch(PDO::FETCH_ASSOC)) {
        $etudiant = array();
        $etudiant["cin"] = $row["cin"];
        $etudiant["nom"] = $row["nom"];
        $etudiant["prenom"] = $row["prenom"];
        $etudiant["adresse"] = $row["adresse"];
        $etudiant["email"] = $row["email"];
        $etudiant["classe"] = $row["classe"];
         array_push($outputs["etudiants"], $etudiant);
    }
    // success
    $outputs["success"] = 1;
     echo json_encode($outputs);
} else {
    $outputs["success"] = 0;
    $outputs["message"] = "Pas d'étudiants";
 
    // echo no users JSON
    echo json_encode($outputs);
}

