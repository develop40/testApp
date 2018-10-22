define(['marionette', 'mainView'], function (Marionette, MainView) {

    Backbone.old_sync = Backbone.sync
    Backbone.sync = function (method, model, options) {

        var new_options = _.extend({
            beforeSend: function (xhr) {
                var token = $('meta[name="csrf-token"]').attr('content');
                if (token) {
                    xhr.setRequestHeader('Authorization', token);
                    xhr.setRequestHeader("Content-Type", "application/json");
                }
            }
        }, options)
        return Backbone.old_sync(method, model, new_options);
    };

    var MyApp = Marionette.Application.extend({
        region: '#main-region',

        onBeforeStart(){
          require(['ol'], function () {

          })  ;
        },
        onStart() {
            var view = new MainView();
            this.showView(view);


            Backbone.history.start();
        }
    });

        return MyApp;
})