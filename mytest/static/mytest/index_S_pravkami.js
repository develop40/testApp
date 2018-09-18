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
    url: '/question/'
});

var QuestionCollection= Backbone.Collection.extend({
    model: QuestionModel,
    url: '/question/',

    /*initialize:function(){

            this.fetch({success:function(){
                //let questions_view= new QuestionCollectionView({collection: this});
                alert('collection');

            }});*/
  //  }
});

var ChoiceModel= Backbone.Model.extend({
    url: '/choice/'
});

var ChoiceCollection= Backbone.Collection.extend({
    url: '/choice/',
    model: ChoiceModel
});


//------------------------------------Marionette-View--------------------------------------------
var QuestionView= Mn.View.extend({
    tagName: 'li',

    template: _.template('<%= question_text %>'),

    onRender:function(){
           //var
    }


});


var QuestionCollectionView= Mn.CollectionView.extend({
    id: '#list',
    childViewContainer: '.parent-container',
    childView: QuestionView,
    template: _.template('<ul class="parent-container"></ul>'),

    addOne: function(ad){
          var adView= new QuestionView({
                model: ad
          });
          this.$el.append(adView.render().el);
    }
});

// Main
var MainView= Mn.View.extend({

   onRender:function(){}
});

//------------------------------------Application-code--------------------------------------------

const MyApplication= Mn.Application.extend(
{
    region: '#mainregion',


        onBeforeStart(app, options){

        },

        onStart(app, options){
        /*var questions= new QuestionCollection({model: QuestionModel});
            questions.fetch({success:function(){
                let questions_view= new QuestionCollectionView({collection: questions});
                alert('collection');
                app.showView(questions_view);
            }});*/

            var view = new _View();
                var questions= new QuestionCollection();

                alert('hello');
                let questions_view= new QuestionCollectionView({collection: questions});

                app.showView(questions_view);
                Backbone.history.start();
        },
});

var my_app= new MyApplication();
my_app.start();

