'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 拼图核心js es6
 */

(function () {
    var Puzzle = function () {
        function Puzzle(opts) {
            _classCallCheck(this, Puzzle);

            var DEFAULT = {
                imgUrl: '',
                contanier: 'body',
                size: '600',
                level: 1
            };
            if (typeof opts.contanier === 'string') {
                opts.contanier = $(opts.contanier);
            }

            // 配置参数
            this.opts = $.extend({}, DEFAULT, opts);

            // 拼图行数
            this.row = opts.level + 2;

            // 拼图分片数
            this.fragment = this.row * this.row;

            // 分片的定位数组
            this.positionArry = [];
        }

        _createClass(Puzzle, [{
            key: '_getRandomNum',
            value: function _getRandomNum(Min, Max) {
                var Range = Max - Min;
                var Rand = Math.random();
                return Min + Math.round(Rand * Range);
            }
        }, {
            key: 'create',
            value: function create() {
                var _this = this;

                //创建结构
                //拼图的第一块为空白占位块
                var puzzleString = '';
                var fragment = this.fragment;
                var row = this.row;
                var fragmentSize = this.opts.size / row;
                var top = 0;
                var left = 0;
                var leftIndex = 1;
                var simpleImg = $('<img src="' + this.opts.imgUrl + '" width="' + this.opts.size + '">');
                var simpleImgWidth = simpleImg[0].width;
                var simpleImgHeight = simpleImg[0].height;

                for (var i = 0; i < fragment; i++) {
                    var className = '';
                    var style = '';
                    if (leftIndex === row) {
                        top++;
                    }
                    if (i % row === 0) {
                        left = 0;
                        leftIndex = 0;
                    } else {
                        left++;
                    }

                    // 拼图碎片必须的样式
                    if (i > 0) {
                        style += '\n                    background:#ddd url(' + this.opts.imgUrl + ') no-repeat;\n                    cursor: pointer;\n                    ';
                        className += 'fragment';
                    }

                    // 设置每个碎片图片成背景图尺寸，以 simple 最长边为基准
                    if (simpleImgWidth < simpleImgHeight) {
                        style += 'background-size: auto ' + this.opts.size + 'px;';
                    } else {
                        style += 'background-size: ' + this.opts.size + 'px auto;';
                    }

                    // 碎片尺寸和位置
                    style += '\n                    background-position: -' + fragmentSize * left + 'px -' + fragmentSize * top + 'px;\n                    width:' + fragmentSize + 'px;\n                    height:' + fragmentSize + 'px;\n                    position:absolute;\n                    left: ' + fragmentSize * left + 'px;\n                    top: ' + fragmentSize * top + 'px;\n                ';
                    leftIndex++;
                    puzzleString += '<div class="' + className + '" style="' + style + '"></div>';
                }
                puzzleString = '<div class="puzzle" style="\n                width:' + this.opts.size + 'px;\n                height:' + this.opts.size + 'px;\n                position:relative;\n            ">' + puzzleString + '</div>';

                this.puzzle = $(puzzleString);

                // 给碎片dom 加上序号
                this.puzzle.children().each(function (index, item) {
                    item._puzzleIndex = index;

                    // 记录每个分片当前位置的定位
                    _this.positionArry[index] = { left: item.style.left, top: item.style.top };
                });

                this.opts.contanier.append(this.puzzle);

                return this;
            }
        }, {
            key: 'random',
            value: function random() {
                //随机排序拼图碎片
                // 建立一个新的数组，它存放所有拼图碎片
                var fragmentDoms = this.puzzle.children();
                var arr = [];
                for (var i = 0; i < fragmentDoms.length; i++) {
                    arr.push(fragmentDoms[i]);
                }

                // 从新数组中随机抽取碎片
                var l = arr.length;
                for (var _i = 0; _i < l; _i++) {
                    var num = this._getRandomNum(0, arr.length - 1);
                    // 抽取一个碎片
                    var f = arr[num];

                    // 重绘制这个碎片的定位
                    f.style.top = this.positionArry[_i].top;
                    f.style.left = this.positionArry[_i].left;

                    // 从新数组中移除已经重定位的碎片
                    arr.splice(num, 1);
                }
            }
        }, {
            key: 'render',
            value: function render() {//绘制拼图改变

            }
        }]);

        return Puzzle;
    }();

    window.Puzzle = function (opts) {
        return new Puzzle(opts);
    };
})();