/**
 * 拼图核心js es6
 */

(function() {

    class Puzzle {
        constructor(opts) {
            const DEFAULT = {
                imgUrl: '',
                contanier: 'body',
                size: '600',
                level: 1
            }
            if (typeof opts.contanier === 'string') {
                opts.contanier = $(opts.contanier)
            }

            // 配置参数
            this.opts = $.extend({}, DEFAULT, opts);

            // 拼图行数
            this.row = opts.level + 2;

            // 拼图碎片数
            this.fragment = this.row * this.row

            // 碎片的定位数组
            this.positionArry = []
        }
        _getRandomNum(Min, Max) {
            let Range = Max - Min;
            let Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        }
        _getSideDoms(dom) {
            let top = parseInt(dom.style.top)
            let left = parseInt(dom.style.left)
            let h = dom.offsetHeight
            let w = dom.offsetWidth
            let items = this.items

            // 上下左右相邻的碎片
            let side = {
                top: { top: top - h, left: left },
                bottom: { top: top + h, left: left },
                left: { top: top, left: left - w },
                right: { top: top, left: left + w }
            }

            let sideDoms = {};
            let keys = ['top', 'left', 'bottom', 'right']
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                for (let j = 0; j < keys.length; j++) {
                    let key = keys[j]
                    if (parseInt(item.style['top']) == side[key]['top'] && parseInt(item.style['left']) == side[key]['left']) {
                        sideDoms[key] = item
                    }
                }
            }

            return sideDoms
        }
        create() { //创建结构
            //拼图的第一块为空白占位块
            let puzzleString = ''
            let fragment = this.fragment
            let row = this.row
            let fragmentSize = this.opts.size / row
            let top = 0
            let left = 0
            let leftIndex = 1
            let simpleImg = $(`<img src="${this.opts.imgUrl}" width="${this.opts.size}">`)
            let simpleImgWidth = simpleImg[0].width
            let simpleImgHeight = simpleImg[0].height

            for (let i = 0; i < fragment; i++) {
                let className = ''
                let style = ''
                if (leftIndex === row) {
                    top++
                }
                if (i % row === 0) {
                    left = 0
                    leftIndex = 0
                } else {
                    left++
                }

                // 拼图碎片必须的样式
                if (i > 0) {
                    style += `
                    background:#ddd url(${this.opts.imgUrl}) no-repeat;
                    cursor: pointer;
                    `;
                    className += 'fragment'
                }

                // 设置每个碎片图片成背景图尺寸，以 simple 最长边为基准
                if (simpleImgWidth < simpleImgHeight) {
                    style += `background-size: auto ${this.opts.size}px;`
                } else {
                    style += `background-size: ${this.opts.size}px auto;`
                }

                // 碎片尺寸和位置
                style += `
                    background-position: -${fragmentSize*left}px -${fragmentSize*top}px;
                    width:${fragmentSize}px;
                    height:${fragmentSize}px;
                    position:absolute;
                    left: ${fragmentSize*left}px;
                    top: ${fragmentSize*top}px;
                `
                leftIndex++
                puzzleString += `<div class="${className}" style="${style}"></div>`;

            }
            puzzleString = `<div class="puzzle" style="
                width:${this.opts.size}px;
                height:${this.opts.size}px;
                position:relative;
            ">${puzzleString}</div>`

            this.puzzle = $(puzzleString)

            // 记录所有碎片
            this.items = this.puzzle.children()

            // 给碎片dom 加上序号
            this.items.each((index, item) => {
                item._puzzleIndex = index;

                // 记录每个碎片当前位置的定位
                this.positionArry[index] = { left: item.style.left, top: item.style.top }

            })

            // 创建点击音效
            this.clickSound = $(`<audio src="sounds/slide.wav" preload></audio>`)[0]

            // 每个碎片点击事件
            $(this.puzzle).on('click', '.fragment', (e) => {
                this.render(e.target)
                this.clickSound.play()
                return false
            })

            this.opts.contanier.append(this.puzzle)

            return this
        }
        random() { //随机排序拼图碎片
            // 建立一个新的数组，它存放所有拼图碎片
            let arr = []
            for (let i = 0; i < this.items.length; i++) {
                arr.push(this.items[i])
            }

            // 从新数组中随机抽取碎片
            let l = arr.length;
            for (let i = 0; i < l; i++) {
                let num = this._getRandomNum(0, arr.length - 1)
                    // 抽取一个碎片
                let f = arr[num]

                // 重绘制这个碎片的定位
                f.style.top = this.positionArry[i].top
                f.style.left = this.positionArry[i].left

                // 从新数组中移除已经重定位的碎片
                arr.splice(num, 1)

            }
        }
        render(clickTarget) { //绘制拼图改变
            let sideDoms = this._getSideDoms(clickTarget)
            let blank
            let temp = {
                top: parseInt(clickTarget.style.top) + 'px',
                left: parseInt(clickTarget.style.left) + 'px'
            }
            for (let key in sideDoms) {
                if (sideDoms[key].className == '') {
                    // 获取到空白块
                    blank = sideDoms[key]
                    // 空白快和点击块交换位置
                    clickTarget.style.top = blank.style.top
                    clickTarget.style.left = blank.style.left
                    blank.style.top = temp.top
                    blank.style.left = temp.left
                    break
                }
            }

        }
    }


    window.Puzzle = function(opts) {
        let p = new Puzzle(opts)
        p.init = () => {
            p.create().random()
        }
        return p
    };
})()