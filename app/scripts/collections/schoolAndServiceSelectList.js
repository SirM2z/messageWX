/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.SchoolAndServiceSelectList = Backbone.Collection.extend({

    model: App.Models.SchoolAndServiceSelect

  });

})();
