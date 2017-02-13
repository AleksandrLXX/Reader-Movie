// pages/movies/more-movie/more-movie.js
var util = require("../../../util/util.js");
Page({
  data: {
    movies: [],
    navigateTitle: "",
    countTotal: 0

  },
  onLoad: function (options) {
    // console.log(options);
    var that = this;
    this.data.navigateTitle = options.listTitle;
    var APIUrl = options.APIUrl;
    this.setData({APIUrl:APIUrl});
    util.http(APIUrl,this.loadData);

  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  onScrollLower: function (e) {
    var that=this;
    console.log("scrolllower");
    var APIUrl = this.data.APIUrl +
      "?start=" + this.data.countTotal + "&count=20";
    util.http(APIUrl, this.loadData);
  },
  //拉取数据
  loadData:function (data) {
      this.setData({
        movies: this.data.movies.concat(util.trimDoubanData(data)),
        countTotal: this.data.countTotal + util.trimDoubanData(data).length,
      })
      wx.hideNavigationBarLoading();
  }
})