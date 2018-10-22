define(['marionette','card'], function (Marionette, MarkerCardView) {

    var MarkerListView = Marionette.CollectionView.extend({
        childView: MarkerCardView,
        childViewContainer: '#marker-container',
        id: 'marker-list',
        template: _.template(`<div id='marker-container'></div>`),

        initialize: function (collection) {
            this.collection = collection;
            // this.listenTo(this.collection, 'add', this.addLayers)
        },

//    addLayers: function(){
//        alert('add layer');
//      //  debugger
//    },

        onRender: function () {
            //alert('collection render');
            debugger
        },

    });

return MarkerListView;

})