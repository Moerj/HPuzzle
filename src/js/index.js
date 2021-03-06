FastClick.attach(document.body);

$(function() {
    let $win = $(window)
    let $mask = $('#mask')
    let $contrl = $('#contrl')
    let $setLevel = $('#setLevel')
    let $simple = $('#simple')
    let $contanier = $('#contanier')

    // 配置拼图
    let puzzle = Puzzle({
            imgUrl: 'images/img0.jpg',
            contanier: '#contanier',
            size: $('body').width(),
            level: 1, //设置游戏难度，整数，必须大于1
            clickSound: 'sounds/slide.wav', //拼图音效
            clearSound: 'sounds/clear.wav' //胜利音效
        })
        .init()

    // 设置等级
    $setLevel.on('change', function() {
        puzzle.setLevel($(this).val())
    })

    // 窗口改变重置尺寸
    function resizeWin() {
        if ($win.width() > $win.height()) {
            $contrl.css({ position: 'absolute', top: 80, left: 20 })
            $contanier.css({ position: 'absolute', top: 20, left: 350 })
            puzzle.resize($win.height() - 30)
        } else {
            $contrl.css({ position: 'relative', top: 0, left: 0 })
            $contanier.css({ position: 'relative', top: 0, left: 0 })
            puzzle.resize($('body').width())
        }
    }
    setTimeout(() => {
        resizeWin()
    })
    let t
    $win.resize(function() {
        clearTimeout(t)
        t = setTimeout(function() {
            resizeWin()
        }, 300)
    });

    // 随机一张图片
    $('.btn.network').click(function() {  
        console.log('正在随机加载图片...')
        $mask.show()
        $contrl.css({ overflow: 'hidden' })

        // 爬虫
        $.ajax({
            type: "GET",
            url: "/yande.re"
        }).done(function(res) {
            let dir = 'images/temp/'
            let imgUrl = dir + res
            console.log('yande.re爬虫数据：\n', imgUrl);
            $simple.attr('src', imgUrl)
            puzzle.replace(imgUrl)
        }).always(function() {
            $mask.hide();
            $contrl.css({ overflow: 'auto' })
        })
    })

    // 取本地图片
    $('.imgfile').change(function(e){
        var file = e.target.files[0]
        var imgUrl = window.URL.createObjectURL(file)
        $simple.attr('src', imgUrl)
        puzzle.replace(imgUrl)
    })


})