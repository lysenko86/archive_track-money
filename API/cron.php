<?php
    require_once('db.php');

    $db      = new Db;
    $dbError = $db->connect();
    if ($dbError == 'requestMySQLError'){
        echo 'Помилка! Не можу підключитись до бази даних.';
        exit;
	}

    else{
        $count   = 10;
        $inArray = '';
        $emails  = $db->query("SELECT * FROM `mailing_cron` LIMIT 0,".$count, []);
        if ($emails){
            for ($i=0; $i<$count; $i++){
                $inArray .= "'{$emails[$i]['email']}', ";
                mail($emails[$i]['email'], $emails[$i]['theme'], $emails[$i]['content']);
            }
            $inArray = substr($inArray, 0, -2);
            $inArray = '('.$inArray.')';
            $db->query("DELETE FROM `mailing_cron` WHERE `email` IN ".$inArray, []);
        }
        $db->disconnect();
    }
?>
