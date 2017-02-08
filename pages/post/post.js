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
  },
  // 由于获取的是有swiperitem冒泡上来的事件 所以用target获取dataset 这里的target并不是dom节点 它只是一些属性值的集合
 onSwiperTap:function(e){
    var postId=e.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
 }
  
})