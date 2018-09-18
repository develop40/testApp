//------!!!!!!!--------------исправить success и добавить event sync в представления-----------------
//-------------------------желательно все переписать заново----------------------------------------
//-------------------------запихнуть поиск в collectionView---------------------------------------
//придумать что делать с маркерами
//добавить добавление элементов и обновлять представление коллекции
//добавить редактирование модели в коллекции, сделать выпадающую форму с заполненными данными и редактировать

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

//-----------------Backbone- Models-----------------------------------------------------------
var QuestionModel= Backbone.Model.extend({
    urlRoot: '/question/'
});

var QuestionCollection= Backbone.Collection.extend({
    model: QuestionModel,
    url: '/question/',

});

var ChoiceModel= Backbone.Model.extend({
    urlRoot: '/choice/'
});

var ChoiceCollection= Backbone.Collection.extend({
    url: '/choice/',
    model: ChoiceModel
});


var MarkerModel= Backbone.Model.extend({
    urlRoot: '/marker/'
});

var MarkerCollection= Backbone.Collection.extend({
    url: '/marker/',
    model: MarkerModel
});



//------------------------------------Marionette-View--------------------------------------------
var QuestionView = Marionette.View.extend({

    tagName: 'div',
    className: 'card',

    initialize: function(){

    },
//<div class="card" style="width: 18rem; ">
    template: _.template(`

                            <div class="card-header">
                           <%= question_text %>

                           <span class="date"> <%= pub_date %></span><input type='button' id="remove" value='-'>
                            <button class="btn btn-primary" type="button" data-toggle="collapse"
                                        data-target="#multiCollapseExample2" aria-expanded="false"
                                        aria-controls="multiCollapseExample2">	&#9998</button>
                            </div>
                          <ul class='list-group'>
                          <% for (ch in choices){ %>
                                <li class='list-group-item'><input type= "radio" name=<%=id%>> <%= choices[ch].choice_text %></input></li>

                                <%} %>
                           </ul>
                        `),
    events:{
         'click #remove': "onDelete",
    },

    onDelete: function(){
         this.model.destroy();
    }

});


var QuestionCollectionView= Marionette.CollectionView.extend({
   // tagName: "div",
   // id: '#list',

    childViewContainer: '#question-container',
    childView: QuestionView,
    template: _.template('<div id="question-container"></div>'),

    collectionEvents:{
        'sync': 'MyAlert',
    },

    MyAlert:function(){
            alert('model sync');
    },

    addOne: function(ad){
          var adView= new QuestionView({
                model: ad
          });
          this.$el.append(adView.render().el);
    }
});


var Markers= Marionette.MnObject.extend({
        initialize(){
            this.collection= new MarkerCollection();
            _this=this;
            this.collection.fetch({success: function(){_this.addLayers()}})
        },

         addLayers: function(){

//                var arrayFeature=[];
//                var count=0;
//
//                for(key in this.collection.models){
//
//                            var item = Number(key);
//
//                               var position= this.collection.models[item].get('point');
//
//
//                               var iconStyle = new ol.style.Style({
//                                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
//                                            anchor: [0.3, 1],
//                                            src: 'static/mytest/red-pushpin.png'
//                                            }))
//                                    });
//
//                                    var my_geom = this.collection.models[item].get('point').coordinates;//ol.proj.transform(this.collection.models[item].get('point').coordinates.reverse(),'EPSG:4326', 'EPSG:3857' );
//
//
//
//                                    var iconFeature= new ol.Feature({
//
//                                        geometry: new ol.geom.Point(my_geom).transform( 'EPSG:4326', 'EPSG:3857'),
//                                        name: 'tertretert' //this.collection.models[item].attributes.icon.title,
//
//                               });
//                               //iconFeature.setStyle(iconStyle);
//
//                               arrayFeature[count++]= iconFeature;
//                              //vectorSource.addFeature(iconFeature);
//                            }
//                              debugger;
////                            console.log(arrayFeature);
////                            debugger;
//                              var vectorSource= new ol.source.Vector({
//                                features: arrayFeature
//                              });
//
//                             var vectorLayer= new ol.layer.Vector({
//                                source: vectorSource,
//                                style: iconStyle
//                                 });
//
//                            window.map.addLayer(vectorLayer);

                   var position= this.collection.models[1].get('point');
                      var  arrayFeature= [];
                      var count=0;
                   this.collection.each(function(model){

                          var iconStyle = new ol.style.Style({
                            image: new ol.style.Icon(({
                            anchor: [0.3, 1],
                            src: 'static/mytest/red-pushpin.png'
                            }))
                          });

                        var iconFeature= new ol.Feature({

                            geometry: new ol.geom.Point(ol.proj.fromLonLat(model.get('point').coordinates)),
                             name: 'some',//this.model.get('id'),
                        });

                          iconFeature.setStyle(iconStyle);
                          arrayFeature[count++]=iconFeature;

                   });


                    var vectorSource= new ol.source.Vector({
                            features: arrayFeature

                    });


                    var vectorLayer= new ol.layer.Vector({
                            source: vectorSource,

                    });
                    debugger

                     window.map.addLayer(vectorLayer);

                    }






});



