var localDB = require("../../../data/localDB.js");

Page({
    data: {
    },
    onLoad: function (option) {
        // 生命周期函数--监听页面加载
        var postId = option.id;
        var postData = localDB.post_dataArray[postId];
        var postCollected = wx.getStorageSync('postCollected');
        this.setData({
            "postId": postId,
            "postData": postData,
            "postCollected": postCollected
        })
    },
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
    }
})