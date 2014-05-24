Ext.define('Wyngate.Application', {
    name: 'Wyngate',

    extend: 'Ext.app.Application',

    requires: ['Wyngate.DirectAPI'],

    views: [
        // TODO: add views here
    ],

    controllers: [
        'Wyngate.controller.Main'
    ],

    stores: [
        // TODO: add stores here
    ]
});
