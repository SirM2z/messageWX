/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.MessageDetail = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      id: 1,
      content: '',
      state: '',
      sid: '',
      createdate: '',
      tname: '',
      color: '',
      username:'',
      list: []
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
