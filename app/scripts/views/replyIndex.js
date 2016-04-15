/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.ReplyIndex = Backbone.View.extend({

    template: JST['app/scripts/templates/replyIndex.ejs'],

    tagName: 'div',

    el:'#replyIndex',
    
    tab: null,
    
    myNoScroll:null,
    
    myHaveScroll:null,
    
    isFinishNoReply:false,
    
    isFinishHaveReply:false,

    events: {
      'click .ui-tab .ui-list>li>div':'gomessage',
      'click .ui-tab-nav li':'currentTab'
    },
    
    ajaxGetNum:2,
    
    ajaxGetCurrent:0,
    
    noReplyList:null,
    
    haveReplyList:null,

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      this.ajaxGetCurrent=0;
      this.ajaxGetNum=2;
      App.g.noReplyEpage=1;
      App.g.haveReplyEpage=1;
      this.isFinishNoReply=false;
      this.isFinishHaveReply=false;
      App.g.noReplyList = new App.Collections.ReplyList();
      App.g.haveReplyList = new App.Collections.ReplyList();
      var _this=this;
      //获取待回复列表
      this.getNoReply(function(){
        _this.ajaxGetCurrent++;
        _this.countGet();
      });
      //获取已回复列表
      this.getHaveReply(function(){
        _this.ajaxGetCurrent++;
        _this.countGet();
      });
      //this.render();
    },

    render: function () {
      if(App.g.noReplyList){
        this.noReplyList=App.g.noReplyList.toJSON();
      }
      if(App.g.haveReplyList){
        this.haveReplyList=App.g.haveReplyList.toJSON();
      }
      this.$el.html(this.template({
        isredsNo:App.g.isredsNo,
        noReplyList:this.noReplyList,
        isredsHave:App.g.isredsHave,
        haveReplyList:this.haveReplyList,
        isFinishNoReply:this.isFinishNoReply,
        isFinishHaveReply:this.isFinishHaveReply
      }));
      
      if(this.noReplyList.length>4){
        //, bounceEasing: 'elastic', bounceTime: 1200
        var _this=this;
        setTimeout(function(){
          _this.myNoScroll = new IScroll('.reply-wrapper-no', { mouseWheel: true, click: true });
          _this.myNoScroll.on('scrollEnd', function () {
            //如果滑动到底部，则加载更多数据（距离最底部10px高度）
            if ((this.y - this.maxScrollY) <= 0) {
              console.log('待回复end');
              //getMore();
              if(_this.isFinishNoReply && !App.g.ajaxIng)return;
              _this.getNoReply(function(list){
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
                  if(list[i].isred==1){
                    tmpStr+='ui-reddot-s ';
                  }
                  str+='<span class="un-reply '+tmpStr+'">待回复</span>';
                  str+='</p>';
                  var touchStr='';
                  if(list[i].isread==1){
                    touchStr+='touched';
                  }
                  str+='<div class="'+touchStr+'" data-id="'+list[i].id+'" >'+list[i].content+'</div>';
                  str+='</li>';
                  $('.reply-wrapper-no .ui-list').append(str)
                }
              });
            }
          });
        },100 );
      }
      
      if(this.haveReplyList.length>4){
        //, bounceEasing: 'elastic', bounceTime: 1200
        var _this=this;
        setTimeout(function(){
          _this.myHaveScroll = new IScroll('.reply-wrapper-have', { mouseWheel: true, click: true });
          _this.myHaveScroll.on('scrollEnd', function () {
            //如果滑动到底部，则加载更多数据（距离最底部10px高度）
            if ((this.y - this.maxScrollY) <= 0) {
              console.log('以回复end');
              //getMore();
              if(_this.isFinishHaveReply && !App.g.ajaxIng)return;
              _this.getHaveReply(function(list){
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
                  if(list[i].isred==1){
                    tmpStr+='ui-reddot-s ';
                  }
                  str+='<span class="'+tmpStr+'">已回复</span>';
                  str+='</p>';
                  var touchStr='';
                  if(list[i].isread==1){
                    touchStr+='touched';
                  }
                  str+='<div class="'+touchStr+'" data-id="'+list[i].id+'" >'+list[i].content+'</div>';
                  str+='</li>';
                  $('.reply-wrapper-have .ui-list').append(str)
                }
              });
            }
          });
        },100 );
      }
      // this.tab = new fz.Scroll('.reply-tab', {
      //   role: 'tab'
      // });
      // //重置tab的Scroll事件
      // this.tab._resize();
    },
    
    getNoReply:function(callback){
      App.loading(true);
      var _selfthis=this;
      App.g.ajaxIng=true;
      $.ajax({
        url: App.URL.getReplyList + '?staffkey='+ App.g.staffkey +'&token='+ App.g.token +'&epage='+ App.g.noReplyEpage +'&pagesize='+ App.g.pagesize +'&status=0',
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            if(result.data.isreds==0 ||result.data.isreds==1){
              App.g.isredsNo=result.data.isreds;
              for(var i=0,ilen=result.data.list.length;i<ilen;i++){
                App.g.noReplyList.push(result.data.list[i]);
              }
            }else{
              App.g.isredsNo=0;
            }
            if(App.g.noReplyEpage*App.g.pagesize>=result.data.recordCount){
              _selfthis.isFinishNoReply=true;
              $('.reply-wrapper-no #more').text('已无更多数据');
            }
            App.g.noReplyEpage++;
            callback(result.data.list)
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
            content: '获取待回复数据失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#login', {trigger: true});
          App.loading();
          App.g.ajaxIng=false;
        }
      });
    },
    
    getHaveReply:function(callback){
      App.loading(true);
      var _selfthis=this;
      App.g.ajaxIng=true;
      $.ajax({
        url: App.URL.getReplyList + '?staffkey='+ App.g.staffkey +'&token='+ App.g.token +'&epage='+ App.g.haveReplyEpage +'&pagesize='+ App.g.pagesize +'&status=1',
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            if(result.data.isreds==0 ||result.data.isreds==1){
              App.g.isredsHave=result.data.isreds;
              for(var i=0,ilen=result.data.list.length;i<ilen;i++){
                App.g.haveReplyList.push(result.data.list[i]);
              }
            }else{
              App.g.isredsHave=0;
            }
            if(App.g.haveReplyEpage*App.g.pagesize>=result.data.recordCount){
              _selfthis.isFinishHaveReply=true;
              $('.reply-wrapper-have #more').text('已无更多数据');
            }
            App.g.haveReplyEpage++;
            callback(result.data.list)
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
            content: '获取以回复数据失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#login', {trigger: true});
          App.loading();
          App.g.ajaxIng=false;
        }
      });
    },
    
    countGet:function(){
      if(this.ajaxGetCurrent==this.ajaxGetNum){
        App.loading();
        this.render();
      }
    },
    
    gomessage: function(event){
      event.stopPropagation();
      var _this=$(event.target);
      //console.log(_this);
      App.g.messageId=_this.data('id');
      //console.log(App.g.messageId);
      Backbone.history.navigate('#message',{trigger:true});
    },
    
    currentTab: function(event){
      var _this=$(event.target);
      if(_this.data('li')==1 && !_this.hasClass('current')){
        $('.current').removeClass('current');
        _this.addClass('current');
        $('#wrapper-have').addClass('hide');
        if($('#wrapper-no .ui-list li').length>0){
          $('#wrapper-no').removeClass('hide');
          $('.ui-notice').addClass('hide');
        }else{
          $('#wrapper-no').addClass('hide');
          $('.ui-notice').removeClass('hide');
        }
        if(this.myNoScroll){
          this.myNoScroll.refresh();
        }
      }
      if(_this.data('li')==2 && !_this.hasClass('current')){
        $('.current').removeClass('current');
        _this.addClass('current');
        $('#wrapper-no').addClass('hide');
        if($('#wrapper-have .ui-list li').length>0){
          $('#wrapper-have').removeClass('hide');
          $('.ui-notice').addClass('hide');
        }else{
          $('#wrapper-have').addClass('hide');
          $('.ui-notice').removeClass('hide');
        }
        if(this.myHaveScroll){
          this.myHaveScroll.refresh();
        }
      }
      
      
      // $('.current').removeClass('current');
      // _this.addClass('current');
      // $('.li-'+(3-parseInt(_this.data('li')))).addClass('hide');
      // $('.li-'+_this.data('li')).removeClass('hide');
    }

  });

})();


