var http = require('http')
var path = require('path')
var fs = require("fs");
var loginDataUrl = path.join(__dirname, '../data/loginData.json')


module.exports = function(app) {
    app.post('/login.action', function(req, res) {
        fs.readFile(loginDataUrl, { encoding: 'utf-8' }, function(error, fileData) {
            if (error) {
                console.log('获取用户列表失败');
            }
            // 操作fileData
            if (fileData) {
                var userData = JSON.parse(fileData)
                var loginData = req.body;
                console.log('登录信息：', req.body);
                for (var key in userData) {
                    if (key == loginData.user && userData[key].password == loginData.password) {
                        res.send({ message: '登录成功', status: 1 })
                        return;
                    }
                }
            }
            res.send({ message: '登录失败', status: 0 })
        });
    });
}