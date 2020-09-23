Ext.define('Wyngate.view.main.LoginCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.loginCard',

    onTextSpecialKey: function(field, event) {
        if (event.getKey() === event.ENTER && !this.lookupReference('loginButton').disabled)
            this.onLogin();
    },

    onLogin: function() {
        var me = this,
            loginForm = me.lookupReference('loginForm'),
            formValues = loginForm.getValues(),
            lastOffset, duration, delay, isSuperUser;

        ExtRemote.DXBackend.authenticate(formValues,
            function(result, event) {
                if (!event.status)
                    Ext.Msg.alert('Unexpected Error', event.message);
                else {
                    if (!result.success) {
                        duration = 60;
                        delay = 0;
                        lastOffset = 0;
                        Ext.each([-8, 8, -8, 8, -8, 8, 0, 0], function(offset) {
                            //Unfortunatley Mozilla doesn't run animations smoothly
                            Ext.Anim.run(loginForm, 'raw', {
                                duration: duration,
                                delay: delay,
                                from: {
                                    left: lastOffset.toString() + 'px'
                                },
                                to: {
                                    left: offset.toString() + 'px'
                                }
                            });
                            delay += duration;
                            lastOffset = offset;
                        });
                    } else {
                        isSuperUser = result.isSuperUser;
                        ExtRemote.DXBackend.getVideoDates({
                                userName: formValues.userName
                            },
                            function(result, event) {
                                var panel, message;

                                if (!event.status)
                                    Ext.Msg.alert('Unexpected Error', event.message);
                                else if (!result.success)
                                    Ext.Msg.alert('Unexpected Error', result.msg);
                                else {
                                    // clear user name and password fields so they won't be visible if we logout
                                    me.lookupReference('userNameTextField').clearValue();
                                    me.lookupReference('passwordTextField').clearValue();
                                    panel = me.getView().getParent();
                                    result.isSuperUser = isSuperUser;
                                    panel.fireEvent('login', result);
                                }
                            });
                    }
                }
            }
        );
    }
});
