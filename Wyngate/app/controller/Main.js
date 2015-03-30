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
        selector: 'mainapp #dateButton',
        ref: 'dateButton'
    }, {
        selector: 'mainapp #datePicker',
        ref: 'datePicker'
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
                    ExtRemote.DXBackend.getVideoDates({},
                        function(result, event){
                            var datePicker = me.getDatePicker(),
                                maxDate;

                            if (event.status) {
                                maxDate = Ext.Date.parse(result.maxDate, 'm/d/Y');
                                datePicker.setMinDate(Ext.Date.parse(result.minDate, 'm/d/Y'));
                                datePicker.setMaxDate(maxDate);
                                datePicker.setDisabledDates(result.disabledDates);
                                datePicker.setValue(maxDate);
                                me.currentDate = maxDate;
                                cardLayout = me.getCardPanel().getLayout();
                                cardLayout.setActiveItem(me.getAppMain());
                            }
                        });
                }
            }
        );
    },

    setVideoForDate: function(date) {
        var videoPane = this.getVideoPane(),
            date = date || this.currentDate,
            videoURL;

        if (date) {
            this.currentDate = date;
            videoURL = 'resources/wyngate/image' + Ext.Date.format(date, 'y-m-d') + '/timelapse.mp4'; //'#t=25';
            videoPane.setSrc (videoURL);
        }
    },
    
    setEnableDates: function (end) {
        var provider = Ext.state.Manager.getProvider(),
            params = {};

        console.log (provider.get ('user'));
        params[end] = Ext.Date.format(this.currentDate, 'Y-m-d');
        ExtRemote.DXBackend.setEnableDates(params);
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
                        // start playing the most recent video if we don't have one showing yet.
                        me.setVideoForDate();
                    }
                },
                'mainapp #datePicker': {
                    select: function(picker, date) {
                        me.setVideoForDate(date);
                    }
                }
            };
        
        me.control(config);
        new Ext.util.KeyMap(Ext.get(document), [{
            key: Ext.event.Event.S,
            ctrl: true,
            fn: Ext.bind(me.setEnableDates, me, ['start'])
        }, {
            key: Ext.event.Event.E,
            ctrl: true,
            fn: Ext.bind(me.setEnableDates, me, ['end'])
        }]);
        
    }
});
