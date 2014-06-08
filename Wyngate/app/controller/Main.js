Ext.define('Wyngate.controller.Main', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: '#cardPanel',
        ref: 'cardPanel'
    }, {
        selector: 'mainapp',
        ref: 'appMain'
    }, {
        selector: 'mainapp #videoPane',
        ref: 'videoPane'
    }, {
        selector: 'login',
        ref: 'login'
    }, {
        selector: 'login #loginForm',
        ref: 'loginForm'
    }, {
        selector: 'login #usernameTextField',
        ref: 'usernameTextField'
    }, {
        selector: 'login #passwordTextField',
        ref: 'passwordTextField'
    }, {
        selector: 'login #loginButton',
        ref: 'loginButton'
    }],

    specialKey: function(field, event) {
        if (event.getKey() === event.ENTER && !this.getLoginButton().disabled)
            this.login();
    },

    login: function() {
        var me = this,
            loginForm = me.getLoginForm(),
            originalX, animationElement, cardLayout;

        ExtRemote.DXBackend.authenticate(loginForm.getValues(),
            function(result){
                if (!result.success) {
                    originalX = loginForm.getX();
                    animationElement = loginForm.getEl();
                    Ext.each ([-5, 5, -5, 5, -5, 5, 0], function (offset) {
                        animationElement = animationElement.animate({
                            duration: 30,
                            to: {
                                x: originalX + offset
                            }
                        });
                    });
                } else {
                    cardLayout = me.getCardPanel().getLayout();
                    cardLayout.setActiveItem(me.getAppMain());
                }
            }
        );
    },

    dateToVideoURL: function (date) {
        return 'resources/wyngate/image' + Ext.Date.format(date, 'y-m-d') + '/timelapse.mp4'; //'#t=25';
    },

    init: function() {
        var me = this,
            config = {
                'login #usernameTextField': {
                    specialkey: {fn: me.specialKey, scope: me}
                },
                'login #passwordTextField': {
                    specialkey: {fn: me.specialKey, scope: me}
                },
                'login #loginButton': {
                    click: {fn: me.login, scope: me}
                },
                'login': {
                    activate: function(){
                        me.getUsernameTextField().setRawValue("");
                        me.getPasswordTextField().setRawValue("");
                    }
                },
                'mainapp #logoutButton': {
                    click: function() {
                        var cardLayout = me.getCardPanel().getLayout();

                        cardLayout.setActiveItem(me.getLogin());
                    }
                },
                'mainapp': {
                    show: function() {
                        // start playing the most recent video
                        var videoPane = me.getVideoPane();

                        if (!videoPane.src && this.maxDateVideo)
                            videoPane.setSrc (this.maxDateVideo);
                    }
                },
                'mainapp #dateButton': {
                    render: function(button) {
                        ExtRemote.DXBackend.getVideoDates({},
                            function(result, event){
                                var videoPane, maxDate;

                                if (event.status) {
                                    videoPane = me.getVideoPane(),
                                    maxDate = Ext.Date.parse(result.maxDate, 'm/d/Y');

                                    // Create and append the menu DatePicker to the button.
                                    // They way we do this is adapted from the ExtJS button code.
                                    button.split = true;
                                    maxDate = Ext.Date.parse(result.maxDate, 'm/d/Y');
                                    button.menu = new Ext.menu.DatePicker({
                                        xtype: 'datemenu',
                                        pickerId: 'datePicker',
                                        minDate: Ext.Date.parse(result.minDate, 'm/d/Y'),
                                        maxDate: maxDate,
                                        disabledDates: result.disabledDates,
                                        handler: function(datePicker, date){
                                            videoPane.setSrc (me.dateToVideoURL (date));
                                        }
                                    });
                                    button.menu.picker.setValue(maxDate);
                            
                                    // Use ownerButton as the upward link. Menus *must have no ownerCt* - they are global floaters.
                                    // Upward navigation is done using the up() method.
                                    button.menu.ownerButton = button;
                                    me.maxDateVideo = me.dateToVideoURL (maxDate);
                                }
                            }
                        );
                    }
                }
            };
        
        me.control(config);
    }
});
