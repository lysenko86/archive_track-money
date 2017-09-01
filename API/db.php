<?php
class Db{
    private $dbName = 'db_trackmoney';
    private $dbUser = 'u_trackmoney';
    private $dbPass = 'X39MWT22';
    private $db     = NULL;
    function connect(){
        $error = false;
        try{
            $this->db = new PDO("mysql:host=localhost:3307;dbname=$this->dbName", $this->dbUser, $this->dbPass);
        } catch(\PDOException $ex) {
            $error = 'requestMySQLError';
        }
        if (!$error){
            $this->db->exec("set names utf8");
        }
        return $error;
    }
    function disconnect(){
        $this->db = NULL;
    }
    function query($query, $data, $ATTR_EMULATE_PREPARES=NULL, $lastID=false){
        if ($ATTR_EMULATE_PREPARES !== NULL){
            $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, $ATTR_EMULATE_PREPARES);
        }
        $temp = $this->db->prepare($query);
        $temp->execute($data);
        return !$lastID ? $temp->fetchAll(PDO::FETCH_ASSOC) : $this->db->lastInsertId();
    }
}
?>
