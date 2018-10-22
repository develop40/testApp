define(['marionette', 'collections',
    'cardList', 'search', 'addCard', 'iconSelect', 'ol'],
    function (Marionette, Collections, MarkerListView, SearchView, AddFormView,
              IconListView) {


    var addBtn = Marionette.View.extend({
        template: _.template('<button id="show-form-btn"  class="btn">Добавить место</button>')

    });


    var MainView = Marionette.View.extend({

        initialize: function () {
            this.colMarker = new Collections.MarkerCollection();
            this.colMarker.fetch();

            this.viewMarkerCol = new MarkerListView(this.colMarker);


            this.search = new SearchView(this.colMarker);

            this.listenTo(this.colMarker, 'sync', this.addLayers);
        },

        addLayers: function () {

            window.vectorLayer = new window.ol.layer.Vector(
                {
                    source: window.vectorSource
                });
            // debugger

            window.map.addLayer(window.vectorLayer);
        },

        template: _.template($('#regions-template').html()),


        regions: {
            'markerList': '#marker-list-region',
            'searchRegion': '#search-region',
            'addRegion': '#add-region',
            'addFormRegion': '#add-form',

        },

        events: {
            'click #show-form-btn': 'renderAddForm'
        },

        renderAddForm: function () {
            var addView = new AddFormView(this.colMarker);
            this.showChildView('addFormRegion', addView);
        },


        // events: {
        //     'click #save-btn': 'addMarker'
        // },


        onRender: function () {

            this.addMap();
            this.showChildView('markerList', this.viewMarkerCol);

            this.showChildView('searchRegion', this.search);
//        this.showChildView('addRegion', new AddFormView(this.colMarker));
            this.showChildView('addRegion', new addBtn());


        },


        addMap: function () {

            var mousePositionControl = new window.ol.control.MousePosition({
                coordinateFormat: window.ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                className: 'custom-mouse-position',
                target: document.getElementById('mouse-position'),
                undefinedHTML: '&nbsp;'
            });


            window.map = new window.ol.Map({

                controls: window.ol.control.defaults({
                    attributionOptions: {
                        collapsible: false
                    }
                }).extend([mousePositionControl]),

                target: 'map',
                layers: [
                    new window.ol.layer.Tile({source: new window.ol.source.OSM()})
                ],


                view: new window.ol.View({

                    center: window.ol.proj.fromLonLat([39.7146, 47.2305]),
                    zoom: 17,
                    minZoom: 5,
                    maxZoom: 17
                })
            });

            window.vectorSource = new window.ol.source.Vector();
            // debugger
        }
    });

    return MainView;




});