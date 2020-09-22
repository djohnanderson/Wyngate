Ext.define('Wyngate.view.main.CardPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cardPanel',

    onLogin: function(result) {
        var cardPanel = this.lookupReference('cardPanel'),
            videoCard = this.lookupReference('videoCard');

        if (videoCard) {
            cardPanel.setActiveItem(videoCard);
            videoCard.fireEvent('login', result);
        }
    },

    onLogout: function() {
        var cardPanel = this.lookupReference('cardPanel'),
            loginCard = this.lookupReference('loginCard');

        if (loginCard) {
            cardPanel.setActiveItem(loginCard);
        }
    }
});
