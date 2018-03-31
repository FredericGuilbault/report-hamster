<?php

/**
 * Class Database managing all the database query.
 */
class Database{


    /**
     * @var database connection object
     */
    private $db;


    /**
     * @function connectTo connect to sqlite file.
     * @param $sqliteFile string The absolute path to the sqlite file.
     * @return bool return true if connection established.
     */
    public function connectTo($sqliteFile)
    {

        if (!file_exists($sqliteFile) || !is_readable($sqliteFile)) {
            die('FATAL: Unable to read file ' . $sqliteFile);
        }

        try {
            $db = new PDO('sqlite:' . $sqliteFile);
            $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);

        } catch (Exception $e) {
            echo 'FATAL: Failed to access database. ' . PHP_EOL;
            die($e->getMessage());
        }
        $this->db = $db;
        return true;
    }


    /**
     * @function fetchTable get an associative array of the content of the table.
     * @param $tableName string table name.
     * @return array
     */
    private function fetchTable($tableName)
    {
        $data = array();
        $r = $this->db->query("SELECT * FROM $tableName ;");
        while ($row = $r->fetch(PDO::FETCH_ASSOC)) {
            if (isset($row['id'])) {
                $data[$row['id']] = $row;
            } else {
                $data[] = $row;
            }
        }
        return $data;
    }


    /**
     * @function getDatabaseDump Get a dump of the database formated for the json report
     * @return array
     */
    public function getDatabaseDump()
    {
        $categories = $this->fetchTable('categories');
        $activities = $this->fetchTable('activities');

        foreach ($this->fetchTable('facts') as $row) {

            /* Reset and get the activity data of the current fact */
            if (isset($activities[$row['activity_id']])) {
                $activity = $activities[$row['activity_id']];
            } else {
                $activity = NULL;
            }

            /* Reset and get the category data of the current fact */
            if (isset($activity['category_id']) && isset($categories[$activity['category_id']])) {
                $category = $categories[$activity['category_id']];
            } else {
                $category = NULL;
            }

            /*Fix activites that have no end time.*/
            if ($row['end_time'] == null) {
                $row['end_time'] = $row['start_time'];
            }

            /*Get duration of this fact in minutes*/
            $delta = round(abs(strtotime($row['end_time']) - strtotime($row['start_time'])) / 60);

            /*get tags for this fact */
            $tagName = array();
            $r = $this->db->query("SELECT * FROM fact_tags WHERE fact_id = " . $row['id'] . " ;");
            while ($tag = $r->fetch(PDO::FETCH_ASSOC)) {
                $r = $this->db->query("SELECT `name` FROM tags WHERE id = " . $tag['tag_id'] . " ;");
                while ($tag2 = $r->fetch(PDO::FETCH_ASSOC)) {
                    $tagName[] = $tag2;
                }
            }

            /* Create the fact in the new data structure */
            $facts[$row['id']] = array(
                'activity' => $activity['name'],
                "category" => $category['name'],
                "activity_id" => $row['activity_id'],
                "description" => $row['description'],
                "tags" => array(),
                "start_time" => $row['start_time'],
                "tag" => $tagName,
                "end_time" => $row['end_time'],
                "delta" => $delta,
                "date" => $row['start_time'],
                "id" => $row['id'],
                "name" => $activity['name']
            );
        }
        return $facts;
    }
}


