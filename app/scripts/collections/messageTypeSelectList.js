/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.MessageTypeSelectList = Backbone.Collection.extend({

    model: App.Models.MessageTypeSelect

  });

})();
