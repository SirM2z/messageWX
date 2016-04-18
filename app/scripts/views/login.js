/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Login = Backbone.View.extend({

    template: JST['app/scripts/templates/login.ejs'],

    tagName: 'div',
    
    el: '#login',

    events: {
      'click .login-btn':'login'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      
      if(localStorage.messageUsername){
        App.g.username=localStorage.messageUsername;
        App.g.password=localStorage.messagePassword;
      }
      
      this.$el.off();
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        username:App.g.username,
        password:App.g.password
      }));
    },
    
    login:function(){
      var _selfthis=this;
      var username = $('#username'),password = $('#password');
      // username.val('admin2');
      // password.val('admin2');
      // username.val('wang2');
      // password.val('test1');
      // username.val('admin1');
      // password.val('admin1');
      if(username.val().trim().length<1){
        $.tips({
          content:'请填写账号！',
          stayTime:2000,
          type:"warn"
        });
        username.focus();
        return;
      }else if(password.val().trim().length<1){
        $.tips({
          content:'请填写密码！',
          stayTime:2000,
          type:"warn"
        });
        password.focus();
        return;
      }
      App.loading(true);
      $.ajax({
        url:App.URL.login,
        data:{
          account:username.val().trim(),
          password:password.val().trim(),
          opencode:App.g.opencode
        },
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.code == 0){
            App.g.token = result.data.token;
            App.g.adminid = result.data.adminid;
            App.g.rolename = result.data.rolename;
            App.g.roletype = result.data.roletype;
            App.g.staffkey = result.data.staffkey;
            App.loading();
            if(App.g.roletype==2){
              Backbone.history.navigate('#adminIndex', {trigger: true});
            }else{
              //获取回复人员个人资料
              _selfthis.getReplyInfo();
              //Backbone.history.navigate('#replyIndex', {trigger: true});
              
            }
            App.g.username=username.val().trim();
            App.g.password=password.val().trim();
            localStorage.messageUsername=App.g.username;
            localStorage.messagePassword=App.g.password;
          }else{
            $.tips({
              content:result.msg,
              stayTime:2000,
              type:"warn"
            });
            App.loading();
          }
        },error:function(){
          $.tips({
            content:'登录失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    getReplyInfo: function(){
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.getReplyInfo + '?token='+ App.g.token,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.user=new App.Models.User(result.data);
            Backbone.history.navigate('#replyIndex', {trigger: true});
            App.loading();
          } else {
            $.tips({
              content: result.msg,
              stayTime: 2000,
              type: "warn"
            });
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取个人信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#login', {trigger: true});
          App.loading();
        }
      });
    }

  });

})();
