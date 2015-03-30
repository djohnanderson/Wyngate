Ext.define('Wyngate.view.Login', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.form.field.Text',
        'Ext.form.Panel'
    ],
    xtype: 'login',
    style: {
        background:'#ffffff',
        backgroundImage: 'url(resources/house.jpg)',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left'
    },

    layout: {
        align: 'middle',
        pack: 'center',
        type: 'hbox'
    },
    
    items: [{
        xtype: 'form',
        itemId: 'loginForm',
        frame: true,
        padding: '6',
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
            fieldLabel: 'Username',
            itemId: 'usernameTextField',
            name: 'username',
            margins: {top:7, right:7, bottom:0, left:7}

        }, {
            fieldLabel: 'Password',
            itemId: 'passwordTextField',
            name: 'password',
            inputType: 'password',
            margins: {top:0, right:7, bottom:0, left:7}
        }, {
            xtype: 'button',
            itemId: 'loginButton',
            formBind: true,
            text: 'Login',
            margins: {top:0, right:7, bottom:7, left:7}
        }]
    }]
});