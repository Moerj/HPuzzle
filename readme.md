# H5色色的拼图游戏

## Demo
https://moerj.github.io/HPuzzle/

## Start
```javascript
var puzzle = Puzzle({
    imgUrl: 'images/img.jpg', //拼图路径
    contanier: '#contanier', //拼图容器
    size: '600', //定义大小
    level: 1, //设置游戏难度 1~3
    clickSound: 'sounds/slide.wav', //拼图音效
    clearSound: 'sounds/clear.wav' //胜利音效
}).init()
```
  

## Option  

### imgUrl
指定拼图的图片路径

### contanier
将拼图放入指定的 dom 元素，可以传入 id 或者是 dom 对象

### size
定义拼图大小，单位计算为 px

### level
游戏难度 1~3

### clickSound
点击音效

### clearSound
胜利音效


## API  

### init()
初始化生成拼图，再次调用则会重新随机初始化拼图

### setLevel(num)
设置拼图等级