define(['marionette', 'models', 'iconSelect'],
    function (Marionette,  Models, IconListView) {



    var MarkerCardView = Marionette.View.extend({
        tagName: 'div',
        className: 'card',
        template: _.template($('#card-template').html()),
        changeList: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.addMarkerOnMap(this.model);



        },

        regions: {
            'addRegion': '#change-region'
        },

        events: {
            'click #delete-btn': 'onDelete',
            'click #change-btn': 'renderChangeForm',
            'click': 'fly'
        },


        childViewEvents: {
            'change:name': 'changeName',
            'change:description': 'changeDesc',
            'change:coordinates': 'changeCoord',
            'change:icon': 'changeIcon',
            'click:save': 'saveChanges'
        },

        fly: function () {

            window.map.getView().animate({
                center: ol.proj.fromLonLat(this.model.get('point').coordinates),
                duration: 500
            });


        },

        onDelete: function () {
            this.model.destroy({wait: true});
            window.vectorSource.removeFeature(this.iconFeature);
        },


        changeName: function () {
            this.changeList.title = $('#name-marker').val();
        },

        changeDesc: function () {
            this.changeList.description = $('#description-marker').val();
        },

        changeCoord: function () {
                alert('coord');
            var point = {}
            point.type = "Point";
            point.coordinates = $('#coordinates-marker').val().split(',').map(string => parseFloat(string));
            this.changeList.point = point;
        },


        changeIcon: function () {
            this.changeList.icon = $('#icon-select').val();
            alert(this.changeList.icon)
            var icon = new Models.IconModel({id: this.changeList.icon});
        },


        saveChanges: function () {



            $('#change-btn').show();
            $('#delete-btn').show();

            if (Object.keys(this.changeList).length !== 0) {
                this.changeList.id = this.model.get('id');
                var data = this.changeList;
                _this = this;
                this.model.save(data, {
                    'patch': true, success: function () {
                    }, wait: true
                });

                if (this.changeList.icon) {
                    alert("icon");
                    var iconMap = new Models.IconModel({id: this.changeList.icon});
                    _this = this;
                    iconMap.fetch({
                        success: function (model) {
                            let iconStyle = new ol.style.Style({
                                image: new ol.style.Icon(({
                                    anchor: [0.3, 1],
                                    src: model.get('path')
                                }))
                            });
                            _this.iconFeature.setStyle(iconStyle);
                        }
                    });

                }
                if (this.changeList.point) {


                    let point = this.changeList.point;

                    let geometry = new ol.geom.Point(ol.proj.fromLonLat(point.coordinates));
                    this.iconFeature.setGeometry(geometry);

                }

            }

          //  this.getChildView('addRegion').destroy();


        },

        renderChangeForm: function () {


            var changeForm = new ChangeFormView(this.model);
            this.showChildView('addRegion', changeForm);

            $('#change-btn').hide();
            $('#delete-btn').hide();

        },

        addMarkerOnMap: function () {


            let point = this.model.get('point').coordinates;

            this.iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(point))
            });

            let iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.3, 1],
                    src: this.model.get('icon').path
                }))

            });

            window.vectorSource.addFeature(this.iconFeature);
            this.iconFeature.setStyle(iconStyle);

        }
    });


    var ChangeFormView = Marionette.View.extend({
        changeList: {},

        template: _.template($('#change-template').html()),

        initialize: function (model) {
            this.model = model;
        },

        regions: {
            'iconRegion': '#select-region'
        },

        events: {
            'click #save-btn': 'destroy'
        },


        triggers: {
            'change #name-marker': 'change:name',
            'change #description-marker': 'change:description',
            'change #coordinates-marker': 'change:coordinates',
            'change #icon-select': 'change:icon',
            'click #save-btn': 'click:save'
        },


        onDestroy: function(){
            debugger
            window.map.removeEventListener('click');
        },

        onRender: function () {
            this.showChildView('iconRegion', new IconListView());

            window.map.on('click', function (evt) {

                alert(evt.coordinate);

                $('#coordinates-marker').val(this.getControls().array_[3].element.outerText);
                $('#coordinates-marker').trigger('change');

               // map.un('singleclick');

            });


        }
    });

return MarkerCardView;

});