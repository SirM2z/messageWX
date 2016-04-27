/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Message = Backbone.View.extend({

    template: JST['app/scripts/templates/message.ejs'],

    tagName: 'div',

    el: '#message',
    
    messageDetail:null,
    
    elOff:true,

    id: '',

    className: '',

    events: {
      'focus .ui-input-wrap input':'reply',
      'click .reply-btn':'replyBtn'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      if(this.elOff){
        this.$el.off();
      }
      
      this.getMessageDetail();
      
    },

    render: function () {
      this.messageDetail=null;
      if(App.g.messageDetail){
        this.messageDetail=App.g.messageDetail.toJSON();
      }
      this.$el.html(this.template({
        messageDetail:this.messageDetail
      }));
    },
    
    getMessageDetail:function(){
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url: App.URL.studentMessageDetail + '?token='+ App.g.token +'&id='+ App.g.messageId,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            App.g.messageDetail = new App.Models.MessageDetail(result.data);
            
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
            content: '获取详细留言信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          Backbone.history.navigate('#login', {trigger: true});
          App.loading();
        }
      });
    },
    
    reply: function(){
      //setTimeout(function(){ $(window).scrollTop(document.body.scrollHeight);},100)
    },
    
    replyBtn: function(){
      var replyMessage=$('.reply-message');
      if(replyMessage.val().trim()==""){
        $.tips({
          content: '请填写回复内容',
          stayTime: 2000,
          type: "warn"
        });
        return;
      }
      App.loading(true);
      var data={
        token:App.g.token,
        mid:App.g.messageId,
        replycontent:replyMessage.val().trim(),
        // staffkey:App.g.studentkey,
        // studentkey:App.g.studentkey,
      };
      if(App.g.roletype || App.g.roletype==0){
        data.type=1;
        if(App.g.roletype==2 && $('ul.other-reply').length==0){
          $.tips({
            content: '需等待回复人员先回复',
            stayTime: 2000,
            type: "warn"
          });
          App.loading();
          return;
        }
      }else{
        data.type=0;
      }
      var _selfthis=this;
      $.ajax({
        url: App.URL.addReply,
        data:data,
        type:'POST',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.code == '0') {
            _selfthis.elOff=false;
            _selfthis.initialize();
            //Backbone.history.navigate('#message', {trigger: true});
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
            content: '获取绑定信息失败，请稍后重试！',
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


// <ul class="ui-list ui-border-tb">
//     <li class="ui-border-t">
//       <div class="ui-avatar">
//         <span style="background-image:url(../../tx.png)"></span>
//       </div>
//       <div class="ui-list-info reply-head">
//         <p><span>祖国的花朵</span><i class="fright">公共管理中心</i></p>
//         <p><span> 2月12日 10:00</span><i class="fright asksuggess">咨询</i></p>
//       </div>
//     </li>
//     <div class="suggessinfo">&nbsp;&nbsp;&nbsp;&nbsp;运行这个例子，并在控制台输出属性，你可以看到集合中存储的是模型类的实例，而并非我们在数组中声明的原始数据。就已经设置了属性，该属性指向集合中存储的模型对象的构造函数。</div>
//   </ul>
//   <ul class="ui-list ui-border-tb other-reply">
//     <li class="ui-border-t">
//       <div class="ui-list-info">
//         <p><i>敬爱的杨老师</i></p>
//         <p><span>2月12日 10:00</span></p>
//       </div>
//       <div class="ui-avatar">
//         <span style="background-image:url(../../tx.png)"></span>
//       </div>
//     </li>
//     <div class="suggessinfo">&nbsp;&nbsp;&nbsp;&nbsp;运行这个例子，并在控制台输出属性，你可以看到集合中存储的是模型类的实例，而并非我们在s数组中声明的原始数据。</div>
//   </ul>
//   <ul class="ui-list ui-border-tb self-reply">
//     <li class="ui-border-t">
//       <div class="ui-avatar">
//         <span style="background-image:url(../../tx.png)"></span>
//       </div>
//       <div class="ui-list-info">
//         <p><i class="fright">祖国的花朵</i></p>
//         <p><span class="fright"> 2月12日 10:00</span></p>
//       </div>
//     </li>
//     <div class="suggessinfo">&nbsp;&nbsp;&nbsp;&nbsp;运行这个例子，你可以看到集合中存储的是模型类的实例，而并非我们在s数组中声明的原始数据。就已经设置了属性，该属性指向集合中存储的模型对象的构造函数。</div>
//   </ul>
  