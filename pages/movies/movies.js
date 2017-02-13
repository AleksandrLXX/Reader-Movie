var util = require("../../util/util.js");
var app = getApp();
var data;
Page({
    data: {
        countTotal:0,
        containerShow: true,
        searchPlaneShow: false,
        searchData:[]
        // 期望的dataArrys格式
        // dataArrys:{
        //     in_theaters_dataArray:Arr,
        //     coming_soon_dataArray:Arr,
        //     top250_dataArray:Arr
        // }
    },
    //程序启动时从豆瓣API获取三个电影列表的数据
    onLoad: function () {
        var in_theaters_dataArray, coming_soon_dataArray, top250_dataArray;
        var query = "?start=0&count=3";
        var in_theaters = app.globalData.doubanAPIBase + "/v2/movie/in_theaters";
        var coming_soon = app.globalData.doubanAPIBase + "/v2/movie/coming_soon";
        var top250 = app.globalData.doubanAPIBase + "/v2/movie/top250";
        this.getDoubanData(in_theaters + query, "in_theaters_dataArray", "正在热映");
        this.getDoubanData(coming_soon + query, "coming_soon_dataArray", "即将上映");
        this.getDoubanData(top250 + query, "top250_dataArray", "Top 250");
    },
    //搜索栏实现
    onBindFocus: function (e) {
        this.setData({
            containerShow: false,
            searchPlaneShow: true
        })
    },
    onCancelTap: function (e) {
        this.setData({
            containerShow: true,
            searchPlaneShow: false
        })
    },
    onBindConfirm:function(e){
        var that=this;
        var text=e.detail.value;
        // console.log(text);
        var APIUrl=app.globalData.doubanAPIBase+'/v2/movie/search?q='+text;
        util.http(APIUrl,function(data){
            that.setData({
                searchData:util.trimDoubanData(data),
                APIUrl:APIUrl
            });
            wx.hideNavigationBarLoading();
        })
    },
    onScrollLower: function (e) {
    var that=this;
    console.log("scrolllower");
    var APIUrl = this.data.APIUrl +
      "&start=" + this.data.countTotal + "&count=20";
     util.http(APIUrl, this.loadData);
  },
  //拉取数据
  loadData:function (data) {
      this.setData({
        searchData: this.data.searchData.concat(util.trimDoubanData(data)),
        countTotal: this.data.countTotal + util.trimDoubanData(data).length,
      })
      wx.hideNavigationBarLoading();
  },
        // 点击more组件跳转到相应的more-movie页面
    onMoreTap: function (e) {
        var category = e.currentTarget.dataset.category;
        //将category对象转成查询字符串格式。
        // console.log(util.toQueryString(category));
        wx.navigateTo({
            url: '/pages/movies/more-movie/more-movie?' + util.toQueryString(category)
        })
    },
    //设置一个dataArrays的数组对象，数组的变量名为dataArrayName,listTitle为可选参数
    getDoubanData: function (url, dataArrayName, listTitle) {
        var that = this;
        var APIUrl = url.substring(0, url.indexOf("?"));
        wx.request({
            url: url,
            data: {},
            header: {
                "Content-Type": "json"
            },
            success: function (r) {
                // console.log(r.data);
                //也可以像下面这样写 不过这样数据结果就变成了了
                // data:{
                //     in_theaters_dataArray:Arr,
                //     coming_soon_dataArray:Arr,
                //     top250_dataArray:Arr
                // }
                // var newDataArrays = {};
                // newDataArrays[dataArrayName]=that.trimDoubanData(r.data);
                // that.setData(newDataArrays);

                var newDataArrays = that.data.dataArrays ? that.data.dataArrays : {};
                newDataArrays[dataArrayName] = that.trimDoubanData(r.data, listTitle, APIUrl);
                that.setData({
                    dataArrays: newDataArrays
                })

            }
        });
    },
    //处理res.data,摘取并处理需要的数据返回一个名为movies的arr，期望为：arr=[message,movie0,movie2,movie3]
    trimDoubanData(data, listTitle, url) {
        var movies = [];
        //获取文章标题,默认为data里的title
        movies[0] = {};
        movies[0].listTitle = listTitle || data.title;
        movies[0].APIUrl = url || null;
        //遍历各个subject，修剪电影标题
        data.subjects.forEach(function (item, index) {
            if (item.title.length >= 6) {
                item.title = item.title.substring(0, 6) + "...";
            }
            movies.push(item);
        })
        return movies;
    }
})