<?php

require_once('config.php');
require_once('Database.php');

/*Get facts form DB and transform them to json*/
$database = new Database();
$database->connectTo(WEB_DATABASE_FILE);
$cdata = json_encode($database->getDatabaseDump());

if(DEV){
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    require_once('src/report.php');
    
}else{
    $template  = file_get_contents('report.html');
    $result = str_replace('<![CDATA[[]]>', '<![CDATA[['.$cdata.']]>', $template);
    echo $result;

}

