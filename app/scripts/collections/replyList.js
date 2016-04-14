/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.ReplyList = Backbone.Collection.extend({

    model: App.Models.Reply

  });

})();
