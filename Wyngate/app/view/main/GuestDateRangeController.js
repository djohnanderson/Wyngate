Ext.define('Wyngate.view.main.GuestDateRangeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.guestDateRangeController',

    onSave: function() {
        var view = this.getView(),
            guestDateRange = {},
            startDateField = this.lookupReference('startDateField'),
            endDateField = this.lookupReference('endDateField'),
            callback = view.config.callback;

        guestDateRange.start = startDateField.getFormattedValue('Y-m-d');
        guestDateRange.end = endDateField.getFormattedValue('Y-m-d');
        ExtRemote.DXBackend.setEnableDates(guestDateRange);
        view.close();
        if (callback) {
            callback(guestDateRange);
        }
    },

    onCancel: function() {
        this.getView().close();
    },

    enableDisableSave() {
        var saveButton = this.lookupReference('saveButton');

        saveButton.setDisabled(!this.getView().isValid());
    },

    init: function(component) {
        var me = this,
            guestDateRange = component.config.guestDateRange,
            setDateField = function(fieldName, value) {
                var dateField = me.lookupReference(fieldName);

                dateField.setValue(Ext.Date.parse(value, 'Y-m-d'))
            }

        setDateField('startDateField', guestDateRange.start);
        setDateField('endDateField', guestDateRange.end);
        me.enableDisableSave();
    }
});
