// import {listen} from "./libs/ol/events";

define(['marionette', 'collections'], function (Marionette, Collections) {
    var IconView = Marionette.View.extend({

        tagName: 'option',
        attributes: {
            'value': function () {
                return IconView.arguments['0'].model.attributes.id;
            },

            // 'selected': function () {
            //
            // }
        },
        template: _.template(`<%= title %>`)
    });


    // переделать с шаблоном чтобы отлавливать событие onRender

    var IconListView = Marionette.CollectionView.extend({
        tagName: 'select',
        id: 'icon-select',
        className: 'form-control',
        template: false,
        childView: IconView,
        initialize: function (model) {
            this.collection = new Collections.IconCollection();
            this.collection.fetch();
        }
    });

    return IconListView;

})


