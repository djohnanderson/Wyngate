Ext.define('Wyngate.view.Main', {
    extend: 'Ext.panel.Panel',
    requires:[
        'Ext.menu.DatePicker',
        'Wyngate.view.HTML5VideoPanel'
    ],

    xtype: 'mainapp',

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            items: [{
                tbar: [{
                    text: 'Choose a Date',
                    itemId: 'dateButton',
                    menu: {
                        xtype: 'datemenu',
                        pickerId: 'datePicker'
                    },
                    tooltip: 'Pick a date of the video you want to view'
                }, {
                    text: 'Logout',
                    itemId: 'logoutButton'
                }],
                items: [{
                    xtype: 'html5video',
                    itemId: 'videoPane',
                    layout: 'fit',
                    flex: 0,
                    height: 'auto',
                    width: '100%',
                    type: 'video/mp4'
                }]

            }]
        });

        me.callParent(arguments);
    }
});