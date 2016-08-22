'use strict';

FastClick.attach(document.body);

$(function () {
    var $win = $(window);
    var $mask = $('#mask');
    var $contrl = $('#contrl');
    var $setLevel = $('#setLevel');
    var $simple = $('#simple');
    var $contanier = $('#contanier');

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
    function resizeWin() {
        if ($win.width() > $win.height()) {
            $contrl.css({ position: 'absolute', top: 60, left: 20 });
            $setLevel.css({ position: 'absolute', top: 20, left: 20 });
            $contanier.css({ position: 'absolute', top: 20, left: 350 });
            puzzle.resize($win.height() - 30);
        } else {
            $contrl.css({ position: 'relative', top: 0, left: 0 });
            $setLevel.css({ position: 'relative', top: 0, left: 0 });
            $contanier.css({ position: 'relative', top: 0, left: 0 });
            puzzle.resize($('body').width());
        }
    }
    setTimeout(function () {
        resizeWin();
    });
    var t = void 0;
    $win.resize(function () {
        clearTimeout(t);
        t = setTimeout(function () {
            resizeWin();
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