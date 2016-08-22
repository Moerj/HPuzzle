'use strict';

FastClick.attach(document.body);

$(function () {
    var $mask = $('#mask');
    var $contrl = $('#contrl');
    var $setLevel = $('#setLevel');
    var $simple = $('#simple');

    // 配置拼图
    var puzzle = Puzzle({
        imgUrl: 'images/img1.jpg',
        contanier: '#contanier',
        size: $('body').width(),
        level: 1, //设置游戏难度，整数，必须大于1
        clickSound: 'sounds/slide.wav', //拼图音效
        clearSound: 'sounds/clear.wav' //胜利音效
    }).init();

    // 设置等级
    $setLevel.on('change', function () {
        puzzle.setLevel($(this).val());
    });

    // 窗口改变重置尺寸
    var t = void 0;
    $(window).resize(function () {
        clearTimeout(t);
        t = setTimeout(function () {
            puzzle.resize($('body').width());
        }, 300);
    });

    // 随机一张图片
    $simple.click(function () {
        console.log('正在随机加载图片...');
        $mask.show();
        $contrl.css({ overflow: 'hidden' });

        // 爬虫
        $.ajax({
            type: "GET",
            url: "/yande.re"
        }).done(function (res) {
            var dir = 'images/temp/';
            var imgUrl = dir + res;
            console.log('yande.re爬虫数据：\n', imgUrl);
            $('#simple').attr('src', imgUrl);
            puzzle.replace(imgUrl);
        }).always(function () {
            $mask.hide();
            $contrl.css({ overflow: 'auto' });
        });
    });
});