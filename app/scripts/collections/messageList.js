/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.MessageList = Backbone.Collection.extend({

    model: App.Models.Message

  });

})();
