Ext.define('Wyngate.DirectAPI', {
    requires: ['Ext.direct.*']
}, function() {
    var Loader = Ext.Loader,
        wasLoading = Loader.isLoading,
        location = window.location,
        suffixLength, URL, suffix;

    switch (location.hostname) {
        case "":
        case 'localhost':
        case '127.0.0.1':
            URL = 'http://localhost:3000/';
            break;
        default:
            URL = location.href;
            suffix = '/index.html';
            // If the URL ends with '/index.html', remove it
            suffixLength = suffix.length;
            if (URL.indexOf(suffix, URL.length - suffixLength) !== -1)
                URL = URL.slice(0, -(suffixLength - 1));
            break;
    }
    Loader.loadScript({
        url: URL + 'directapi',
        onLoad: function() {
            Loader.isLoading = wasLoading;

            // Add provider. Name must match settings on serverside
            Ext.direct.Manager.addProvider(ExtRemote.REMOTING_API);

        }
    });
});
