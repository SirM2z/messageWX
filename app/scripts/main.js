/*global app, $*/
//var APIServerHost= 'http://test.houqinbao.com/gyxt_api';
var APIServerHost= 'http://120.55.84.193/Geese_Quality_Supervision';

window.App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  loading: function loading(status) {
    if (status) {
      $('#loading').addClass('show').removeClass('hide');
    } else {
      $('#loading').addClass('hide').removeClass('show');
    }
  },
  g: {
    username:null,  //用户名
    password:null,  //用户密码
    opencode:null,  //微信唯一标识
    schoolcode:null,  //学校标识
    token:null, //调用接口凭证
    studentkey:null,  //绑定后唯一标识
    studentid:null, //学号
    pagesize:15,  //分页大小
    studentEpage:1,  //当前学生留言列表页码
    noReplyEpage:1,  //当前回复人员待回复列表页码
    haveReplyEpage:1,  //当前回复人员已回复列表页码
    adminReplyEpage:1,  //超级管理员留言板列表页码
    adminEpage:1,  //当前管理人员已留言列表页码
    adminid:null, //管理员id
    rolename:null, //登录人员类型
    staffkey:null, //登录人员key
    messageList:null, //App.Collections.MessageList学生留言列表
    adminMessageList:null, //App.Collections.MessageList超级管理员留言板列表
    messageId:null, //选择的当前留言id
    messageDetail:null, //App.Models.MessageDetail留言详情
    messageTypeSelectList:null, //App.Collections.MessageTypeSelectList留言类型列表
    schoolAndServiceSelectList:null, //App.Collections.SchoolAndServiceSelectList校区和服务中心关联列表
    cid:null, //当前选择的校区id
    noReplyList:null, //App.Collections.ReplyList待回复列表
    haveReplyList:null, //App.Collections.ReplyList已回复列表
    isreds:null,  //学生留言列表--我的--红点
    isredsNo:null,  //回复人员列表--已回复--红点
    isredsHave:null,  //回复人员列表--待回复--红点
    ajaxIng:false,  //是否在执行ajax
    roletype:null,  //登录人员类型
    currentTabReply:null,  //回复人员列表页 当前的tab 1为第一个 2为第二个
  },
  URL: {
    studentIsBinding:APIServerHost + '/personnel/student/studentisbinding/',  //获取学生绑定信息
    binding:APIServerHost + '/personnel/student/studentadd/', //学生绑定
    studentMessageList:APIServerHost + '/message/message/getmessageinfo/',  //获取学生留言列表
    studentMessageDetail:APIServerHost + '/message/message/messagedetails/',  //获取学生留言详情
    getAllSelectsOfSub:APIServerHost + '/basesetup/messagetype/messagemenu/',  //获取留言类型、校区、服务中心、关联数据
    subMessage:APIServerHost + '/message/message/messageadd/',  //新增留言
    login:APIServerHost + '/message/account/wxaccountlogin/',  //登录 +wx
    getReplyList:APIServerHost + '/message/message/getmessagetoreply/',  //获取回复人员回复列表
    getReplyInfo:APIServerHost + '/personnel/replystaf/personalinfo/',  //获取回复人员信息
    replyInfoSave:APIServerHost + '/personnel/replystaf/personalinfosave/',  //回复人员信息保存
    addReply:APIServerHost + '/message/message/messageinforeply/',  //新增回复  +type 0学生 1回复人员 超级管理员
    adminGetReply:APIServerHost + '/message/message/getsupermessageinfo/',  //超级管理员获取留言列表 +删除status参数
    
  },
  init: function () {
    'use strict';
    new this.Routers.Route();
    Backbone.history.start();
  }
};

$(document).ready(function () {
  'use strict';
  App.init();
});

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
Date.prototype.CHWeek = function(){
  switch (this.getDay()) {
    case 0: return '星期日';
    case 1: return '星期一';
    case 2: return '星期二';
    case 3: return '星期三';
    case 4: return '星期四';
    case 5: return '星期五';
    case 6: return '星期六';
  }
}

// 0 #4bb622  一般
// 1 #2772ee  普通
// 2 #f88311  紧急
// 3 #e11144  严重