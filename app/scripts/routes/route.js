/*global App, Backbone*/

App.Routers = App.Routers || {};

(function () {
  'use strict';

  App.Routers.Route = Backbone.Router.extend({
    routes: {
      'login/:opencode':'login',
      'bind':'bind',
      'index/:opencode/:schoolcode':'index',
      'submessage':'submessage',
      'message':'message',
      'replyIndex':'replyIndex',
      'adminIndex':'adminIndex',
      '*error' : 'index'
    },
    login: function(opencode){
      App.g.opencode = App.g.opencode || opencode;
      new App.Views.Login();
      $('.ui-header h1').text('登录');
      this.hidesection();
      $('#login').removeClass('hide');
      $('.ui-personal a').addClass('hide');
    },
    index: function(opencode,schoolcode){
      //console.log(opencode);
      //console.log(schoolcode);
      // App.g.opencode = App.g.opencode || opencode || 12345;
      // App.g.schoolcode = App.g.schoolcode || schoolcode || 11481;
      App.g.opencode = App.g.opencode || opencode;
      App.g.schoolcode = App.g.schoolcode || schoolcode;
      console.log(App.g.opencode);
      console.log(App.g.schoolcode);
      if(App.g.studentkey){
        new App.Views.Index();
        $('.ui-header h1').text('服务监督');
        this.hidesection();
        $('#index').removeClass('hide');
        return;
      }
      //验证学生是否绑定
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.studentIsBinding,
        data:{
          opencode:App.g.opencode,
          schoolcode:App.g.schoolcode
        },
        type:'POST',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.studentkey=result.data.studentkey;
            App.g.token=result.data.token;
            App.g.name=result.data.username;
            App.g.studentid=result.data.studentid;
            App.g.phone=result.data.telephone;
            
            App.loading();
            
            new App.Views.Index();
            $('.ui-header h1').text('服务监督');
            _selfthis.hidesection();
            $('#index').removeClass('hide');
      
          } else {
            if(result.code=="1000"){
              App.g.token=result.data.token;
              $.tips({
                content: result.msg,
                stayTime: 2000,
                type: "warn"
              });
              Backbone.history.navigate('#bind', {trigger: true});
            }else{
              $.tips({
                content: result.msg,
                stayTime: 2000,
                type: "warn"
              });
            }
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取绑定信息失败，请稍后重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    bind: function(){
      new App.Views.Bind();
      $('.ui-header h1').text('个人资料绑定');
      this.hidesection();
      $('#bind').removeClass('hide');
    },
    submessage: function(){
      new App.Views.Submessage();
      $('.ui-header h1').text('服务监督');
      this.hidesection();
      $('#submessage').removeClass('hide');
    },
    message: function(){
      new App.Views.Message();
      $('.ui-header h1').text('服务监督');
      this.hidesection();
      $('#message').removeClass('hide');
    },
    replyIndex: function(){
      new App.Views.ReplyIndex();
      $('.ui-header h1').text('服务监督');
      this.hidesection();
      $('#replyIndex').removeClass('hide');
      return;
    },
    adminIndex: function(){
      new App.Views.AdminIndex();
      $('.ui-header h1').text('服务监督');
      this.hidesection();
      $('#adminIndex').removeClass('hide');
      $('.ui-personal a').addClass('hide');
      return;
    },
    hidesection: function(){
      $('section').each(function(){
        $(this).addClass('hide')
      })
      $('.ui-personal a').removeClass('hide');
    }
  });

})();
