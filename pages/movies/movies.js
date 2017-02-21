var util = require("../../util/util.js");
var app = getApp();
var data;
Page({
    data: {
        countTotal: 0,
        containerShow: true,
        searchPlaneShow: false,
        locationPlaneShow: false,
        searchData: [],
        provinces: ["福建", "广东", "浙江"],
        cities: ["杭州", "苏州", "宁波"],
        province: "北京",
        city: "通州"
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
        var that = this;
        //登陆时提示是否启用本地位置，确认时使用wx.getLocation接口获取位置信息并使用百度地图API获取具体位置信息
        wx.showModal({
            title: '提示',
            content: 'ご主人様，是否启用当前位置？',
            success: function (res) {
                if (res.confirm) {
                    wx.getLocation({
                        type: 'gcj02',
                        success: function (res) {
                            var latitude = res.latitude;
                            var longitude = res.longitude;
                            var baiduMapAPI = "http://api.map.baidu.com/geocoder/v2/?location=" + latitude + "," + longitude + "&output=json&pois=1&ak=ude4CaoAX1LCf7bWXwpNwCQwRmlWVW1h";
                            util.http(baiduMapAPI, function (data) {
                                var city = data.result.addressComponent.city.split("市")[0];
                                console.log(data);
                                that.getDoubanData(in_theaters + query + "&city=" + city, "in_theaters_dataArray");
                                // wx.hideNavigationBarLoading();
                            })
                        }
                    });
                }
            }
        })
        this.getDoubanData(in_theaters + query, "in_theaters_dataArray");
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
            searchPlaneShow: false,
            locationPlaneShow: false
        })
    },
    onBindConfirm: function (e) {
        var that = this;
        var text = e.detail.value;
        // console.log(text);
        var APIUrl = app.globalData.doubanAPIBase + '/v2/movie/search?q=' + text;
        util.http(APIUrl, function (data) {
            that.setData({
                searchData: util.trimDoubanData(data),
                APIUrl: APIUrl
            });
            // wx.hideNavigationBarLoading();
        })
    },
    onBindBlur: function (e) {
        this.setData({
            containerShow: true,
            searchPlaneShow: false
        })
    },
    onScrollLower: function (e) {
        var that = this;
        console.log("scrolllower");
        var APIUrl = this.data.APIUrl +
            "&start=" + this.data.countTotal + "&count=20";
        util.http(APIUrl, this.loadData);
    },
    //拉取数据
    loadData: function (data) {
        this.setData({
            searchData: this.data.searchData.concat(util.trimDoubanData(data)),
            countTotal: this.data.countTotal + util.trimDoubanData(data).length,
        })
        // wx.hideNavigationBarLoading();
    },
    // 点击more组件跳转到相应的more-movie页面
    onMoreTap: function (e) {
        var category = e.currentTarget.dataset.category;
        //将category对象转成查询字符串格式。category={listTitle,APIUrl};
        // console.log(util.toQueryString(category));
        wx.navigateTo({
            url: '/pages/movies/more-movie/more-movie?' + util.toQueryString(category)
        })
    },
    //设置一个dataArrays的数组对象，数组的变量名为dataArrayName,listTitle为可选参数
    getDoubanData: function (url, dataArrayName, listTitle) {
        var that = this;
        var APIUrl = url.substring(0, url.indexOf("?"));
          util.http(url, function (data) {
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
                newDataArrays[dataArrayName] = that.trimDoubanData(data, listTitle, APIUrl);
                that.setData({
                    dataArrays: newDataArrays
                })
            });
            // wx.hideNavigationBarLoading();
    },
    onMovieUnitTap: function (e) {
        var movieId = e.currentTarget.dataset.movieId;
        wx.navigateTo({
            url: '/pages/movies/movie-detail/movie-detail?movieId=' + movieId
        })
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
    },
    //通过百度地图API更新地理信息
    onLocationSelectTap: function (e) {
        console.log("upper");
        var that = this;
        this.setData({
            containerShow: false,
            searchPlaneShow: false,
            locationPlaneShow: true
        })

    },
    onLocationConfirmTap: function (e) {
        var city = e.currentTarget.dataset.city;
        this.getDoubanData("https://api.douban.com" + "/v2/movie/in_theaters" + "?start=0&count=3" + "&city=" + city, "in_theaters_dataArray");
        this.setData({
            containerShow: true,
            searchPlaneShow: true,
            locationPlaneShow: false
        })

    },
    onLocationChange: function (e) {
        const val = e.detail.value
        this.setData({
            province: this.data.provinces[val[0]],
            city: this.data.cities[val[1]],

        })
    }
})