// pages/movies/movie-detail/movie-detail.js
var util = require("../../../util/util.js");
var app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.movieId;
    var that = this;
    // this.setData({movieId:movieId});
    var APIUrl = app.globalData.doubanAPIBase + "/v2/movie/subject/" + movieId;
    util.http(APIUrl, function (data) {
      that.setData({
        movie: that.processData(data),
        APIUrl: APIUrl
      });
      wx.hideNavigationBarLoading();
    })
  },
  processData: function (data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries.join('/'),
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      rating:data.rating,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    return movie;
  },
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})