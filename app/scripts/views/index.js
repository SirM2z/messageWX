/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Index = Backbone.View.extend({

    template: JST['app/scripts/templates/index.ejs'],

    tagName: 'div',

    el:'#index',
    
    myScroll:null,
    
    messageList:null,
    
    isFinish:false,

    events: {
      'click .ui-tab .ui-list>li>div':'gomessage'
    },

    initialize: function () {
      this.$el.off();
      App.g.studentEpage=1;
      this.isFinish=false;
      App.g.messageList = new App.Collections.MessageList();
      //获取学生留言列表
      var _this=this;
      this.getStudentMessageList(function(){
        _this.render();
      });
      
    },

    render: function () {
      if(App.g.messageList){
        this.messageList=App.g.messageList.toJSON();
      }
      this.$el.html(this.template({
        messageList:this.messageList,
        isreds:App.g.isreds,
        isFinish:this.isFinish
      }));
      if(this.messageList.length>4){
        //, bounceEasing: 'elastic', bounceTime: 1200
        var _this=this;
        setTimeout(function(){
          _this.myScroll = new IScroll('.index-wrapper', { mouseWheel: true, click: true });
          _this.myScroll.on('scrollEnd', function () {
            //如果滑动到底部，则加载更多数据（距离最底部10px高度）
            if ((this.y - this.maxScrollY) <= 0) {
              console.log('index-end');
              //getMore();
              if(_this.isFinish && !App.g.ajaxIng)return;
              _this.getStudentMessageList(function(list){
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
                  $('.index-wrapper .ui-list').append(str)
                  _this.myScroll.refresh();
                }
              });
            }
          });
        },100 );
      }
    },
    
    getStudentMessageList: function(callback){
      App.loading(true);
      var _selfthis=this;
      App.g.ajaxIng=true;
      $.ajax({
        url: App.URL.studentMessageList + '?studentkey='+ App.g.studentkey +'&token='+ App.g.token +'&epage='+ App.g.studentEpage +'&pagesize='+ App.g.pagesize,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            if(result.data.isreds==0 ||result.data.isreds==1){
              App.g.isreds=result.data.isreds;
              for(var i=0,ilen=result.data.list.length;i<ilen;i++){
                App.g.messageList.push(result.data.list[i]);
              }
            }else{
              App.g.isredsNo=0;
            }
            if(App.g.studentEpage*App.g.pagesize>=result.data.recordCount){
              _selfthis.isFinish=true;
              $('.index-wrapper #more').text('已无更多数据');
            }
            App.g.studentEpage++;
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
          Backbone.history.navigate('#', {trigger: true});
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
      App.loading();
    }
  });

})();



// <li class="ui-border-t">
//     <p><span class="color-1">建议</span><span class="date"> 2月12日</span><i>公共管理中心</i><span class="ui-reddot-s">已回复</span></p>
//     <div class="touched" >这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。这本书太赞了......</div>
// </li>
// <li class="ui-border-t">
//     <p><span class="color-1">建议</span><span class="date"> 2月12日</span><i>公共管理中心</i><span class="un-reply">待回复</span></p>
//     <div>这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。期待大结局。期待大结局。期待大结局。期待大结局。</div>
// </li>
// <li class="ui-border-t">
//     <p><span class="color-1">建议</span><span class="date"> 2月12日</span><i>公共管理中心</i><span class="un-reply">待回复</span></p>
//     <div>这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。</div>
// </li>