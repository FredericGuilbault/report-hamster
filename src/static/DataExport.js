function DataExport() {
}


DataExport.download = function (filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);

    } else {
        pom.click();
    }
};


DataExport.factCache2Json = function (fact_cache) {
    var rtn = Array();

    for (var id in fact_cache) {
        if (fact_cache[id].disabled.length === 0 && ( !fact_cache[id].disabled.tag || (fact_cache[id].disabled.tag && fact_cache[id].disabled.tag.length === 0 )   ) ) {
            rtn.push(fact_cache[id]);
        }
    }

    return JSON.stringify(rtn);
};


DataExport.SaveFile = function (fact_cache) {
    catNames= '';

    var fileNameDate = catNames+$('input[name="daterange"]').val();
    $('#event-tbody').html("");
    $('#categories-tbody').html("");
    $('#activities-tbody').html("");
    $('#date_range_box').html('');
    $('event-tbody').html('');

    $('#date_range_box').html('<input type="hidden" name="daterange" value="1984-01-01 - 2984-01-01" />');

    $('#json4offline').html('<![CDATA[' + DataExport.factCache2Json(fact_cache.getFacts()) + ']]>');

    var html = document.documentElement.outerHTML;
    this.download(fileNameDate + '' + '.html', html);
    init_cal();
    fact_cache.applyFilters();
};







