Ext.define('Wyngate.view.main.CardPanel', {
    extend: 'Ext.panel.Panel',

    controller: 'cardPanel',

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'panel',
        reference: 'cardPanel',
        layout: 'card',
        items: [{
            xtype: 'logincard',
            reference: 'loginCard',
        }, {
            xtype: 'videocard',
            reference: 'videoCard',
            autoScroll: true,
        }],
        listeners: {
            login: 'onLogin',
            logout: 'onLogout'
        }
    }]

});
