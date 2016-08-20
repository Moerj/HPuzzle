$(function() {
    FastClick.attach(document.body);

    var puzzle = Puzzle({
            imgUrl: 'images/img1.jpg',
            contanier: '#contanier',
            size: $('body').width(),
            level: 1, //设置游戏难度，整数，必须大于1
            clickSound: 'sounds/slide.wav', //拼图音效
            clearSound: 'sounds/clear.wav' //胜利音效
        })
        .init()

    $('#setLevel').on('change', function() {
        puzzle.setLevel($(this).val())
    })

    var t
    $(window).resize(function() {
        clearTimeout(t)
        t = setTimeout(function() {
            puzzle.reSize($('body').width())
        }, 300)
    });

    // 随机一张图片
    $('#simple').click(function() {
        console.log('正在随机加载图片...');
        // 爬虫
        $.ajax({
            type: "GET",
            url: "/yande.re"
        }).done(function(res) {
            var dir = 'images/temp/'
            var imgUrl = dir + res
            console.log('yande.re爬虫数据：\n', imgUrl);
            $('#simple').attr('src', imgUrl)
            puzzle.replaceImg(imgUrl)
        })
    })


})