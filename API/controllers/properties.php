<?php
class Properties{
    private $params = [];
    private $data   = [];
    private $db     = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function getProperties(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `properties` WHERE `uid` = ? ORDER BY `title` ASC", [$this->params['uid']]);
        $this->data['status'] = 'success';
    }
    function getProperty(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `properties` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function editProperty(){
        if (!$this->params['title']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Назва" не може бути пустим!';
        }
        elseif (!preg_match('/^[\d\.\+\-]+$/', $this->params['price']) || $this->params['price'] == '0'){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Ціна" має бути числовим і не нуль!';
        }
        else{
            if ($this->params['id']){     // edit property
                $this->db->query(
                    "UPDATE `properties` SET `title` = ?, `price` = ? WHERE `id` = ? AND `uid` = ?",
                    [$this->params['title'], $this->params['price'], $this->params['id'], $this->params['uid']]
                );
                $this->data['msg'] = "Готово! Майно успішно змінене.";
            }
            else{     // add property
                $id = $this->db->query(
                    "INSERT INTO `properties` (`uid`, `title`, `price`) VALUES(?, ?, ?)",
                    [$this->params['uid'], $this->params['title'], $this->params['price']], NULL, true
                );
                $this->data['msg'] = "Готово! Майно успішно додане.";
            }
            $id                = $this->params['id'] ? $this->params['id'] : $id;
            $this->data['arr'] = [
                id    => $id,
                uid   => $this->params['uid'],
                title => $this->params['title'],
                price => $this->params['price']
            ];
            $this->data['status'] = 'success';
        }
    }
    function delProperty(){
        $this->db->query("DELETE FROM `properties` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Майно успішно видалене.";
    }
}
?>
