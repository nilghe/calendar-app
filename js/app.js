$(function(){
    console.log('Calendar!');
    _calendar.init();
    _controls.init();
});

function Event(eventObj) {
    this.date = eventObj.date;
    this.start = eventObj.start;
    this.end = eventObj.end;
    this.description = eventObj.description;
};

_constants = {
    hours: 24
}

_calendar = {
    $calendar: $('[data-calendar-layout]'),
    todayEvents: [],
    hours: _constants.hours,

    init: function() {
        this.populateCalendarHours(this.$calendar);
    },

    populateCalendarHours: function(calendar) {
        for (var i = 0; i < this.hours; i++) {
            var hoursContainer = $('<div/>', {
                "data-hour": i,
                "class": 'calendar__hour'
            });

            var hour = $('<div/>', {
                "class": 'calendar__hour_label',
                "text": _helpers.convertToTime(i)
            });
            hoursContainer.append(hour);
            calendar.append(hoursContainer);
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
    $startDropdown: $('[data-start-time]'),
    $endDropdown: $('[data-end-time]'),
    hours: _constants.hours,
    $calendar: _calendar.$calendar,

    init: function() {
        this.populateDropdown(this.$startDropdown);
        this.populateDropdown(this.$endDropdown);

        $('.controls__add-event').on('click', function(){
            var start = $('.controls__start-time').val();
            var end = $('.controls__end-time').val();
            var description = $('.controls__desc').val();
            var calendarEvent = new Event({
                "start": start,
                "end": end,
                "description": description
            });
            this.addEvent(calendarEvent);
        }.bind(this));
    },

    populateDropdown: function(dropdown) {
        for (var i = 0; i < this.hours; i++) {
            var option = $('<option />', {
                "value": i,
                "text": _helpers.convertToTime(i)
            });
            dropdown.append(option);
        }
    },

    addEvent: function(eventObj) {
        _calendar.todayEvents.push(eventObj);

        var startHour = eventObj.start;
        var endHour = eventObj.end;
        var description = eventObj.description;
        
        for (var i = 0; i < this.hours; i++) {
            var eventDetails = $('<div />', {
                "class": 'calendar__event-empty',
                "text": '\u00A0'
            });
            
            if (i > (startHour - 1) && i < (endHour)) {
                var eventDetails = $('<div/>', {
                    "class": 'calendar__event',
                    "text": description
                });
            }

            $('[data-hour="' + i + '"]').append(eventDetails);
        }
    }
}