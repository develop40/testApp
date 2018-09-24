//Оставить две таблицы в базе---ok
//Вывести карточки с маркерами и описанием--ok
//Добавить возможность добавления и редактирования маркеров, удаления--ok добавление!

//решить проблему обновления коллекции при измененнии модели ---ok
//решить проблему добавиления картинок при изменении маркера ХХХХ
//убирать вью изменения после сохранения---ok

//Добавить поиск по маркерам----- ok
//Отобразить маркеры на карте---ok

//---------------------templates-----------------------------------------------------
cardTemplate= _.template(`<div id="change-region"></div>

              <div class="card-header">
                  <%= title %> <input id='delete-btn' type='button' value='x'>
                               <input id='change-btn' type='button' value='*'>
              </div>
                    <ul class='list-group'>
                        <li class="list-group-item"><%=description %></li>
                        <li class="list-group-item"><%=point.coordinates %></li>
                    </ul>`);

markerContainer= _.template(`<div id='marker-container'></div>`);

regionsTemplate= _.template(`<div id='marker-list-region'></div>
                            <div id='search-region'></div>
                            <div id='add-region'></div>`);

searchTemplate= _.template(`<p><input type="search" id="search-marker" placeholder="Поиск по сайту">
                                <input type="button" id='search-btn' value="Найти"></p>`)

changeTemplate= _.template(`
            <p>Название
            <br><input type="text" id="name-marker" value=<%= title %>>
            <p>Описание
            <br><input type="text" id="description-marker" value= <%= description %>>
            <p>Координаты
            <br><input type="text" id="coordinates-marker" value= <%= point.coordinates%>>
            <p>Тип
            <div id="select-region"></div>
            </p>
            <p><input type="button" id="save-btn" value= Сохранить>
    `);


addFormTemplate= _.template(`
                <p>Название
                <br><input type="text" id="name-marker">
                <p>Описание
                <br><input type="text" id="description-marker">
                <p>Координаты
                <br><input type="text" id="coordinates-marker">
                <p>Тип
                <div id="select-region"></div>
                </p>
                <p><input type="button" id="save-btn" value= Сохранить>
                   `);




