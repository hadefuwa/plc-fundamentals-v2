(function($) {
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
            $(this).css({
                'position': 'fixed',
                'z-index': '9999',
                'left': '0',
                'right': '0',
                [settings.position]: '0',
                'background-color': settings.background,
                'height': settings.height,
                'padding': settings.padding,
                'width': settings.width,
                'pointer-events': 'none',
                'user-select': 'none',
                '-webkit-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'touch-action': 'none',
                'will-change': 'transform'
            }).css(settings.style).html(settings.text);

            $(this).on('mouseover mouseout mousemove', function(e) {
                e.stopPropagation();
                return false;
            });
        });
    };
})(jQuery); 