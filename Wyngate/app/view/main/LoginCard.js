Ext.define('Wyngate.view.main.LoginCard', {
    extend: 'Ext.container.Container',

    xtype: 'logincard',
    controller: 'loginCard',

    style: {
        backgroundImage: 'url(resources/house.jpg)',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat'
    },

    layout: {
        align: 'middle',
        pack: 'center',
        type: 'hbox'
    },

    items: [{
        xtype: 'formpanel',
        reference: 'loginForm',
        layout: {
            align: 'middle',
            pack: 'center',
            type: 'vbox'
        },

        defaults: {
            xtype: 'textfield',
            labelWidth: 62,
            width: 160,
            allowBlank: false
        },
        items: [{
            label: 'userName',
            reference: 'userNameTextField',
            name: 'userName',
            listeners: {
                specialKey: 'onTextSpecialKey'
            }
        }, {
            label: 'password',
            reference: 'passwordTextField',
            name: 'password',
            inputType: 'password',
            listeners: {
                specialKey: 'onTextSpecialKey'
            }
        }, {
            xtype: 'button',
            reference: 'loginButton',
            handler: 'onLogin',
            formBind: true,
            text: 'Login'
        }]
    }]
});
