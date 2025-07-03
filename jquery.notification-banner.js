// Wait for jQuery to be available
(function checkJQuery() {
    if (window.jQuery) {
        (function($) {
            'use strict';

            $.fn.notificationBanner = function(options) {
                var settings = $.extend({
                    text: "",
                    position: "top",
                    background: "#000000",
                    height: "auto",
                    padding: "10px",
                    width: "100%",
                    style: {}
                }, options);

                return this.each(function() {
                    // Create a container div that will stay fixed
                    const $container = $('<div>').addClass('notification-banner-container').css({
                        'position': 'fixed',
                        'z-index': '9999',
                        'left': '0',
                        'right': '0',
                        'top': '0',
                        'pointer-events': 'none',
                        'transform': 'translateZ(0)', // Force GPU acceleration
                        'backface-visibility': 'hidden',
                        '-webkit-backface-visibility': 'hidden'
                    });

                    // Style the banner itself
                    $(this)
                        .css({
                            'position': 'relative',
                            'background-color': settings.background,
                            'height': settings.height,
                            'padding': settings.padding,
                            'width': settings.width,
                            'user-select': 'none',
                            '-webkit-user-select': 'none',
                            '-moz-user-select': 'none',
                            '-ms-user-select': 'none',
                            'touch-action': 'none',
                            'transition': 'none', // Disable transitions
                            'animation': 'none'    // Disable animations
                        })
                        .css(settings.style)
                        .html(settings.text);

                    // Wrap the banner in the container
                    $(this).wrap($container);

                    // Block all mouse events
                    $(this).parent().add(this).on('mouseenter mouseleave mousemove mouseout mouseover', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                });
            };
        })(jQuery);
    } else {
        setTimeout(checkJQuery, 50);
    }
})(); 