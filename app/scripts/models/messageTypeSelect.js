/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.MessageTypeSelect = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      tid: '',
      tname: ''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
