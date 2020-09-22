Ext.define('Wyngate.view.main.GuestDateRangePanel', {
    extend: 'Ext.form.Panel',

    controller: 'guestDateRangeController',

    title: 'Guest Video Date Range',
    width: 260,
    autoSize: true,
    closable: true,
    centered: true,
    floated: true,
    modal: true,
    bodyPadding: 15,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [
        {
        xtype: 'datefield',
        flex: 1,
        margin: '0, 15, 0, 0',
        reference: 'startDateField',
        label: 'Start Date',
        name: 'startDate',
        listeners: {
            //Validation doesn't seem complete in Modern toolkit, e.g. formBind on buttons isn't implemented
            keyup: 'enableDisableSave'
        }
    }, {
        xtype: 'datefield',
        flex: 1,
        margin: '0, 0, 0, 15',
        reference: 'endDateField',
        label: 'End Date',
        name: 'endDate',
        listeners: {
            keyup: 'enableDisableSave'
        }
    }],

    buttons: ['->', {
        text: 'Cancel',
        handler: 'onCancel'
    }, {
        text: 'Save',
        reference: 'saveButton',
        handler: 'onSave'
    }]
});




