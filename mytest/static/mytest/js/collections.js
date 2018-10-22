define(['models'], function (Models) {


return {
    MarkerCollection : Backbone.Collection.extend({
        url: '/marker/',
        model: Models.MarkerModel
    }),


    IconCollection : Backbone.Collection.extend({
        url: '/icon/',
        model: Models.IconModel
    }),


}
})