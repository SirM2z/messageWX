/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.AdminIndex = Backbone.View.extend({

    template: JST['app/scripts/templates/adminIndex.ejs'],

    tagName: 'div',

    el:'#adminIndex',
    
    myScroll:null,
    
    adminMessageList:null,
    
    isFinish:false,

    events: {
      'click .ui-tab .ui-list>li>div':'gomessage'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      App.g.adminEpage=1;
      this.isFinish=false;
      App.g.adminMessageList= new App.Collections.MessageList();
      //获取留言板列表
      var _this=this;
      this.getAdminReply(function(){
        _this.render();
      });
      
      //this.render();
    },

    render: function () {
      if(App.g.adminMessageList){
        this.adminMessageList=App.g.adminMessageList.toJSON();
      }
      this.$el.html(this.template({
        isreds:App.g.isreds,
        adminMessageList:this.adminMessageList,
        isFinish:this.isFinish
      }));
      if(this.adminMessageList.length>4){
        //, scrollbars: true, bounceEasing: 'elastic', bounceTime: 1200
        var _this=this;
        setTimeout(function(){
          _this.myScroll = new IScroll('.admin-wrapper', { mouseWheel: true, click: true });
          _this.myScroll.on('scrollEnd', function () {
            //如果滑动到底部，则加载更多数据（距离最底部10px高度）
            if ((this.y - this.maxScrollY) <= 0) {
              console.log('admin-end');
              //getMore();
              if(_this.isFinish && !App.g.ajaxIng)return;
              _this.getAdminReply(function(list){
                for(var i=0,ilen=list.length;i<ilen;i++){
                  var str='';
                  str+='<li class="ui-border-t">';
                  str+='<p>';
                  str+='<span class="color-'+list[i].colorid+'">'+list[i].tname+'</span>';
                  str+='<span class="date">'+list[i].createdate+'</span>';
                  str+='</p>';
                  str+='<p>';
                  str+='<i>'+list[i].sid+'</i>';
                  var tmpStr='';
                  if(list[i].state==0){
                    tmpStr+='un-reply ';
                  }
                  if(list[i].isred==1){
                    tmpStr+='ui-reddot-s ';
                  }
                  var tmpStr1='';
                  if(list[i].state==0){
                    tmpStr1+='待回复';
                  }else{
                    tmpStr1+='已回复';
                  }
                  str+='<span class="'+tmpStr+'">'+tmpStr1+'</span>';
                  str+='</p>';
                  var touchStr='';
                  if(list[i].isread==1){
                    touchStr+='touched';
                  }
                  str+='<div class="'+touchStr+'" data-id="'+list[i].id+'" >'+list[i].content+'</div>';
                  str+='</li>';
                  $('.admin-wrapper .ui-list').append(str)
                }
              });
            }
          });
        },100 );
      }
    },
    
    getAdminReply: function(callback){
      App.loading(true);
      var _selfthis=this;
      App.g.ajaxIng=true;
      $.ajax({
        url: App.URL.adminGetReply + '?staffkey='+ App.g.staffkey +'&token='+ App.g.token +'&epage='+ App.g.adminEpage +'&pagesize='+ App.g.pagesize,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            if(result.data.isreds==0 ||result.data.isreds==1){
              App.g.isreds=result.data.isreds;
              for(var i=0,ilen=result.data.list.length;i<ilen;i++){
                App.g.adminMessageList.push(result.data.list[i]);
              }
            }else{
              App.g.isreds=0;
            }
            if(App.g.adminEpage*App.g.pagesize>=result.data.recordcount){
              _selfthis.isFinish=true;
              $('.admin-wrapper #more').text('已无更多数据');
            }
            App.g.adminEpage++;
            callback(result.data.list)
            App.loading();
          } else {
            $.tips({
              content: result.msg,
              stayTime: 2000,
              type: "warn"
            });
            App.loading();
          }
          App.g.ajaxIng=false;
        }, error: function error() {
          $.tips({
            content: '获取列表信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#login', {trigger: true});
          App.loading();
          App.g.ajaxIng=false;
        }
      });
    },
    
    gomessage: function(event){
      event.stopPropagation();
      var _this=$(event.target);
      //console.log(_this);
      App.g.messageId=_this.data('id');
      //console.log(App.g.messageId);
      Backbone.history.navigate('#message',{trigger:true});
    }

  });

})();
