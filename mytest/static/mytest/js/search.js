define(['marionette'], function (Marionette) {

    var SearchView = Marionette.View.extend({
        template: _.template($('#search-template').html()),

        initialize: function (collection) {
            this.collection = collection;
        },

        events: {
            'click #search-btn': 'searchOn',
        },

        searchOn: function () {
            this.collection.url = '/marker/?search=' + $('#search-marker').val();
            this.collection.fetch();
        }
    });
return SearchView;
})