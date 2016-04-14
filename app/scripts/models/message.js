/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Message = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      id: 1,
      content: '',
      state: '',
      isread: 0,
      isred: 0,
      sid: '',
      tname:'',
      colorid:'',         
      createdate: ''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
