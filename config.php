<?php


/**
 * @constant string TMP_REPORT location of the PHP generated report. Designed to be read by the browser then be removed.
 * Make sure this location is PHP writable.
 */
define('TMP_REPORT','/tmp/php-report-hamster_'.rand(9000,90000000000).'.tmp.html');


/**
 * @constant string DATABASE_FILE location of the hamster database.
 * Make sure this location is PHP readable.
 */
define('CLI_DATABASE_FILE',$_SERVER['HOME'].'/.local/share/hamster-applet/hamster.db');


/**
 * @constant string WEB_DATABASE_FILE location of the hamster database.
 * Make sure this location is inside the webroot AND protected form direct access.
 */
define('WEB_DATABASE_FILE','./hamster.db');


/**
 * @constant bool DEV if true, use the src file instead of report.html
 */
define('DEV',true);
