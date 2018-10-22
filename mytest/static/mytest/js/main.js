require.config({

    deps: ["main"],

    paths:{
        backbone: 'libs/backbone',
        underscore: 'libs/underscore',
        jquery: 'libs/jquery-3.3.1',
        bootstrap: 'libs/bootstrap.min',
        ol: 'libs/ol/ol',
        "backbone.radio": 'libs/backbone.radio',
        marionette: 'libs/backbone.marionette',
        text: 'libs/text',
        tpl: 'libs/underscore-tpl'
        //index: "index"
    },

    shim:{

        jquery:{
          exports: 'jQuery'
        },

        underscore:{
            exports: "_"
        },

        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },

        marionette:{
            deps: ['backbone'],
             exports: 'Marionette'
        },

        bootstrap:{
            deps: ['jquery']
        },

        tpl: ["text"]

//# sourceMappingURL=ol.js.map

        // index:{
        //     deps: ["underscore", "jquery", "backbone", "marionette"],
        //     exports: 'MainView'
        // }
    }

});

// require(['app'], function (MyApp) {
//     var app= new MyApp();
//     app.start();
// });
//


require(['app'], function (MyApp) {
    var app = new MyApp();
    app.start();
});


// require(['marionette'], function () {
//     console.log('marionette load')
// });
//
// require(["marionette"], function () {
//     console.log('load');
//
//     //debugger
// });