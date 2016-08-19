var http = require('http')
var path = require('path')
var fs = require("fs");
var loginDataUrl = path.join(__dirname, '../data/loginData.json')

module.exports = function(app) {
    app.post('/regist.action', function(req, res) {
        var userData = {};
        var registData = req.body;
        console.log('注册信息', registData);

        if(!registData.user || !registData.password){
            console.log('注册信息不合法');
            res.send({ message: '注册信息不合法', status: 0 })
            return;
        }

        // 读取服务器用户列表数据
        fs.readFile(loginDataUrl, { encoding: 'utf-8' }, function(error, fileData) {
            if (error) {
                console.log('获取用户列表失败');
            }
            // 操作fileData
            if (fileData) {

                userData = JSON.parse(fileData)
                for (var key in userData) {
                    if (key == registData.user) {
                        res.send({ message: '该用户名已注册', status: 0 })
                        return;
                    }
                }
            }

            // 插入注册的数据
            for (var key in registData) {
                if (key == 'user') {
                    userData[registData[key]] = registData
                }
            }

            // 写入新数据
            var newData = JSON.stringify(userData)
            console.log(newData);
            fs.writeFile(loginDataUrl, newData, { encoding: 'utf-8' }, function(error, writedData) {
                res.send({ message: '注册成功', status: 1 })
            })
        });
    });
}