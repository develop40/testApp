var now = new Date();


//---------------------------Backbone-models-------------------------------
var QuestionModel= Backbone.Model.extend({
    urlRoot: '/question/'
});

var MarkerModel= Backbone.Model.extend({
    urlRoot: '/marker/'
});
//-----------------------------Backbone-collections--------------------------

var QuestionCollection= Backbone.Collection.extend({
    model: QuestionModel,
    url: '/question/',



});



//------------------------------Marionette-View------------------------------


var QuestionView= Marionette.View.extend({
      //el: "#list",
      template: _.template($("#question-list").html())
});

//----------------------------Marionette-Collection-View---------------------

var QuestionCollectionView= Marionette.CollectionView.extend({
      tagName: 'div',
      childView: QuestionView,


      addOne: function(ad){
            var adView= new MarkerView({
                    model: ad
            });
            this.$el.append(adView.render().el);
      }

});



//var question= new QuestionCollection();


var questions= new QuestionCollection();
$.when(
questions.fetch({
    success: function(){
        alert('collection');
    }
})).then(function(){var myview= new QuestionCollectionView({collection: questions})});

var my_app= new Marionette.Application({
      mainRegion: "#main-region",

      onBeforeStart(app, options){
            this.collection= new QuestionCollection();
            this.collection
      }
});

my_app.start();




//------------------------------------------------------------------------------------------------

/*var question= new QuestionModel({id: 1});

$.when(question.fetch()).then(function(){ var myview= new QuestionView({model: question});
debugger
myview.render();
alert('rewrewrwer');
});
*/


/* этот код работает, не удалять

var q= new QuestionModel({
'data': {
'type': 'Question',
'attributes' : {
'pub_date': now,
'question_text': "hello",
},
}
});

q.save( null, {
headers:{
'Authorization': 'Token 49aaacb80a28cf9f15556a3f084ad5b33e91f13f',
'Content-Type': 'application/vnd.api+json'
}
,
success: function(){
alert('ok');
}
});
*/

/*var loadInitialData= function(col){
    col.fetch({
    success: function(){
        alert('collection');
    }});
    return Promise.resolve();
};
*/


/*var app= new Marionette.Application();

app.on('start', function(){
    Backbone.history.start();
});

var question= new QuestionCollection();

loadInitialData(question).then(app.start);

*/


//-------------------------------map-------------------------------------------


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




        var map = new ol.Map({
          renderer: 'canvas',
          target: 'map',
          layers: [layer],
          view: view
        });

var checkbox= document.querySelector('#visible');

checkbox.addEventListener('change', function(){
    var checked = this.checked;
    if(checked!== layer.getVisible()){
        layer.setVisible(checked);
    }}
);

layer.on('change:visible', function(){
    var visible=this.getVisible();
    if(visible!==checkbox.checked){
        checkbox.checked= visible;
    }
});





map.on("click", function(event){

   var position=event.coordinate;
   // var icon= new ol.style.Icon({src: 'http://maps.google.com/mapfiles/ms/icons/red-pushpin.png'});
    //var coord= event.coordinate;
   // alert(coord);

     var iconFeature= new ol.Feature({
        geometry: new ol.geom.Point(position),
        name: 'some point',
        population: 4000,
        rainfall: 500
    });

           var vectorSource= new ol.source.Vector({
            features: [iconFeature]
       });

        var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
           anchor: [0.3, 1],
           // anchorXUnits: 'fraction',
            //anchorYUnits: 'pixels',
            //opacity: 0.75,
             src: 'static/mytest/red-pushpin.png'
          }))
          });

var vectorLayer= new ol.layer.Vector({
            source: vectorSource,
            style: iconStyle });


map.addLayer(vectorLayer);
//, point: {type: "Point", coordinates: position}
var marker= new MarkerModel({

'data': {
'type': 'Marker',
'attributes':{
'choice': 2,
'title': 'newmarker',
 'description': 'lollolo',
 'point' :{
        'type': 'Point',
        'coordinates': position
 }
}
}});


marker.save( null, {
headers:{
'Authorization': 'Token 49aaacb80a28cf9f15556a3f084ad5b33e91f13f',
'Content-Type': 'application/vnd.api+json'
}
,
success: function(){
alert('add marker');
}
});

});

