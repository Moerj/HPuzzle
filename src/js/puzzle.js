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

            // 拼图分片数
            this.fragment = this.row * this.row

            // 分片的定位数组
            this.positionArry = []
        }
        _getRandomNum(Min, Max) {
            let Range = Max - Min;
            let Rand = Math.random();
            return (Min + Math.round(Rand * Range));
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

            // 给碎片dom 加上序号
            this.puzzle.children().each((index, item) => {
                item._puzzleIndex = index;

                // 记录每个分片当前位置的定位
                this.positionArry[index] = {left:item.style.left,top:item.style.top}
            })

            this.opts.contanier.append(this.puzzle)

            return this
        }
        random() { //随机排序拼图碎片
            // 建立一个新的数组，它存放所有拼图碎片
            let fragmentDoms = this.puzzle.children()
            let arr = []
            for (let i = 0; i < fragmentDoms.length; i++) {
                arr.push(fragmentDoms[i])
            }

            // 从新数组中随机抽取碎片
            let l = arr.length;
            for (let i = 0; i < l; i++) {
                let num = this._getRandomNum(0,arr.length-1)
                // 抽取一个碎片
                let f = arr[num]

                // 重绘制这个碎片的定位
                f.style.top = this.positionArry[i].top
                f.style.left = this.positionArry[i].left

                // 从新数组中移除已经重定位的碎片
                arr.splice(num,1)

            }
        }
        render() { //绘制拼图改变

        }
    }


    window.Puzzle = function(opts) {
        return new Puzzle(opts)
    };
})()