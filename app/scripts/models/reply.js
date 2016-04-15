/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Reply = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      id: 1,
      content: '',
      sid: '',
      state: '',
      isread: 0,
      tname: '',
      colorid: '',
      isred: 1,
      key:'',
      createdate: ''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
