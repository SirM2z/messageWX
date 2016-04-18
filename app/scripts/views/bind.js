/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Bind = Backbone.View.extend({

    template: JST['app/scripts/templates/bind.ejs'],

    tagName: 'div',

    el:'#bind',
    
    name:null,
    
    studentid:null,
    
    phone:null,
    
    user:null,

    events: {
      'click .bind-btn':'bindRoom',
      'click .bind-cancle':'cancleBind',
      'click .bind-sure':'sureBind',
      'click .replySave-btn':'replySaveBtn'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      this.render();
    },

    render: function () {
      if(App.g.user){
        this.user=App.g.user.toJSON();
      }
      if(App.g.name){
        this.name=App.g.name
      }
      if(App.g.studentid){
        this.studentid=App.g.studentid
      }
      if(App.g.phone){
        this.phone=App.g.phone
      }
      this.$el.html(this.template({
        name:this.name,
        studentid:this.studentid,
        phone:this.phone,
        user:this.user
      }));
    },
    
    bindRoom: function(){
      var name=$('.bind-name');
      if(!name.val().trim()){
        $.tips({
          content: '请填写姓名',
          stayTime: 2000,
          type: "warn"
        });
        name.focus();
        return;
      }
      var studentcode=$('.bind-studentcode');
      if(!studentcode.val().trim()){
        $.tips({
          content: '请填写学号',
          stayTime: 2000,
          type: "warn"
        });
        studentcode.focus();
        return;
      }
      var phone=$('.bind-phone');
      if(!phone.val().trim()){
        $.tips({
          content: '请填写联系方式',
          stayTime: 2000,
          type: "warn"
        });
        phone.focus();
        return;
      }
      App.g.name=name.val().trim();
      App.g.studentid=studentcode.val().trim();
      App.g.phone=phone.val().trim();
      $('.bind-dialog').dialog("show");
    },
    
    cancleBind:function(){
      $('.bind-dialog').dialog("hide");
    },
    
    sureBind:function(){
      $('.bind-dialog').dialog("hide");
      //学生信息绑定
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.binding,
        data:{
          token:App.g.token,
          schoolcode:App.g.schoolcode,
          username:App.g.name,
          studentid:App.g.studentid,
          telephone	:App.g.phone,
          opencode:App.g.opencode,
        },
        type:'POST',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.studentkey=result.data.studentkey;
            $.tips({
              content: '信息绑定成功',
              stayTime: 2000,
              type: "warn"
            });
            App.loading();
            Backbone.history.navigate('#', {trigger: true});
      
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
            content: '获取绑定信息失败，请稍后重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    replySaveBtn: function(){
      var replyPhone=$('.reply-phone');
      if(replyPhone.val().trim().length<1){
        $.tips({
          content:'请填写联系方式！',
          stayTime:2000,
          type:"warn"
        });
        replyPhone.focus();
      }
      //回复人员联系方式更新
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.replyInfoSave,
        data:{
          token:App.g.token,
          id:App.g.adminid,
          contactmode:replyPhone.val().trim()
        },
        type:'POST',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.loading();
            $.tips({
              content:'保存成功！',
              stayTime:2000,
              type:"success"
            });
            App.g.user.set("contactmode", replyPhone.val().trim());
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
            content: '获取绑定信息失败，请稍后重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    }

  });

})();
