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
            opts.contanier = $(opts.contanier)

            // 配置参数
            this.opts = $.extend({}, DEFAULT, opts);

            // 拼图行数
            if (opts.level < 1) {
                opts.level = 1
            }
            if (opts.level > 3) {
                opts.level = 3
            }

            this.row = opts.level + 2

            // 拼图碎片数
            this.fragment = this.row * this.row

            // 碎片的定位数组
            this.positionArry = []

            // 点击音效
            this.clickSound = $(`<audio src="${this.opts.clickSound}" preload></audio>`)[0]

            // 胜利音效
            this.clearSound = $(`<audio src="${this.opts.clearSound}" preload></audio>`)[0]
        }
        _getRandomNum(Min, Max) {
            let Range = Max - Min;
            let Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        }
        _getSideDoms(dom) { //获取点击目标的上下左右
            let top = parseInt(dom.style.top)
            let left = parseInt(dom.style.left)
            let h = parseInt(dom.offsetHeight)
            let w = parseInt(dom.offsetWidth)
            let items = this.items

            // 上下左右相邻的碎片 理论中的坐标
            let side = {
                top: { top: top - h, left: left },
                bottom: { top: top + h, left: left },
                left: { top: top, left: left - w },
                right: { top: top, left: left + w }
            }

            let sideDoms = {};
            let keys = ['top', 'left', 'bottom', 'right']

            // 以实际坐标跟理论坐标对比，误差合理的判定为领边碎片
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                for (let j = 0; j < keys.length; j++) {
                    let key = keys[j]
                    let itemTop = parseInt(item.style['top'])
                    let itemLeft = parseInt(item.style['left'])
                    let topDiff = Math.abs(itemTop - side[key]['top'])
                    let leftDiff = Math.abs(itemLeft - side[key]['left'])
                    if(topDiff<2 && leftDiff<2){
                        sideDoms[key] = item
                    }
                }
            }
            return sideDoms
        }
        _isClear() { //是否通关
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (item._puzzleTop != item.style.top || item._puzzleLeft != item.style.left) {
                    return false
                }
            }
            return true
        }
        _click(clickTarget) { //绘制拼图改变
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
        clearance() { //触发胜利
            this.items.hide()
            this.puzzle.css({ background: `url(${this.opts.imgUrl})`, backgroundSize: 'cover' })
            this.clearSound.play()
            return this
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
            let simpleImg = $(`<img src="${this.opts.imgUrl}">`)
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

                if (simpleImgWidth < simpleImgHeight) {
                    style += `background-size: ${this.opts.size}px auto;`
                } else {
                    style += `background-size: auto ${this.opts.size}px;`
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
                item._puzzleTop = item.style.top;
                item._puzzleLeft = item.style.left;
                item._puzzleIndex = index

                // 记录每个碎片当前位置的定位
                this.positionArry[index] = { left: item.style.left, top: item.style.top }

            })

            // 每个碎片点击事件
            $(this.puzzle).on('click', '.fragment', (e) => {
                let target = e.target
                let timer = target._puzzleTimer

                // 判断是否通关
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    if (this._isClear()) this.clearance()
                }, 310)

                // 更新渲染拼图
                this._click(target)
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

            return this
        }
        destory() {
            $(this.puzzle).remove()
            return this
        }
        setLevel(num) {
            num = parseInt(num)
            if (num < 1) {
                num = 1
            }
            if (num > 3) {
                num = 3
            }
            this.opts.level = num
            this.row = this.opts.level + 2;
            this.fragment = this.row * this.row
            this.destory().create().random()
            return this
        }
        getLevel() {
            return this.opts.level
        }
    }


    window.Puzzle = function(opts) {
        let p = new Puzzle(opts)
        p.init = () => {
            if (p.inited) {
                p.destory().create().random()
            } else {
                p.inited = true
                p.create()
                setTimeout(() => {
                    p.random()
                })
            }
            return p
        }
        return p
    };
})()