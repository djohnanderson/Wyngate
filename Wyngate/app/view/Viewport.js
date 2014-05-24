Ext.define('Wyngate.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Fit',
        'Ext.layout.container.Card',
        'Wyngate.view.Main',
        'Wyngate.view.Login'
    ],

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'panel',
        itemId: 'cardPanel',
        layout: 'card',
        items: [{
            xtype: 'login'
        }, {
            xtype: 'mainapp',
            autoScroll:true
        }]
    }]
});
