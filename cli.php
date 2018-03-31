<?php
require_once('config.php');
require_once('Database.php');

/*Get facts form DB and transform them to json*/
$database = new Database();
$database->connectTo(CLI_DATABASE_FILE);
$cdata = json_encode($database->getDatabaseDump());

/*generate report file*/
$html = str_replace('<![CDATA[[]]>', '<![CDATA[['.$cdata.']]>', file_get_contents('report.html'));

/*Open in a browser*/
file_put_contents(TMP_REPORT,$html,true);
chmod(TMP_REPORT, 0600);
exec('xdg-open '.TMP_REPORT );
unlink(TMP_REPORT);