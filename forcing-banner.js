// Make this a module that can be imported in all pages
const ForcingBanner = {
    lastState: false,  // Track last shown state
    lastCount: 0,      // Track last count
    
    init: function() {
        // Create the banner div if it doesn't exist
        if (!$('#forcing-banner').length) {
            $('body').prepend('<div id="forcing-banner"></div>');
        }

        // Initialize the notification banner (hidden by default)
        $("#forcing-banner").notificationBanner({
            text: "⚠️ FORCING ACTIVE - 0 points currently forced",
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
                position: "fixed",     // Make sure it's fixed
                pointerEvents: "none", // Ignore mouse events
                zIndex: 9999,         // Keep on top
                userSelect: "none"     // Prevent text selection
            }
        });

        // Add additional CSS to prevent interactions
        $('body').on('mouseover mouseout', '#forcing-banner', function(e) {
            e.stopPropagation();
            return false;
        });
    },

    update: function(data) {
        if (data && data.stats) {
            const isForcing = data.stats.forcingActive;
            const count = data.stats.forcedCount || 0;

            // Only update if state or count has changed
            if (this.lastState !== isForcing || this.lastCount !== count) {
                if (isForcing) {
                    const pointText = count === 1 ? 'point' : 'points';
                    $("#forcing-banner")
                        .html(`⚠️ FORCING ACTIVE - ${count} ${pointText} currently forced`)
                        .stop(true, true)  // Stop any current animations
                        .slideDown(300);    // Slower, smoother animation
                } else {
                    $("#forcing-banner")
                        .stop(true, true)   // Stop any current animations
                        .slideUp(300);      // Slower, smoother animation
                }
                
                // Update tracking variables
                this.lastState = isForcing;
                this.lastCount = count;
            }
        }
    }
};

// Export the module
module.exports = ForcingBanner; 