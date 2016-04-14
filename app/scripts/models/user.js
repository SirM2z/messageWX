/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.User = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      id: 1,
      jobnumber: '',
      contactmode: '',
      username: '',
      cname: '',
      sname: ''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
