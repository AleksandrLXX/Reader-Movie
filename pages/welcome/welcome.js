Page({
    test:function(e){
        // navigateTo触发hide事件
        // wx.navigateTo({
        //     url:"/pages/post/post"})
        //redirectTo触发unload事件
        wx.switchTab({
            url:"/pages/post/post"
        })
    },
    onHide:function(e){
        console.log("hide")
    }
})