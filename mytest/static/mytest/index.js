//Оставить две таблицы в базе---ok
//Вывести карточки с маркерами и описанием--ok
//Добавить возможность добавления и редактирования маркеров, удаления--ok

//решить проблему обновления коллекции при измененнии модели ХХХХ
//решить проблему добавиления картинок при изменении маркера ХХХХ

//Добавить поиск по маркерам----- ok
//Отобразить маркеры на карте---ok

//---------------------templates-----------------------------------------------------
cardTemplate= _.template(`<div id="add-region"></div>

              <div class="card-header">
                  <%= title %> <input id='delete-btn' type='button' value='x'>
                               <input id='change-btn' type='button' value='*'>
              </div>
                    <ul class='list-group'>
                        <li class="list-group-item"><%=description %></li>
                        <li class="list-group-item"><%=point.coordinates %></li>
                    </ul>`);

markerContainer= _.template(`<div id='marker-container'></div>`);

regionsTemplate= _.template(`<div id='marker-list-region'></div><div id='search-region'></div>`);

searchTemplate= _.template(`<p><input type="search" id="search-marker" placeholder="Поиск по сайту">
                                <input type="button" id='search-btn' value="Найти"></p>`)





//---------------------auth token----------------------------------------------------
Backbone.old_sync = Backbone.sync
Backbone.sync = function(method, model, options) {

    var new_options =  _.extend({
        beforeSend: function(xhr) {
            var token = $('meta[name="csrf-token"]').attr('content');
            if (token) {xhr.setRequestHeader('Authorization', token);
                        xhr.setRequestHeader("Content-Type", "application/vnd.api+json");}
        }
    }, options)
    return Backbone.old_sync(method, model, new_options);
};
//---------------------models----------------------------------------------------------
var MarkerModel= Backbone.Model.extend({
    urlRoot: '/marker/',
    url: function(){
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id) + '/';
    }
});

var MarkerCollection= Backbone.Collection.extend({
    url: '/marker/',
    model: MarkerModel
});

//---------------------views------------------------------------------------------------

var MarkerCardView= Marionette.View.extend({
    tagName: 'div',
    className: 'card',
    template: cardTemplate,

    regions:{
      'addRegion': '#add-region'
    },

    events:{
        'click #delete-btn': 'onDelete',
        'click #change-btn': 'renderChangeForm',
    },

    onDelete: function(){
        this.model.destroy();
    },

    renderChangeForm: function(){
        changeForm= new ChangeFormView(this.model);
        this.showChildView('addRegion', changeForm);
    }
});


var MarkerListView= Marionette.CollectionView.extend({
    childView: MarkerCardView,
    childViewContainer: '#marker-container',
    template: _.template(`<div id='marker-container'></div>`),

    initialize: function(collection){
        this.collection= collection;
    },

//    collectionEvents:{
//        'sync': 'test'
//    },
//    test:function(){debugger},

    onRender:function(){
        this.collection.fetch();
    }
});


var ChangeFormView= Marionette.View.extend({
    changeList: {},
    template: _.template(`
            <p>Название
            <br><input type="text" id="name-marker" value=<%= title %>>
            <p>Описание
            <br><input type="text" id="description-marker" value= <%= description %>>
            <p>Координаты
            <br><input type="text" id="coordinates-marker" value= <%= point.coordinates%>>
            <p>Иконка
            <br><input type="text" id="icon-marker" value= <%= icon.id %>>
            <p><input type="button" id="save-btn" value= Сохранить>
    `),

    initialize: function(model){
        this.model=model;
    },

    events:{
        'change #name-marker': 'changeName',
        'change #description-marker': 'changeDesc',
        'change #coordinates-marker': 'changeCoord',
        //'change #icon-marker': 'changeIcon',
        'click #save-btn': 'saveChanges',
    },

    changeName: function(){
        this.changeList.title=$('#name-marker').val();

    },

    changeDesc: function(){
        this.changeList.description=$('#description-marker').val();
    },

    changeCoord: function(){
        this.changeList.coordinates= $('#coordinates-marker').val()
    },

//    changeIcon: function(){
//        this.changeList.icon= $('#icon-marker').val();
//        alert (changeList.icon)
//    },

    saveChanges: function(){
        for(var key in this.changeList){

            this.model.set(key, this.changeList[key]);
        }

        //this.changeList.id=this.model.get('id');
        var _id= this.model.get('id');
        var data=this.changeList;
       debugger
        this.model.save({'data':{'id':_id,'type':'Marker', 'attributes': data}}, {'patch': true});
    }
});


