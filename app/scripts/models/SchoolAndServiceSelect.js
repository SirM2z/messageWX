/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.SchoolAndServiceSelect = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      cid: '',
      campus: '',
      slist: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
