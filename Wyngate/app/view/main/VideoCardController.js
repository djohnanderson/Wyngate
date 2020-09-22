Ext.define('Wyngate.view.main.VideoCardController', {
    extend: 'Ext.app.ViewController',
    
    require: [    
        'Wyngate.view.main.GuestDateRangePanel'
    ],

    alias: 'controller.videoPanel',

    onLogin: function (params) {
        var maxDate, minDate, dateField;

        this.params = params;
        maxDate = Ext.Date.parse(params.maxDate, 'm/d/Y'),
        minDate = Ext.Date.parse(params.minDate, 'm/d/Y'),
        dateField = this.lookupReference('dateField');
        dateField.setMinDate(minDate);
        dateField.setMaxDate(maxDate);
        if (params.disabledDates.length)
            dateField.getPicker().setDisabledDates(params.disabledDates);
        dateField.setValue(maxDate);

        // validators don't get hooked up to the viewController like other handlers in a veiew so we'll assign it here
        dateField.setValidators([
            this.validateDate
        ]);

        this.lookupReference('guestDateRangeButton').setHidden(!params.isSuperUser);
    },

    onLogout: function() {
        var panel = this.getView().getParent();

        panel.fireEvent('logout');
    },

    setVideoForDate: function(field, date) {
        var videoPane = this.lookupReference('videoPane'),
            videoURL;

        if (field.isValid()) {
            this.currentDate = date;
            videoPane.stop();
            videoURL = 'resources/wyngate/image' + Ext.Date.format(date, 'y-m-d') + '/timelapse.mp4';
            videoPane.setUrl (videoURL);
            videoPane.setCurrentTime(10);
            if (videoPane.ghost.isVisible()) {
                videoPane.ghost.hide();
                videoPane.media.show();
            }
            videoPane.play();
        }
    },
  
    setGuestDatesRange: function() {
        var me = this,
            panel,
            params = {
                guestDateRange: me.params.guestDateRange,
                callback: function (newGuestDateRange) {
                    me.params.guestDateRange = newGuestDateRange;
                }
            };

        if (me.getView().isVisible() && me.params.isSuperUser) {
            panel = Ext.create('Wyngate.view.main.GuestDateRangePanel', params);
            panel.show();
        }
    },

    validateDate: function() {
        //this is dateField, not controller
        var dateAsString = this.getFormattedValue('m/d/Y');

        if (!this.getPicker().getDisabledDates().re.test(dateAsString))
            return true;
        else
            return "No video on this day";
    }
});
