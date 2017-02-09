var app = getApp();
var data;
Page({
    data: {
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
        var in_theaters = app.globalData.doubanAPIBase + "/v2/movie/in_theaters" + query;
        var coming_soon = app.globalData.doubanAPIBase + "/v2/movie/coming_soon" + query;
        var top250 = app.globalData.doubanAPIBase + "/v2/movie/top250" + query;
        this.getDoubanData(in_theaters, "in_theaters_dataArray","正在热映");
        this.getDoubanData(coming_soon, "coming_soon_dataArray","即将上映");
        this.getDoubanData(top250, "top250_dataArray","Top 250");
    },
    //设置一个dataArrays的数组对象，数组的变量名为dataArrayName,listTitle为可选参数
    getDoubanData: function (url, dataArrayName,listTitle) {
        var that = this;
        wx.request({
            url: url,
            data: {},
            header: {
                "Content-Type": "json"
            },
            success: function (r) {
                console.log(r.data);
                //也可以像下面这样写写 不过这样数据结果就变成了了
                // dataArrys:{
                //     in_theaters_dataArray:Arr,
                //     coming_soon_dataArray:Arr,
                //     top250_dataArray:Arr
                // }
                // var newDataArrays = {};
                // newDataArrays[dataArrayName]=that.trimDoubanData(r.data);
                // that.setData(newDataArrays);

                var newDataArrays = that.data.dataArrays ? that.data.dataArrays : {};
                newDataArrays[dataArrayName] = that.trimDoubanData(r.data,listTitle);
                that.setData({
                    dataArrays: newDataArrays
                })
              
            }
        });
    },
    //处理res.data,摘取并处理需要的数据返回一个名为movies的arr，期望为：arr=[listTitle,movie0,movie2,movie3]
    trimDoubanData(data,listTitle) {
        var movies = [];
        //获取文章标题,默认为data里的title
        movies[0] = listTitle||data.title;
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