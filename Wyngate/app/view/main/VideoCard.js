Ext.define('Wyngate.view.main.VideoCard', {
    extend: 'Ext.panel.Panel',
    xtype: 'videocard',

    controller: 'videoPanel',

    tbar: [{
        xtype: 'datefield',
        reference: 'dateField',
        label: 'Wyngae video for:',
        labelAlign: 'left',
        labelWidth: 107,
        width: 200,
        tooltip: 'Date of video to display',
        listeners: {
            change: 'setVideoForDate'
        }
    }, {
        xtype: 'button',
        text: 'Guest Date Range',
        reference: 'guestDateRangeButton',
        handler: 'setGuestDatesRange'
    },'->', {
        xtype: 'button',
        text: 'Logout',
        handler: 'onLogout'
    }],
    items: [{
        xtype: 'video',
        reference: 'videoPane',
        autoResume: true
    }],
    listeners: {
        login: 'onLogin'
    }
});
