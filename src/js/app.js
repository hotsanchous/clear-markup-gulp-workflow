(function($, APP, undefined) {

    /**
     * Контроллер приложения, запускает контроллеры страниц
     **/
    APP.Controls.Application = can.Control.extend({

        /**
         *
         **/
        init: function() {
            this.initPageController();

            $('body').each(function(i, el) {
                new APP.Controls.Layout(el);
            });
        },

        /**
         *
         **/
        initPageController: function() {
            var pagePlugin = can.capitalize(can.camelize(this.element.data('page-type')));

            if (APP.Controls.Page[pagePlugin]) {
                new APP.Controls.Page[pagePlugin](this.element);
            }
        }
    });

    /**
     * Bootstrap
     */
    $(function() {
        new APP.Controls.Application($('main'));
    });

})(jQuery, window.APP);