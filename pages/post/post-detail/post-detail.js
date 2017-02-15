var localDB = require("../../../data/localDB.js");
var app=getApp();
//小程序的理念是数据优先，没有DOM的概念，事件触发时的运行上下文就page，并且success、fail回调函数的执行上下文并不是page，实际上this就指向在事件上注册的监听函数本身 没错。。 this指向这个function 所以有必要用作用域链来引入page；
Page({
    data: {
    },
    
    onLoad: function (option) {
        // 生命周期函数--监听页面加载
        var that=this;
        var postId = option.id;
        var postData = localDB.post_dataArray[postId];
        var postCollected = wx.getStorageSync('postCollected');
        this.setData({
            "postId": postId,
            "postData": postData,
            "postCollected": postCollected,
            "musicStatus":app.globalData.g_bgmPage==postId?app.globalData.g_musicStatus:false
        });
        //使总控开关与音乐播放UI同步
        wx.onBackgroundAudioPlay(function(){
            that.setData({
                "musicStatus":true
            })
           app.globalData.g_musicStatus=true;
           app.globalData.g_bgmPage=postId;
        });
        wx.onBackgroundAudioPause(function(){
            that.setData({
                "musicStatus":false
            });
            app.globalData.g_musicStatus=false;
        });
               wx.onBackgroundAudioPause(function(){
            that.setData({
                "musicStatus":false
            });
            app.globalData.g_musicStatus=false;
        })
    },
    
    //收藏按钮逻辑 使用缓存来模拟数据库 
    onCollectionTap: function (e) {
        var that=this;
        var postId = this.data.postId;
        var postCollected = wx.getStorageSync('postCollected') ? wx.getStorageSync('postCollected'):{};
        if (postCollected[postId + '']) {
            wx.showModal({
                title: "取消收藏",
                content: "是否取消收藏",
                showCancel: "true",
                cancelText: "返回",
                confirmText: "确定取消",
                confirmColor: "#333",
                success: function (res) {
                    if (res.confirm) {
                        collectionToggle();
                        wx.showToast({
                            title: "取消收藏成功",
                            duration: 1000
                        })
                    }
                }
            })
        } else {
            collectionToggle();
            wx.showToast({
                title: "收藏成功",
                duration: 1000
            })
        }
        function collectionToggle() {
            postCollected[postId + ''] = postCollected[postId + ''] ? false : true;
            wx.setStorageSync('postCollected', postCollected);
            that.setData({
                "postCollected": postCollected
            })
        }
    },
    //分享按钮逻辑
    onShareTap:function(e){
        var itemList=[
                "分享给微信好友 ",
                "分享到朋友圈",
                "分享到QQ",
                "分享到微博"];
        wx.showActionSheet({
            itemList:[
                "分享给微信好友 ",
                "分享到朋友圈",
                "分享到QQ",
                "分享到微博"],
            itemColor:"#405f80",
            success:function(res){
                if(typeof res.tapIndex=="number"){
                    wx.showModal({
                        title:"已"+itemList[res.tapIndex],
                        content:"假装已经分享了:-D"
                    })
                }
            }
        })
    },
    //音乐播放事务处理 ，按下按钮时切换业务
    onMusicTap:function(e){
        var musicStatus=!this.data.musicStatus;
        this.setData({
            musicStatus:musicStatus
        })
        if(musicStatus){
            wx.playBackgroundAudio({
              dataUrl:this.data.postData.music.url,
              title:this.data.postData.music.title,
              coverImgUrl:this.data.postData.music.coverImg
            })
        }else{
            wx.pauseBackgroundAudio();
        }
    }
})