var SearchView= Marionette.View.extend({
   template: searchTemplate,

    initialize: function(collection){
        this.collection=collection;
    },

    events:{
        'click #search-btn': 'searchOn',
    },

    searchOn: function(){
        this.collection.url='/marker/?search='+ $('#search-marker').val();
        this.collection.fetch();
    }
});


var Markers = Marionette.MnObject.extend({
   initialize: function(){
        this.collection=new MarkerCollection();
        _this=this;
        this.collection.fetch({success: function(){_this.addMap(); _this.addLayers()}})
   },

   addMap: function(){
        window.map= new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({ source: new ol.source.OSM()})
            ],

            view: new ol.View({
                //projection: 'EPSG:3857',
                center: [0, 0],
                zoom: 0
            })
        });
   },


   addLayers: function(){

    var arrayFeature=[];
    var count= 0;

    this.collection.each(function(model){
        var point= model.get('point').coordinates;
        alert(point);

         let iconFeature= new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(point))
            });

         let iconStyle= new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.3,1],
                src: 'static/mytest/red-pushpin.png'
            }))
        });

        iconFeature.setStyle(iconStyle);

        arrayFeature[count++]=iconFeature;
    });

    let vectorSource= new ol.source.Vector();
    vectorSource.addFeatures(arrayFeature);

    let vectorLayer= new ol.layer.Vector({
            source: vectorSource
        });

    window.map.addLayer(vectorLayer);

    debugger


//
//    var point= this.collection.models[0].get('point').coordinates;
//    debugger
//
//        let iconFeature= new ol.Feature({
//            geometry: new ol.geom.Point(ol.proj.fromLonLat(point))
//            });
//
//         let iconFeature1= new ol.Feature({
//            geometry: new ol.geom.Point(ol.proj.fromLonLat([10,10]))
//         }) ;
//
//
//
//        let iconStyle= new ol.style.Style({
//            image: new ol.style.Icon(({
//                anchor: [0,0],
//                src: 'static/mytest/red-pushpin.png'
//            }))
//        });
//
//        iconFeature.setStyle(iconStyle);
//
//        iconFeature1.setStyle(iconStyle);
//
//
//        let vectorSource= new ol.source.Vector();
//        vectorSource.addFeature(iconFeature);
//        vectorSource.addFeature(iconFeature1);
//
//
////        let vectorSource= new ol.source.Vector({
////            features: [iconFeature]
////        });
//
//        let vectorLayer= new ol.layer.Vector({
//            source: vectorSource
//        });
//
//        window.map.addLayer(vectorLayer);

            }





});

var MainView= Marionette.View.extend({


  template: regionsTemplate,


  regions:{
      'markerList': '#marker-list-region',
      'searchRegion': '#search-region',
  },



  onRender: function(){

      this.colMarker= new MarkerCollection();
      this.viewMarkerCol= new MarkerListView(this.colMarker);
      this.showChildView('markerList', this.viewMarkerCol);
      this.search= new SearchView(this.colMarker);
      this.showChildView('searchRegion', this.search);

  }
});


var MyApp= Marionette.Application.extend({
    region: '#main-region',


    onStart(){
         var obj= new Markers();

      this.showView(new MainView());
      Backbone.history.start();
    }
});

var app= new MyApp();
app.start();
