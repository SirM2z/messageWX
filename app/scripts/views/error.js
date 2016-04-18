/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Error = Backbone.View.extend({

    template: JST['app/scripts/templates/error.ejs'],

    tagName: 'div',
    
    el: '#error',

    events: {},

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
    }

  });

})();
