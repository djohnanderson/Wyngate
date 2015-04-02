Ext.define('Wyngate.view.HTML5VideoPanel', {
    extend: 'Ext.panel.Panel',

    xtype: 'html5video',

    setSrc: function (src) {
        var video = this.video.dom;

        this.src = src;
        video.src = src;
        video.load();
        video.play();
    },

    initComponent: function() {
        var me = this;

        me.on ({
            beforedestroy: function() {
              me.video = null;
            },

            render: function() {
                var fallback = "Your browser doesn't support html5 video.",
                    size = me.getSize(),
                    config;

                /* match the video size to the panel dimensions */

                config = Ext.copyTo({
                    tag: 'video',
                    width: size.width,
                    height: size.height,
                    autoplay: false,
                    controls: true
                }, me, 'src, type, width, height, poster, start, loopstart, loopend, playcount, autobuffer, loop');

                /* just having the params exist enables them */
                if (me.autoplay)
                    config.autoplay = 1;
                if (me.controls)
                    config.controls = 1;

                /* handle multiple sources */
                if (Ext.isArray(me.src)) {
                    config.children = [];

                    Ext.Array.each(me.src, function(item) {
                        config.children.push(
                            Ext.applyIf({
                                tag: 'source'
                            }, item)
                        );
                    });

                    config.children.push({
                        html: fallback
                    });
                } else {
                    config.src = me.src;
                    config.html = fallback;
                }

                me.video = me.body.createChild(config);

                //resize the video once the size is known.
                me.video.dom.onloadedmetadata = function() {
                    me.ownerCt.updateLayout();
                    this.currentTime = 40;
                };
            }
        });

        me.callParent(arguments);
    }
});
