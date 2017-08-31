<?php
class Db{
    private $dbName = 'db_trackmoney';
    private $dbUser = 'u_trackmoney';
    private $dbPass = 'X39MWT22';
    private $db     = NULL;
    function connect(){
        $this->db = new PDO("mysql:host=localhost;dbname=$this->dbName", $this->dbUser, $this->dbPass);
        $this->db->exec("set names utf8");
    }
    function disconnect(){
        $this->db = NULL;
    }
    function query($query, $data, $ATTR_EMULATE_PREPARES=NULL){
        if ($ATTR_EMULATE_PREPARES !== NULL){
            $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, $ATTR_EMULATE_PREPARES);
        }
        $temp = $this->db->prepare($query);
        $temp->execute($data);
        return $temp->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
