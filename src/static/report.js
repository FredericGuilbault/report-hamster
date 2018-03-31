function Fact_cache() {

    this.initial_facts = Array();
    var parent = this;


    /*Import json data*/
    this.init = function (initial_facts) {
        for (var i in initial_facts) {
            /* add datastructure for dissabled data */
            initial_facts[i].disabled = Array();

            /* Patch broken databases*/
            if (initial_facts[i].category == null) {
                initial_facts[i].category = 'Not Found'
            }
            if (initial_facts[i].activity == null) {
                initial_facts[i].activity = 'Not Found'
                initial_facts[i].name = 'Not Found'
            }

        }


        this.initial_facts = initial_facts;
    };


    this.list = {
        /*factor mean witch factor have disabled the event/fact. */
        factor: function (factor) { // filter disabled event and generate a list for others events
            var factorList = Array();

            for (var id in parent.initial_facts) {
                var fact = parent.initial_facts[id];

                if ((factor === 'tag')) { //special case for tags.
                    for (var i in fact.tag) { // for each tag of this fact
                        factorList[fact.tag[i].name] = Array();
                        if (fact.disabled.length = 0) { // if not disabled
                            factorList[fact.tag[i].name].disable = false;
                        } else if (fact.disabled.indexOf(factor) > 0) { //if disabled by it self.
                            factorList[fact.tag[i].name].disable = disabled;
                        } else {
                            factorList[fact.tag[i].name].disable = true;
                        }
                    }
                } else {

                    if (fact.disabled.length === 0 && ( !fact.disabled.tag || (fact.disabled.tag && fact.disabled.tag.length === 0 )  )) { // if fact is not disabled, or completely disabled
                        var hours = fact.delta;
                        var disabled = false;

                    } else if ((fact.disabled.length === 1 && fact.disabled.indexOf(factor) >= 0) && ( !fact.disabled.tag || (fact.disabled.tag && fact.disabled.tag.length === 0 ))) {//if it's disabled by  own factor (grayout)
                        var hours = 0;
                        var disabled = true;

                    } else {// else do not include  Next !
                        continue;
                    }

                    if (!Array.isArray(factorList[fact[factor]])) { // check if it's declared first
                        factorList[fact[factor]] = Array();
                        factorList[fact[factor]].totalHours = 0;
                    }

                    factorList[fact[factor]].disable = disabled;
                    factorList[fact[factor]].totalHours += hours;

                }

            }
            return factorList; // Return an array of fact ID with dissable method  totalHours method
        },

    };


    this.draw = {


        tableRow: function (categoryList, callback) {
            var code = '';
            var totalTime = 0;
            for (var id in categoryList) {


                if (categoryList[id].disable == true) {
                    var trClass = ' class="disabled" ';
                    var time = 0;
                } else {
                    var trClass = '';
                    var time = categoryList[id].totalHours;
                    totalTime += categoryList[id].totalHours;
                }


                code += '<tr ' + trClass + ' id="event_' + id + '" onclick="fact_cache.' + callback + '(\'' + id + '\')">'
                    + '    <td>' + id + '</td>'
                    + '    <td> ' + (time / 60).toFixed(1) + ' </td>'
                    + '</tr>';

            }
            return code;
        },


        tablefoot: function (categoryList) {
            var totalTime = 0;
            for (var id in categoryList) {

                if (categoryList[id].disable !== true) {
                    totalTime += categoryList[id].totalHours;
                }
            }
            return '<tr> <td>Total</td> <td> '
                + (totalTime / 60).toFixed(1)
                + '</td></tr>';
        },


        eventTableRow: function (initial_facts) {
            var code = '';
            for (var id in initial_facts) {

                if (initial_facts[id].disabled.length == 1 && initial_facts[id].disabled.indexOf('event') >= 0) {
                    var trClass = ' class="disabled" ';
                    var time = 0;
                    var trClass = '';
                } else if (initial_facts[id].disabled.length == 0) {
                    var time = (initial_facts[id].delta / 60).toFixed(1);
                } else {
                    continue;
                }

                code += '<tr id="event_' + id + '" ' + trClass + ' onclick="fact_cache.toggleEventFilter(\'' + id + '\')" >'
                    + '    <td>' + initial_facts[id].start_time + '</td>'
                    + '    <td>' + initial_facts[id].name + '</td>'
                    + '    <td>' + initial_facts[id].category + '</td>'
                    + '    <td> ' + time + ' </td>'
                    + '</tr>';
            }

            return code;
        },


        eventTableFoot: function (initial_facts) {
            var totalTime = 0;

            for (var id in initial_facts) {
                if (initial_facts[id]['disabled'].length == 0) {
                    totalTime += initial_facts[id].delta;
                }
            }

            return '<tr> <td>Total</td> <td> '
                + (totalTime / 60).toFixed(1)
                + '</td></tr>';
        },


        tag: function (tagList) {

            for (var tag in tagList) {
                if (tagList[tag].disable == true) {
                    var code = '<span class="label label-primary gray" onclick="fact_cache.toggleTagFilter(\'' + tag + '\')">'
                        + '    <span class="gray" aria-hidden="true">' + tag + ' ' // + (tagList[tag].totalHours / 60).toFixed(1)
                        + '</span>';
                    $(code).appendTo('#tags-div');
                } else {
                    var code = '<span class="label label-primary"  onclick="fact_cache.toggleTagFilter(\'' + tag + '\')">'
                        + '    <span class="" aria-hidden="true"></span>' + tag + ' ' // + (tagList[tag].totalHours / 60).toFixed(1)
                        + '</span>';
                    $(code).appendTo('#tags-div');
                }
            }
        },

        // Generate html code to display facts/events by colomn based on their duration/delta.
        stats: function (initial_facts) {
            var SessionLength_code = '';
            var time = Array();
            for (var id in initial_facts) {
                if (initial_facts[id]['disabled'].length == 0) {
                    var T = ((initial_facts[id].delta / 60)).toFixed(0);
                    if (time[T] == undefined) {
                        time[T] = 0;
                    }
                    time[T] = (time[T] + 1);
                }
            }

            SessionLength_code += '<tr id="column" >';
            for (var i in time) {
                SessionLength_code += '    <td>' + time[i] + '<div class="graph" style="height:' + time[i] * 2 + 'px"></div></td>'
            }


            SessionLength_code += '</tr><tr id="duration" >';
            for (var i in time) {
                SessionLength_code += '    <td>' + i + ' h</td>'
            }
            SessionLength_code += '</tr>';

            return SessionLength_code;
        }

    };

// this method take original data , apply all filter and set the residual data into active_facts table
    this.applyFilters = function () {
        //clean old data
        $('#event-tbody').html("");
        $('#categories-tbody').html("");
        $('#categories-tfoot').html("");
        $('#activities-tbody').html("");
        $('#activities-tfoot').html("");
        $('#tags-div').html("");
        $('#stats-sessionLength').html("");
        $('#stats-DayOfWeek').html("");
        $('#stats-byAct').html("");
        $('#stats-ByCat').html("");


        var code = this.draw.tableRow(this.list.factor('category'), 'toggleCategoryFilter');
        var foot = this.draw.tablefoot(this.list.factor('category'));
        $(code).appendTo('#categories-tbody');
        $(foot).appendTo('#categories-tfoot');


        code = this.draw.tableRow(this.list.factor('name'), 'toggleActivitieFilter');
        foot = this.draw.tablefoot(this.list.factor('name'));
        $(code).appendTo('#activities-tbody');
        $(foot).appendTo('#activities-tfoot');


        code = this.draw.eventTableRow(this.initial_facts);
        foot = this.draw.eventTableFoot(this.initial_facts);
        $(code).appendTo('#event-tbody');
        $(foot).appendTo('#event-tfoot');


        tagList = this.list.factor('tag');
        /*get a list of active tags */

        code = this.draw.tag(tagList);
        $(code).appendTo('#tags-div');


        code = this.draw.stats(this.initial_facts);
        $(code).appendTo('#stats-sessionLength');


    };


    this.toggleTagFilter = function (togglingTag) {
        for (factId in this.initial_facts) {
            if (this.initial_facts[factId].tags.indexOf(togglingTag) >= 0) { // if fact have this tag     else there is nothing to do, just loop to next one

                if (this.initial_facts[factId].disabled.tag && this.initial_facts[factId].disabled.tag.indexOf(togglingTag) >= 0) {
                    this.initial_facts[factId].disabled.tag.pop(this.initial_facts[factId].disabled.tag.indexOf(togglingTag));
                } else {

                    if (!Array.isArray(this.initial_facts[factId].disabled.tag)) { // check if it's declared first
                        this.initial_facts[factId].disabled.tag = Array();
                    }

                    this.initial_facts[factId].disabled.tag.push(togglingTag);

                }
            }
        }
        this.applyFilters();
    };


    this.toggleEventFilter = function (factId) {

        if (this.initial_facts[factId]['disabled'].indexOf('event') >= 0) {
            this.initial_facts[factId]['disabled'].pop(this.initial_facts[factId]['disabled'].indexOf('event'));
        } else {
            this.initial_facts[factId]['disabled'].push('event');
        }
        this.applyFilters();
    };


    this.toggleCategoryFilter = function (id) {
        for (factId in this.initial_facts) {
            if (this.initial_facts[factId].category === id) {

                if (this.initial_facts[factId]['disabled'].indexOf('category') >= 0) {
                    this.initial_facts[factId]['disabled'].pop(this.initial_facts[factId]['disabled'].indexOf('category'));
                } else {
                    this.initial_facts[factId]['disabled'].push('category');
                }
            }
        }
        this.applyFilters();
    };


    this.toggleActivitieFilter = function (id) {
        for (factId in this.initial_facts) {
            if (this.initial_facts[factId].name === id) {

                if (this.initial_facts[factId]['disabled'].indexOf('name') >= 0) {
                    this.initial_facts[factId]['disabled'].pop(this.initial_facts[factId]['disabled'].indexOf('name'));
                } else {
                    this.initial_facts[factId]['disabled'].push('name');
                }
            }
        }
        this.applyFilters();
    };

    /*Establish a filtering rule by date. */
    this.setDatefilter = function (from, to) {
        for (var factId in this.initial_facts) {

            if (Date.parse(this.initial_facts[factId].date) > from && Date.parse(this.initial_facts[factId].date) < to) {
                if (this.initial_facts[factId]['disabled'].indexOf("date") >= 0) {
                    this.initial_facts[factId]['disabled'].pop(this.initial_facts[factId]['disabled'].indexOf("date"));
                }

            } else {
                if (this.initial_facts[factId]['disabled'].indexOf("date") < 0) {
                    this.initial_facts[factId]['disabled'].push("date");
                }
            }
        }
    };


    this.getFacts = function () {
        return this.initial_facts;
    };


    /*Return the date(day) if the first fact */
    this.getFirstFactDate = function () {
        var bestFound = Date.parse("9000-01-01");
        for (factId in this.initial_facts) {
            var date = this.initial_facts[factId].date.split(' ')[0];
            var current = Date.parse(date);

            if (current < bestFound) {
                bestFound = current;
            }
        }
        return bestFound;
    };

}


