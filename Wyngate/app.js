/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Wyngate.Application',

    name: 'Wyngate',

    requires: [
        // This will automatically load all classes in the Wyngate namespace
        // so that application classes do not need to require each other.
        'Wyngate.*'
    ],

    // The name of the initial view to create.
    mainView: 'Wyngate.view.main.CardPanel'
});
