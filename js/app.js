$(function(){
    _calendar.init();
    _controls.init();
});

function Event(eventObj) {
    this.id = eventObj.id;
    this.date = eventObj.date;
    this.start = eventObj.start;
    this.end = eventObj.end;
    this.description = eventObj.description;
    this.backgroundColour = eventObj.backgroundColour;
};

_constants = {
    hours: 25,
    maxEvents: 5,
    eventColours: [
        'turquoise',
        'dark-blue',
        'green',
        'blue',
        'purple'
    ]
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
    },

    randomColor: function(max, min) {
        var randomNumber = Math.floor(Math.random() * (max - min)) + min;
        return _constants.eventColours[randomNumber];
    }
}

_controls = {
    $controls: $('.controls'),
    $startDropdown: $('[data-start-time]'),
    $endDropdown: $('[data-end-time]'),
    hours: _constants.hours,
    $calendar: _calendar.$calendar,

    init: function() {
        this.renderDropdown(this.$startDropdown, 0);
        this.renderDropdown(this.$endDropdown, 24);

        $('.controls__add-event').on('click', function(){
            var start = $('.controls__start-time').val();
            var end = $('.controls__end-time').val();
            var description = $('.controls__desc').val();
            
            var colour = _helpers.randomColor(_constants.maxEvents, 0);
            var backgroundColour = 'calendar__event-' + colour;
            
            if (description === "") {
                alert('You must enter a description.');
                return;
            }

            if (parseInt(start, 10) > parseInt(end, 10)) {
                alert('Your starting time must be before the ending time.');
                return;
            }

            var calendarEvent = new Event({
                "id": _calendar.uniqueId,
                "start": start,
                "end": end,
                "description": description,
                'backgroundColour': backgroundColour
            });

            _controls.addEvent(calendarEvent);
        });

        this.$calendar.on('click', '.calendar__remove-event', function(){
            var id = $(this).data('event-id');
            _controls.removeEvent(id);
        });
    },

    renderDropdown: function(dropdown, defaultValue) {
        for (var i = 0; i < this.hours; i++) {
            var option = $('<option />', {
                "value": i,
                "text": _helpers.convertToTime(i)
            });

            if (i === defaultValue) {
                option.attr('selected', true);
            }

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
            var backgroundColour = eventObj.backgroundColour;
            var id = eventObj.id;

            for (var i = 0; i < this.hours; i++) {
                var eventDetails = $('<div />', {
                    "class": 'calendar__event-empty',
                    "text": '\u00A0'
                });
                
                if (i > (startHour - 1) && i < (endHour)) {
                    
                    eventDetails = $('<div/>', {
                        "class": 'calendar__event ' + backgroundColour,
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