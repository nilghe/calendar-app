$(function(){
    console.log('Calendar!');
    _calendar.init();
    _controls.init();
});

function CreateEvent(eventObj) {
    this.date = eventObj.date;
    this.start = eventObj.start;
    this.end = eventObj.end;
    this.details = eventObj.details;
};

_calendar = {
    $calendar: $('[data-calendar-layout]'),
    $startDropdown: $('[data-start-time]'),
    $endDropdown: $('[data-end-time]'),
    hours: 24,

    init: function() {
        this.populateCalendarHours(this.$calendar);
        this.populateDropdown(this.$startDropdown);
        this.populateDropdown(this.$endDropdown);
    },

    populateCalendarHours: function(calendar) {
        var hoursList = $('<ul/>');
        for (var i = 0; i < this.hours; i++) {
            var hour = $('<li/>', {
                "data-hour": i,
                "text": _helpers.convertToTime(i)
            });
            hoursList.append(hour);
        }

        calendar.append(hoursList);
    },

    populateDropdown: function(dropdown) {
        for (var i = 0; i < this.hours; i++) {
            var option = $('<option />', {
                "value": i,
                "text": _helpers.convertToTime(i)
            });
            dropdown.append(option);
        }
    }
};

_helpers = {
    convertToTime: function(time) {
        // Assumption is going with 24H clock and full hours
        var formattedTime = "";
        var topOfHour = ":00";
        
        if (time < 10) {
            formattedTime = "0" + time + topOfHour;
        } else {
            formattedTime = time + topOfHour;
        }

        return formattedTime;
    }
}

_controls = {
    $controls: $('.controls'),

    init: function() {
        $('.controls__add-event').on('click', function(){
            console.log('clicked');
            var time = $('.controls__time').val();
            var description = $('.controls__desc').val();
            console.log(time + description);
        });
    } 
}