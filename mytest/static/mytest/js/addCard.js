define(['marionette', 'models', 'iconSelect'],
    function (Marionette, Models, IconListView) {

    var AddFormView = Marionette.View.extend({
        template:  _.template($('#add-form-template').html()) ,

        initialize: function (collection) {
            this.collection = collection;
            this.newModel = new Models.MarkerModel();
            this.listenTo(this.newModel, 'sync', this.alarm);
        },

        regions: {
            'iconRegion': '#select-region'
        },

        onRender: function () {
            debugger

            var sel= new IconListView();

            this.showChildView('iconRegion', new IconListView());

            window.map.on('click', function (evt) {

                $('#coordinates-marker').val(this.getControls().array_[3].element.outerText);
            });
        },

        events: {
            'click #save-btn': 'addMarker',
            'click #btn-close': 'closeWindow'
        },

        closeWindow: function () {
            this.destroy();
        },

        alarm: function () {

            this.collection.add(this.newModel.attributes);
            //alert("add model in col");
            this.destroy();
            // this.newModel.unset();
        },

        addMarker: function () {

            if ($('#name-marker').val() != '') {
                this.newModel.set('title', $('#name-marker').val())
            }

            if ($('#description-marker').val() != '') {
                this.newModel.set('description', $('#description-marker').val())
            }

            if ($('#coordinates-marker').val() != '') {
                var point = {}
                point.type = "Point";
                point.coordinates = $('#coordinates-marker').val().split(',').map(string => parseFloat(string));
                this.newModel.set('point', point);
            }


            this.newModel.set('icon', $('#icon-select').val());


            this.newModel.save({wait: true}, {
                success: function () {
                }
            });
        }
    });

    return AddFormView;

})