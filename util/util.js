
function toQueryPair(key, value) {
    if (typeof value == 'undefined') {
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}
//对象转字符串
function toQueryString(obj) {
    var ret = [];
    for (var key in obj) {
        key = encodeURIComponent(key);
        var values = obj[key];
        if (values && values.constructor == Array) {//数组 
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        } else { //字符串 
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
} 
    function trimDoubanData(data){
        var movies = [];
        data.subjects.forEach(function (item, index) {
            if (item.title.length >= 6) {
                item.title = item.title.substring(0, 6) + "...";
            }
            movies.push(item);
        })
        return movies;
    }

function http(url, callBack) {
 wx.showNavigationBarLoading();
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

module.exports={
    toQueryString:toQueryString,
    http:http,
    trimDoubanData:trimDoubanData
}