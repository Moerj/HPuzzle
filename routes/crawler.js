var https = require('https')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs');
var host = 'https://yande.re'
var pageUrl = host + '/post?tags=order%3Arandom';

function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}


module.exports = function(app) {
    var imgPath = './dist/images/temp/';

    /* 清空零时文件夹所有图片 */

    var dirList = fs.readdirSync(imgPath);

    dirList.forEach(function (fileName) {
        fs.unlinkSync(imgPath + fileName);
    });


    // 请求网络图片
    app.get('/yande.re', function(crawler_req, crawler_res) {
        console.log('开始抓取 ' + pageUrl + ' 的数据')

        new Promise(function(resolve, reject) {
            // 筛选所有 html，获取有效的图片数据
            https.get(pageUrl, function(res) {
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
            }).on('error', function(e) {
                console.log(e);
            })

        }).then(function(data) {
            // 从数据组中随机抽取一个图片数据
            var url = data[GetRandomNum(0, data.length)]
            console.log('随机抽取了一个数据：\n', url);
            return url;

        }).then(function(url) {
            // 对抽取的数据进一步处理，进入该数据的单独连接中，去除原图的 url
            console.log('正在处理数据...');

            return new Promise(function(resolve, reject) {
                https.get(url, function(res) {
                    var html = '';
                    res.on('data', function(data) {
                        html += data;
                    })
                    res.on('end', function() {
                        var $ = cheerio.load(html);
                        var img = $('#image');
                        var imgurl = img.attr('src');
                        console.log('数据处理完毕，得到目标图片：\n', imgurl)
                        resolve(imgurl);
                    })
                }).on('error', function(e) {
                    console.log(e);
                })
            })

        }).then(function(url) {
            console.log('正在下载图片...');
            var type = url.substring(url.length-4)
            var filename = Date.parse(new Date()) + type
            var writeStream = fs.createWriteStream(imgPath + filename);

            request(url).pipe(writeStream);

            writeStream.on('finish', function() { // 写完后，继续读取
                crawler_res.end(filename);
                console.log('图片下载完成。');
            });

        })


    });
}