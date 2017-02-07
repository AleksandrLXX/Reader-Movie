var localDB=require('../../data/localDB.js')
Page({
  
  data:{
  },
  onLoad:function(e){
    //   console.log(e);
      this.setData({
          "dataArray":localDB.post_dataArray
      })
  },
  onPostTap:function(e){
    var postId=e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  }
  
})