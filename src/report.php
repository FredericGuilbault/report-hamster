<!DOCTYPE html>
<html lang="en">
    <?php include('head.php');  ?>
<body>

<div class="container">

    <?php include('header.php');  ?>
    
    <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#totals-tab">Totals</a></li>
        <li><a data-toggle="tab" href="#event-tab">Events</a></li>
        <li><a data-toggle="tab" href="#stats-tab">Stats</a></li>
    </ul>

    <div class="tab-content">

        <div id="totals-tab" class="tab-pane fade in active">
            <?php include('totals-tab.php');  ?>
        </div>

        <div id="event-tab" class="tab-pane fade">
            <?php include('event-tab.php');  ?>
        </div>

        <div id="stats-tab" class="tab-pane fade">
            <?php include('stats-tab.php');  ?>
        </div>

    </div>

</div>

<span id="json4offline" class="hidden"><![CDATA[<?php echo $cdata; ?>]]></span>



<!-- -------------INIT---------------- -->

<script type="text/javascript">
    $(document).ready(function() {

        /* Pars json into javascript object */
        data = $('#json4offline').html().slice(11, -5);
        fact_cache = new Fact_cache();
        fact_cache.init(JSON.parse(data));
        fact_cache.setDatefilter(new Date(fact_cache.getFirstFactDate()).getTime(), Date.now());
        create_calendar();
        fact_cache.applyFilters();

        /*Bind 'generate new report' button*/
        $("#generateNewReport").on("click", function(){
            DataExport.SaveFile(fact_cache);
        })
    });


    /*Start calandar (for init)*/
    function create_calendar(){
        $('input[name="daterange"]').val(moment(1,'MM').format('YYYY-MM-DD')+' - '+moment().format('YYYY-MM-DD') );
        $('input[name="daterange"]').dateRangePicker({
            format: 'YYYY-MM-DD',
            separator: ' - ',
            language: 'auto',
            startOfWeek: 'sunday',// or monday

            showShortcuts: false,
            time: {enabled: false},
            inline:true,
            container: '#date_range_box',
            batchMode:false,
            alwaysOpen:true

        }) .bind('datepicker-change',function(event,obj) {
            fact_cache.setDatefilter(new Date(obj.date1).getTime(), new Date(obj.date2).getTime());
            fact_cache.applyFilters();
        })
    };
</script>
</body>
</html>