// <li class="ui-border-t">
//   <p><span class="color-1">建议</span><span class="date"> 2月12日</span></p>
//   <p><i>公共管理中心</i><span class="ui-reddot-s">已回复</span></p>
//   <div class="touched" >这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。这本书太赞了......</div>
// </li>
// <li class="ui-border-t">
//   <p><span class="color-1">建议</span><span class="date"> 2月12日</span></p>
//   <p><i>公共管理中心</i><span class="un-reply">待回复</span></p>
//   <div>这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。期待大结局。期待大结局。期待大结局。期待大结局。</div>
// </li>
// <li class="ui-border-t">
//   <p><span class="color-1">建议</span><span class="date"> 2月12日</span></p>
//   <p><i>公共管理中心</i><span class="un-reply">待回复</span></p>
//   <div>这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。</div>
// </li>


// <li class="ui-border-t">
//   <p><span class="color-1">建议</span><span class="date"> 2月12日</span></p>
//   <p><i>公共管理中心</i><span class="ui-reddot-s">已回复</span></p>
//   <div class="touched" >这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。这本书太赞了......</div>
// </li>
// <li class="ui-border-t">
//   <p><span class="color-1">建议</span><span class="date"> 2月12日</span></p>
//   <p><i>公共管理中心</i><span class="un-reply">待回复</span></p>
//   <div>这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。期待大结局。期待大结局。期待大结局。期待大结局。</div>
// </li>
// <li class="ui-border-t">
//   <p><span class="color-1">建议</span><span class="date"> 2月12日</span></p>
//   <p><i>公共管理中心</i><span class="un-reply">待回复</span></p>
//   <div>这本书太赞了，每次看都有不一样的体会和感悟，超级喜欢！期待大结局。</div>
// </li>