//--------------------------------------Search Question-------------------------------------------
var SearchResults= Backbone.Collection.extend({
      url: "/question/"

});


//-----------------------------------------------Search----------------------------------------------------------------------

var SearchView= Marionette.View.extend({

    template: _.template(`<nav class="navbar navbar-expand-lg navbar-light bg-light">

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <form class="form-inline my-2 my-lg-0">
      <input id= "input-search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <input type='button' id="button-search" class="btn btn-outline-success my-2 my-sm-0" value="search">
    </form>
  </div>
</nav>`),

        initialize: function(collection){
            this.collection= collection;
        },

    events:{
         'click #button-search': 'searchOn',
    },

    searchOn: function(){

        this.collection.url="/question/?search="+$('#input-search').val();
        this.collection.fetch({success: function(){

                        alert(this.collection)}}) ;
    }



//    onRender: function(){
//            let results= new SearchResults({search: 'what'});
//            debugger
//            results.fetch({success: function(){alert("find questions")}})
//
//    }

});





//------------------------------------------------------------Add Question------------------------------------------------------

var AddView= Marionette.View.extend({
    template: _.template(`<p><input type='text' id='title'>
                          <p><input type='text' id='description'>
                          <p><input type='text' id='point'>
                          <p><input type='button' id='add-btn' value='Добавить'>`),

    events:{
        'click #add-btn': 'addMarker'
    },

    addMarker: function(){
        debugger
        add= new MarkerModel({data:{type: 'Marker',attributes:{title: $('#title').val(),
                              description: $('#description').val(),
                              point: {type: 'point', coordinates: $('#point').val().split(',').map(string=>parseInt(string))},
                              choice: 2,
                              icon: 1}}});

         add.save();
    }
});


// -----------------------------------------------Main-----------------------------------------------------------------------
var MainView= Marionette.View.extend({
    id: "regions",
    template: _.template(`<div id='modals'>
                            </div><div id='main'> MAIN VIEW</div>
                            <div id='marker' ></div>
                            <div id='search'></div>
                            <div id='add'></div>`),
    //tagName: 'div',
    //id: 'main',

    regions:{
            'questionRegion': '#main',
            'markerRegion': '#marker',
            'searchRegion': '#search',
            'addRegion': '#add',
    },

   onRender:function(){


            let questions= new QuestionCollection();
            let _this=this;
            questions.fetch({success: function(){
                    let questionView= new QuestionCollectionView({collection: questions});
                    _this.showChildView('questionRegion', questionView)
            }
            });

             var markers= new Markers();


            var search= new SearchView(questions);
            this.showChildView('searchRegion', search);

            var addBtn= new AddView();
            this.showChildView('addRegion', addBtn);
            //var modals= new RemoveView();
            //this.showChildView('modalRegion', modals);
   }

});

//------------------------------------Application-code--------------------------------------------

const MyApplication= Marionette.Application.extend(
{
        region: '#main-region',

        onBeforeStart(){

                var layer = new ol.layer.Tile({
                      source: new ol.source.OSM(),
                      opacity: 0.6,
                      brightness: 0.2
                    });

            var center = ol.proj.transform([-1.812, 52.443], 'EPSG:4326', 'EPSG:3857');

            var overlay = new ol.Overlay({
                  element: document.getElementById('overlay'),
                  positioning: 'bottom-center'
                });

            var view = new ol.View({
                  center: center,
                  zoom: 6
                });

            window.map = new ol.Map({
                  renderer: 'canvas',
                  target: 'map',
                  layers: [layer],
                  view: view
                })
            },

        onStart(app, options){



                var view = new MainView();
                this.showView(view);


                Backbone.history.start();
        },
});

var my_app= new MyApplication();
my_app.start();


