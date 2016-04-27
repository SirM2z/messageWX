/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Submessage = Backbone.View.extend({

    template: JST['app/scripts/templates/submessage.ejs'],

    tagName: 'div',

    id: '',

    el:'#submessage',
    
    messageTypeSelectList:null,
    
    schoolAndServiceSelectList:null,

    className: '',

    events: {
      'change .school-select':'schoolSelect',
      'click .sub-btn':'subBtn',
      'change .service-select':'serviceSelect',
      'keyup .suggessInfo':'suggessInfoKeyup'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      //获取留言类型  校区   服务中心  关联数据
      this.getAllSelects();
      
    },

    render: function () {
      if(App.g.messageTypeSelectList){
        this.messageTypeSelectList=App.g.messageTypeSelectList.toJSON();
      }
      if(App.g.schoolAndServiceSelectList){
        this.schoolAndServiceSelectList=App.g.schoolAndServiceSelectList.toJSON();
      }
      this.$el.html(this.template({
        messageTypeSelectList:this.messageTypeSelectList,
        schoolAndServiceSelectList:this.schoolAndServiceSelectList
      }));
    },
    
    getAllSelects: function(){
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.getAllSelectsOfSub + '?schoolcode='+ App.g.schoolcode +'&token='+ App.g.token,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.messageTypeSelectList = new App.Collections.MessageTypeSelectList();
            App.g.schoolAndServiceSelectList = new App.Collections.SchoolAndServiceSelectList();
            for(var i=0,ilen=result.data.tlist.length;i<ilen;i++){
              App.g.messageTypeSelectList.push(result.data.tlist[i]);
            }
            for(var i=0,ilen=result.data.clist.length;i<ilen;i++){
              App.g.schoolAndServiceSelectList.push(result.data.clist[i]);
            }
            _selfthis.render();
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
            content: '获取学期周数信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    schoolSelect: function(event){
      //event.target.options[event.target.options.selectedIndex].text;
      var _this=$(event.target);
      App.g.cid=_this.val().trim();
      $('.duty').val('');
      var serviceSelect=$('.service-select');
      serviceSelect.empty();
      serviceSelect.append('<option selected value="0">请选择服务单位</option>');
      for(var i=0,ilen=this.schoolAndServiceSelectList.length;i<ilen;i++){
        if(this.schoolAndServiceSelectList[i].cid==App.g.cid){
          for(var j=0,jlen=this.schoolAndServiceSelectList[i].slist.length;j<jlen;j++){
            serviceSelect.append('<option data-remarks="'+ this.schoolAndServiceSelectList[i].slist[j].remarks +'" value="'+ this.schoolAndServiceSelectList[i].slist[j].sid +'">'+ this.schoolAndServiceSelectList[i].slist[j].dutyname +'</option>');
          }
        }
      }
    },
    
    suggessInfoKeyup: function(){
      var textlen=$('.suggessInfo').val().length;
      $('.ui-textarea i').text(200-textlen);
    },
    
    serviceSelect: function(event){
      var duty=$('.duty');
      if($(event.target).val().trim()==0){
        duty.val('职责范围描述');
        return;
      }
      var option = $(event.target.options[event.target.options.selectedIndex]);
      duty.val(option.data('remarks')); 
    },
    
    subBtn: function(){
      var typeSelect=$('.type-select');
      if(typeSelect.val()==0){
        $.tips({
          content:'请选择留言类型！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      var schoolSelect=$('.school-select');
      if(typeSelect.val()==0){
        $.tips({
          content:'请选择校区！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      var serviceSelect=$('.service-select');
      if(typeSelect.val()==0){
        $.tips({
          content:'请选择服务单位！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      var suggessInfo=$('.suggessInfo');
      if(typeSelect.val().trim().length<=0){
        $.tips({
          content:'请填写您的意见！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      
      //新增留言
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.subMessage,
        data:{
          token:App.g.token,
          typeid:typeSelect.val(),
          cid:schoolSelect.val(),
          sid:serviceSelect.val(),
          studentid:App.g.studentid,
          content:suggessInfo.val().trim()
        },
        type:'POST',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.loading();
            Backbone.history.navigate('#index', {trigger: true});
      
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
            content: '提交建议失败，请稍后重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    }

  });

})();
