var http = require('http')
var https = require('https')
var cheerio = require('cheerio')
var host = 'https://yande.re'
var url = host + '/post?tags=order%3Arandom'; //zealer首页

function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

module.exports = function(app) {
    app.get('/yande.re', function(crawler_req, crawler_res) {
        console.log('开始抓取 ' + url + ' 的数据')

        new Promise(function(resolve, reject) {
            // 筛选所有 html，获取有效的图片数据
            https.get(url, function(res) {
                var html = '';
                res.on('data', function(data) {
                    html += data;
                })
                res.on('end', function() {
                    var $ = cheerio.load(html);
                    //剩下的和 jQuery 一样
                    var datalist = $('#post-list-posts').find('.thumb')
                    var data = []
                    datalist.each(function(index, value) {
                        data.push(host + value.attribs.href)
                    })
                    console.log('所有图片链接：\n', data);
                    resolve(data);
                })
            }).on('error', function() {
                console.log('抓取数据失败！')
            })

        }).then(function(data) {
            // 从数据组中随机抽取一个图片数据
            var url = data[GetRandomNum(0, data.length)]
            console.log('随机抽取了一个数据：\n', url);
            return url;

        }).then(function(url) {
            // 对抽取的数据进一步处理，进入该数据的单独连接中，去除原图的 url
            console.log('正在处理数据...\n', url);
            https.get(url, function(res) {
                var html = '';
                res.on('data', function(data) {
                    html += data;
                })
                res.on('end', function() {
                    var $ = cheerio.load(html);
                    var img = $('#image');
                    var src = img.attr('src');
                    console.log('postImg完毕！\n', src)
                    crawler_res.send(src);
                })
            }).on('error', function() {
                console.log('抓取数据失败！')
            })
        })


    });
}