//---------------------auth token----------------------------------------------------
Backbone.old_sync = Backbone.sync
Backbone.sync = function(method, model, options) {

    var new_options =  _.extend({
        beforeSend: function(xhr) {
            var token = $('meta[name="csrf-token"]').attr('content');
            if (token) {xhr.setRequestHeader('Authorization', token);
                        xhr.setRequestHeader("Content-Type", "application/json");}
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


var IconModel= Backbone.Model.extend({
    urlRoot: '/icon/'
});

var IconCollection= Backbone.Collection.extend({
    url: '/icon/',
    model: IconModel
});


//---------------------views------------------------------------------------------------
// перенести сюда change и создавать маркеры здесь

var MarkerCardView= Marionette.View.extend({
    tagName: 'div',
    className: 'card',
    template: cardTemplate,
    changeList: {},

    initialize:function(){
        this.listenTo(this.model, 'change', this.render)
    },

    regions:{
      'addRegion': '#change-region'
    },

    events:{
        'click #delete-btn': 'onDelete',
        'click #change-btn': 'renderChangeForm',
    },



    childViewEvents:{
        'change:name': 'changeName',
        'change:description': 'changeDesc',
        'change:coordinates': 'changeCoord',
        'change:icon': 'changeIcon',
        'click:save': 'saveChanges'
    },

    onDelete: function(){
        this.model.destroy({wait: true});
    },


    changeName: function(){
        this.changeList.title=$('#name-marker').val();
    },

    changeDesc: function(){
        this.changeList.description=$('#description-marker').val();
    },

    changeCoord: function(){
        var point= {}
        point.type= "Point";
        point.coordinates=$('#coordinates-marker').val().split(',').map(string=>parseInt(string));
        this.changeList.point= point;//$('#coordinates-marker').val()
    },


     changeIcon: function(){
        this.changeList.icon=$('#icon-select').val();

            alert(this.changeList.icon)
    },


    saveChanges: function(){

        if(Object.keys(this.changeList).length !== 0){
        this.changeList.id= this.model.get('id');
        var data=this.changeList;
        _this=this;
        this.model.save(data,{'patch': true, success: function(){}, wait:true});
        }
       // this.destroy();
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

        //this.listenTo(this.collection, 'add', this.addOne)
    },


    onRender:function(){
            // this.collection.fetch();
         alert('collection render');
    },

//    addOne: function(model){
//        debugger
//
//        var view= new MarkerCardView(model);
//        //this.$el.append(view.render().el);
//    }
});

//---------------------------------------------select marker views------------------------------

var IconView= Marionette.View.extend({
    tagName: 'option',
    attributes: {
        'value': function () {
             return IconView.arguments['0'].model.attributes.id;
        },
        },
   template: _.template(`<%= title %>`)
});

var IconListView= Marionette.CollectionView.extend({
   tagName: 'select',
   id: 'icon-select',
   template: false,
   childView: IconView,
   initialize: function(){
        this.collection= new IconCollection();
        this.collection.fetch();
   }
});

//------------------------------------------change marker-------------------------------------

var ChangeFormView= Marionette.View.extend({
    changeList: {},

    template: changeTemplate,

    initialize: function(model){
        this.model=model;
    },

    regions:{
        'iconRegion': '#select-region'
    },

    events:{
        'click #save-btn': 'destroy'
    },


        triggers: {
            'change #name-marker': 'change:name',
            'change #description-marker': 'change:description',
            'change #coordinates-marker': 'change:coordinates',
            'change #icon-select': 'change:icon',
            'click #save-btn': 'click:save'
        },

    onRender: function(){
        this.showChildView('iconRegion', new IconListView())
    }
});


//---------------------------------add marker--------------------------------------------
var AddFormView= Marionette.View.extend({
    template: addFormTemplate,

    initialize:function(collection){
        this.collection=collection;
        this.newModel= new MarkerModel();
        this.listenTo(this.newModel, 'sync', this.alarm);
    },

    regions:{
        'iconRegion': '#select-region'
    },

    onRender: function(){
        this.showChildView('iconRegion', new IconListView())
    },

    events:{
        'click #save-btn': 'addMarker'
    },

    alarm: function(){
            alert("add model in col");
            this.collection.add(this.model.attributes);
    },

    addMarker: function(){

        //var newModel= new MarkerModel()

        if ($('#name-marker').val()!='')
            {this.newModel.set('title', $('#name-marker').val())}

        if ($('#description-marker').val()!='')
            {this.newModel.set('description', $('#description-marker').val())}

        if ($('#coordinates-marker').val()!='')
            {   var point={}
                point.type= "Point";
                point.coordinates=$('#coordinates-marker').val().split(',').map(string=>parseInt(string));
                this.newModel.set('point', point);
            }


       this.newModel.set('icon', $('#icon-select').val());
       //возможно использовать addOne, но это не точно

        this.newModel.save({wait:true} ,{success: function(){}});

    }
});

//----------------------------------search marker----------------------------------------

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

//----------------------------------create map and show markers-----------------------------

var Markers = Marionette.MnObject.extend({
   initialize: function(collection){

        this.collection= collection;
//       _this=this;
//        this.collection.fetch({success: function(){_this.addMap(); _this.addLayers()}})
   },

   addMap: function(){
        window.map= new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({ source: new ol.source.OSM()})
            ],


            view: new ol.View({
                //projection: 'EPSG:3857',
                center: ol.proj.fromLonLat( [39.7146 ,47.2305]),
                zoom: 0
            })
        });
  }
  ,


   addLayers: function(){

    var arrayFeature=[];
    var count= 0;

    this.collection.each(function(model){
        var point= model.get('point').coordinates;
       // alert(point);

         let iconFeature= new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(point))
            });

         let iconStyle= new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.3,1],
                src: model.get('icon').path
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

            }

});

//-------------------------------------main view----------------------------------------

var MainView= Marionette.View.extend({

   initialize:function(){
         this.colMarker= new MarkerCollection();
         this.colMarker.fetch();

         this.viewMarkerCol= new MarkerListView(this.colMarker);
         this.search= new SearchView(this.colMarker);
         this.obj= new Markers(this.colMarker)
         this.obj.addMap();


        // this.listenTo(this.colMarker, 'sync', this.renderCol)
   },

  template: regionsTemplate,


//    renderCol:function(){
//        alert('renderCol');
//        this.showChildView('markerList', this.viewMarkerCol);
//
//
//        if(window.map.getLayers().array_.length>=2){
//                //debugger
//                dropLayer=window.map.getLayers().array_.pop();
//                window.map.removeLayer(dropLayer);
//            }
//        this.obj.addLayers()
//
//    },

  regions:{
      'markerList': '#marker-list-region',
      'searchRegion': '#search-region',
      'addRegion': '#add-region',
  },


 events:{
        'click #save-btn': 'addMarker'
    },



  onRender: function(){

     // this.showChildView('markerList', this.viewMarkerCol);
                this.showChildView('markerList', this.viewMarkerCol);

      this.showChildView('searchRegion', this.search);

      this.showChildView('addRegion', new AddFormView(this.colMarker));


  }
});


var MyApp= Marionette.Application.extend({
    region: '#main-region',


    onStart(){

     // obj.addMap();
      this.showView(new MainView());
      Backbone.history.start();
    }
});

var app= new MyApp();
app.start();