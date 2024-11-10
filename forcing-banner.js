console.log('Forcing banner script started');

window.ForcingBanner = {
    lastState: false,
    lastCount: 0,
    
    init: function() {
        if (!$('#forcing-banner').length) {
            $('body').prepend('<div id="forcing-banner"></div>');
        }

        $("#forcing-banner").notificationBanner({
            text: "⚠️ Warning: Forcing Active - Currently 0 IO Are Being Forced",
            position: "top",
            background: "#dc3545",
            height: "30px",
            padding: "15px",
            width: "100%",
            style: {
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                display: "none",
                position: "fixed",
                pointerEvents: "none",
                zIndex: 9999,
                userSelect: "none"
            }
        });

        $('body').on('mouseover mouseout', '#forcing-banner', function(e) {
            e.stopPropagation();
            return false;
        });
    },

    update: function(data) {
        if (data && data.stats) {
            const isForcing = data.stats.forcingActive;
            const count = data.stats.forcedCount || 0;

            if (this.lastState !== isForcing || this.lastCount !== count) {
                if (isForcing) {
                    const ioText = count === 1 ? 'IO Is' : 'IO Are';
                    $("#forcing-banner")
                        .html(`⚠️ Warning: Forcing Active - Currently ${count} ${ioText} Being Forced`)
                        .stop(true, true)
                        .slideDown(300);
                } else {
                    $("#forcing-banner")
                        .stop(true, true)
                        .slideUp(300);
                }
                
                this.lastState = isForcing;
                this.lastCount = count;
            }
        }
    }
};

console.log('ForcingBanner object created:', window.ForcingBanner);