$(function(){
    console.log('Calendar!');
    _calendar.init();
    _controls.init();
});

function Event(eventObj) {
    this.id = eventObj.id;
    this.date = eventObj.date;
    this.start = eventObj.start;
    this.end = eventObj.end;
    this.description = eventObj.description;
};

_constants = {
    hours: 25,
    maxEvents: 5
}

_calendar = {
    $calendar: $('[data-calendar-layout]'),
    todayEvents: [],
    hours: _constants.hours,
    uniqueId: 0,

    init: function() {
        this.renderCalendarHours(this.$calendar);
    },

    renderCalendarHours: function(calendar) {
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
    },

    emptyCalendar: function() {
        this.$calendar.empty();
        this.renderCalendarHours(this.$calendar);
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
        this.renderDropdown(this.$startDropdown);
        this.renderDropdown(this.$endDropdown);

        $('.controls__add-event').on('click', function(){
            var start = $('.controls__start-time').val();
            var end = $('.controls__end-time').val();
            var description = $('.controls__desc').val();
            var calendarEvent = new Event({
                "id": _calendar.uniqueId,
                "start": start,
                "end": end,
                "description": description
            });
            _controls.addEvent(calendarEvent);
        });

        this.$calendar.on('click', '.calendar__remove-event', function(){
            var id = $(this).data('event-id');
            _controls.removeEvent(id);
        });
    },

    renderDropdown: function(dropdown) {
        for (var i = 0; i < this.hours; i++) {
            var option = $('<option />', {
                "value": i,
                "text": _helpers.convertToTime(i)
            });
            dropdown.append(option);
        }
    },

    addEvent: function(eventObj) {

        this.incrementId();
        if (_calendar.todayEvents.length === _constants.maxEvents) {
            alert('You can only have 5 events in a day');
            return;
        }

        _calendar.todayEvents.push(eventObj);
        this.renderEvents();
    },

    removeEvent: function(id) {
        var newArray = $.grep(_calendar.todayEvents, function(obj, index){
            return obj.id != id
        });
        _calendar.todayEvents = newArray;
        this.renderEvents();
    },

    renderEvents: function() {
        _calendar.emptyCalendar();

        $.each(_calendar.todayEvents, function(index, eventObj){
            var startHour = eventObj.start;
            var endHour = eventObj.end;
            var description = eventObj.description;
            var id = eventObj.id;
            
            for (var i = 0; i < this.hours; i++) {
                var eventDetails = $('<div />', {
                    "class": 'calendar__event-empty',
                    "text": '\u00A0'
                });
                
                if (i > (startHour - 1) && i < (endHour)) {

                    eventDetails = $('<div/>', {
                        "class": 'calendar__event',
                        "text": description,
                        "data-event-id": id
                    });

                    if (i === parseInt(startHour, 10)) {
                        var closeBtn = $('<i/>', {
                            "class": 'fa fa-times calendar__remove-event',
                            "data-event-id": id
                        });
                        eventDetails.append(closeBtn);
                    }
                }

                $('[data-hour="' + i + '"]').append(eventDetails);
            }
        }.bind(this));
    },

    incrementId: function() {
        _calendar.uniqueId++;
    },
}