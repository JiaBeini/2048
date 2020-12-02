<template>
<div>
  <!-- 展示分数 -->
  <div class="new-game-and-score">
    <div class="score"> 分数(单人简单): <span>{{score}}</span>
    </div>
    <!-- 这里是初始化棋盘按钮 -->
    <div class='show'>
      <button @click="init" class="init-button">新游戏</button>
    </div>
  </div>
  <!-- 这里是棋盘数据展示以及操作 -->
  <div class='container'>
    <!-- 这里首先是游戏结束的遮罩，会显示游戏结束时的得分以及提供新游戏（初始化棋盘）按钮 -->
    <div class="mask" v-if="gameover">
      <h1>游戏结束</h1>
      <p>你这一局的分数是{{score}}</p>
      <button @click="sentmes" class="init-button-1">新游戏</button>
    </div>
    <!-- 接下来是棋盘及数据 -->
    <div class='showit'>
      <!-- 棋盘 -->
      <Background />
    <!-- 在这里展示数据，每一个有数据的cell都将展示 -->
    <div class="number-cells">
      <!-- cell展示效果 -->
      <transition-group name="appear">
        <div
          class="number-cell"
          v-for="cell of numberCells"
          :id="`c${cell.id}`"
          :key="cell.id"
          :style="
          `
        width: 80px;
        height: 80px;
        border-radius: 5px;
        font-size: 32px;
        font-weight: bold;
        line-height: 80px;
        color: #776e65;
        position: absolute;
        z-index: ${cell.num};
        backgroundColor: ${cell.color};
        top: ${getTop(cell)};
        left: ${getLeft(cell)};
        `
          "
        >
        <!-- cell的值 -->
          {{ cell.num }}
        </div>
      </transition-group>
    </div>
    </div>
    
  </div>
</div>

</template>


<script>

import Background from '../Background';

export default {
  name: 'singleEasy',
  components: {
    Background
  },
  
  data() {
    return {
      score: 0,
      numberCells: [],
      //存储不同数字的颜色
      color: {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#0444BF',
        1024: '#A79674',
        2048: '#282726',
        4096: '#280b21',
        8192: '#281d04',
        16384: '#281d04',
        32768: '#281d04',
        65536: '#281d04',
        131072: '#281d04',
      },
      auxId: 0,
      gameover: false,
      canMove: true,
      type:'simple',
      username:'',
      ip:''
    };
  },
  
  mounted() {
    //this.init();
    //console.log(this.username)
    
    //监听屏幕滑动方向
    //这里是封装监听滑动的对象
    var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener)
            element.addEventListener(type, handler, false);
        else if (element.attachEvent)
            element.attachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    removeHandler: function (element, type, handler) {
        if(element.removeEventListener)
            element.removeEventListener(type, handler, false);
        else if(element.detachEvent)
            element.detachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    /*
     * 监听触摸的方向
     * @param target            要绑定监听的目标元素
     * @param isPreventDefault  是否屏蔽掉触摸滑动的默认行为（例如页面的上下滚动，缩放等）
     * @param upCallback        向上滑动的监听回调（若不关心，可以不传，或传false）
     * @param rightCallback     向右滑动的监听回调（若不关心，可以不传，或传false）
     * @param downCallback      向下滑动的监听回调（若不关心，可以不传，或传false）
     * @param leftCallback      向左滑动的监听回调（若不关心，可以不传，或传false）
     */
    listenTouchDirection: function (target, isPreventDefault, upCallback, rightCallback, downCallback, leftCallback) {
        this.addHandler(target, "touchstart", handleTouchEvent);
        this.addHandler(target, "touchend", handleTouchEvent);
        this.addHandler(target, "touchmove", handleTouchEvent);
        var startX;
        var startY;
        function handleTouchEvent(event) {
            switch (event.type){
                case "touchstart":
                    startX = event.touches[0].pageX;
                    startY = event.touches[0].pageY;
                    break;
                case "touchend":
                    var spanX = event.changedTouches[0].pageX - startX;
                    var spanY = event.changedTouches[0].pageY - startY;

                    if(Math.abs(spanX) > Math.abs(spanY)){      //认定为水平方向滑动
                        if(spanX > 30){         //向右
                            if(rightCallback)
                                rightCallback();
                        } else if(spanX < -30){ //向左
                            if(leftCallback)
                                leftCallback();
                        }
                    } else {                                    //认定为垂直方向滑动
                        if(spanY > 30){         //向下
                            if(downCallback)
                                downCallback();
                        } else if (spanY < -30) {//向上
                            if(upCallback)
                                upCallback();
                        }
                    }

                    break;
                case "touchmove":
                    //阻止默认行为
                    if(isPreventDefault)
                        event.preventDefault();
                    break;
            }
        }
    }
    };
    //这里调用对象监听操作并且对应的响应操作
    EventUtil.listenTouchDirection(document,true,this.moveUp,this.moveRight,this.moveDown,this.moveLeft)
    //console.log(this.numberCells)
    //防止上下左右按键滑动页面
    document.addEventListener('keyup', (event) => {
      //屏蔽默认按键操作如默认按键arrowup为页面向上滑动
      if(event.keyCode<=40&&event.keyCode>=37){
        event.preventDefault();
      }
    }),
    document.addEventListener('keydown', (event) => {
      if(event.keyCode<=40&&event.keyCode>=37){
        event.preventDefault();
      }
    }),
    document.addEventListener('keypress', (event) => {
      if(event.keyCode<=40&&event.keyCode>=37){
        event.preventDefault();
      }
    }),
    
    
    //这下面是我们监听按键操作并且对应的call不同的函数来实现操作，仍然要屏蔽默认按键操作
    document.addEventListener('keyup', (event) => {
      //对应不同按键响应不同操作
      if (!this.canMove) {
        return;
      }
      switch (event.key.toLocaleUpperCase()) {
        case 'ARROWUP':
        case 'W':
          this.moveUp();
          this.gameover = this.isGameOver();
          break;
        case 'ARROWDOWN':
        case 'S':
          this.moveDown();
          this.gameover = this.isGameOver();
          break;
        case 'ARROWLEFT':
        case 'A':
          this.moveLeft();
          this.gameover = this.isGameOver();
          break;
        case 'ARROWRIGHT':
        case 'D':
          this.moveRight();
          this.gameover = this.isGameOver();
          break;
      }
      
    });
  },
  methods: {
    sentmes(){
    // 下面这段注释的代码是用于保存分数的，可以封装在需要的地方，注意表单项data的填写
    this.$axios({
       method: 'post',
       url: '/api/save_score/',
       data:this.$qs.stringify({
          ip: '1.0.0.0', // 用户ip, String()
          name: this.$store.state.username.name, // 用户名，String()
          type: this.type, // score的类型，simple或者hard, String()
          score: this.score // 分数，Number()
       })
    }).then(response=>{
        console.log(response);
    }).catch(error => {
        // TODO  存储失败需要给用户一点响应
        console.log(error);
    });
    this.init();
    },
    //初始化棋盘数据
    init() {
      this.username=this.$parent.username;
      console.log(this.type+this.username)
      this.numberCells.length = 0;
      this.score = 0;
      this.auxId = 0;
      this.gameover = false;
      this.generateOneNumberCell();
      this.generateOneNumberCell();
    },
    //生成新数字
    generateOneNumberCell() {
      //棋盘已满则不生成
      if (this.isFull()) {
        return;
      }
      //生成数字的值
      const num = this.random24();
      //生成数字位置
      const newCell = {
        x: this.random0123(),
        y: this.random0123(),
        num: num,
        color: this.color[num],
        id: this.auxId++,
      };
      //如果该位置已有数字则重新生成
      let isExist = () => this.getCellByPoint({ x: newCell.x, y: newCell.y });
      while (isExist()) {
        newCell.x = this.random0123();
        newCell.y = this.random0123();
      }
      //将生成的数字放入棋盘
      this.numberCells.push(newCell);
    },
    //随机生成2或4
    random24() {
      //70%概率是2
      return Math.random() <= 0.7 ? 2 : 4;
    },
    //随机生成0123
    random0123() {
      return parseInt(Math.random() * 4);
    },
    //获取cell的位置（x，y）
    getCellByPoint({ x, y }) {
      return this.numberCells.find((cell) => cell.x === x && cell.y === y);
    },
    //获取cell的位置（离棋盘上面的位置）
    getTop(cell) {
      return `${20 + cell.y * 95}px`;
    },
    //获取cell的位置（离棋盘左面的位置）
    getLeft(cell) {
      return `${20 + cell.x * 95}px`;
    },
    //排序棋子所需
    sortByX(a, b) {
      return a.x - b.x;
    },
    sortByY(a, b) {
      return a.y - b.y;
    },
    //获取cell的id
    getIndexById(id) {
      return this.numberCells.findIndex((cell) => cell.id === id);
    },
    //清除之前的数字的动画
    animateMerge(dom) {
      dom.animate(
        [
          { transform: 'scale(0)' },
          { transform: 'scale(1.2)' },
          { transform: 'scale(1)' },
        ],
        {
          duration: 150,
        }
      );
      //合并后可以接受键盘输入
      this.canMove = true;
    },
    //向左移动
    moveLeft() {
      //一个表示可以向左移动的变量
      let canMoveLeft = false;
      //记录加分次数和总加分的变量（用于后面额外加分）
      var inc=0,inct=0;
      for (let i = 0; i < 4; i++) {
        //按顺序获得该行的数字格
        let row = this.numberCells
          .filter((cell) => cell.y === i)
          .sort(this.sortByX);
        //一个表示上一格已经过合并的变量
        let visited = false;
        for (let j = 0; j < row.length; j++) {
          //如果当前是第一个数字格，则其左边一定没有数字格，则直接推向最左边
          if (j === 0) {
            //如果已经在最左边则无需变动，也不会把可以移动的变量置为true
            //如果不在最左边则移动
            if (row[j].x !== 0) {
              row[j].x = 0;
              canMoveLeft = true;
            }
          } else {
            //如果当前数字格与上一数字格的数字一样，则合并
            //否则就是将其挪到上一格的后一列，条件是上一格的后一列不为当前格
            if (row[j].num === row[j - 1].num && !visited) {
              //移动当前数字格的坐标到上一数字格上
              row[j].x = row[j - 1].x;
              //滑动中禁止键盘输入
              this.canMove = false;
              //获取当前数字格的DOM
              
                  const newNum = row[j].num * 2;
                  row[j - 1].num = newNum;
                  row[j - 1].color = this.color[newNum];
                  let dom2 = document.querySelector(`#c${row[j - 1].id}`);
                  this.animateMerge(dom2);
                  this.numberCells.splice(this.getIndexById(row[j].id), 1);
                  row.splice(j, 1);
                  j--;
                  this.score += newNum;
                //更新加分数据
                inc+=newNum;
                inct++;
              //若发生合并则表示当前可以向左移动，则表示这一格已进行合并，避免重复合并
              canMoveLeft = true;
              visited = true;
            } else {
              if (row[j].x !== row[j - 1].x + 1) {
                row[j].x = row[j - 1].x + 1;
                canMoveLeft = true;
                //如果进行一次无合并的移动，则表示上一格（这一格）没进行合并
                visited = false;
              }
            }
          }
        }
      }
      //如果仍能移动则生成新数字
      if (canMoveLeft) {
        this.generateOneNumberCell();
      }
      //额外加分：额外分为此次操作加分乘合并数字对的数量除以8
      if(inct>1){
        this.score+=inc*(inct/8)
      }
    },
    //向右移动
    moveRight() {
      //一个表示可以向右移动的变量
      let canMoveRight = false;
      var inc=0,inct=0;
      for (let i = 0; i < 4; i++) {
        //按顺序获得该行的数字格
        let row = this.numberCells
          .filter((cell) => cell.y === i)
          .sort(this.sortByX);
        //一个表示上一格已经过合并的变量
        let visited = false;
        for (let j = row.length - 1; j >= 0; j--) {
          //如果当前是最后一个数字格，则其右边一定没有数字格，则直接推向最右边
          if (j === row.length - 1) {
            //如果已经在最右边则无需变动，也不会把可以移动的变量置为true
            //如果不在最右边则移动
            if (row[j].x !== 3) {
              row[j].x = 3;
              canMoveRight = true;
            }
          } else {
            //如果当前数字格与后一数字格的数字一样，则合并
            //否则就是将其挪到后一格的前一列，条件是后一格的前一列不为当前格
            if (row[j].num === row[j + 1].num && !visited) {
              row[j].x = row[j + 1].x;
              //滑动中禁止键盘输入
              this.canMove = false;

              
                  const newNum = row[j].num * 2;
                  row[j + 1].num = newNum;
                  row[j + 1].color = this.color[newNum];
                  let dom2 = document.querySelector(`#c${row[j + 1].id}`);
                  this.animateMerge(dom2);
                  this.numberCells.splice(this.getIndexById(row[j].id), 1);
                  row.splice(j, 1);
                  this.score += newNum;
                  inc+=newNum;
                  inct++;
                
              canMoveRight = true;
              visited = true;
            } else {
              if (row[j].x !== row[j + 1].x - 1) {
                row[j].x = row[j + 1].x - 1;
                canMoveRight = true;
                //如果进行一次无合并的移动，则表示上一格（这一格）没进行合并
                visited = false;
              }
            }
          }
        }
      }
      
      if (canMoveRight) {
        this.generateOneNumberCell();
      }
      if(inct>1){
        this.score+=inc*inct/8;
      }
    },
    //向上移动
    moveUp() {
      //一个表示可以向上移动的变量
      let canMoveUp = false;
      var inc=0,inct=0;
      for (let i = 0; i < 4; i++) {
        //按顺序获得该列的数字格
        let column = this.numberCells
          .filter((cell) => cell.x === i)
          .sort(this.sortByY);
        //一个表示上一格已经过合并的变量
        let visited = false;
        for (let j = 0; j < column.length; j++) {
          //如果当前是第一个数字格，则其上边一定没有数字格，则直接推向最上边
          if (j === 0) {
            //如果已经在最上边则无需变动，也不会把可以移动的变量置为true
            //如果不在最上边则移动
            if (column[j].y !== 0) {
              column[j].y = 0;
              canMoveUp = true;
            }
          } else {
            //如果当前数字格与上一数字格的数字一样，则合并
            //否则就是将其挪到上一格的后一行，条件是上一格的后一行不为当前格
            if (column[j].num === column[j - 1].num && !visited) {
              column[j].y = column[j - 1].y;
              //滑动中禁止键盘输入
              this.canMove = false;

              
                  const newNum = column[j].num * 2;
                  column[j - 1].num = newNum;
                  column[j - 1].color = this.color[newNum];
                  let dom2 = document.querySelector(`#c${column[j - 1].id}`);
                  this.animateMerge(dom2);
                  this.numberCells.splice(this.getIndexById(column[j].id), 1);
                  column.splice(j, 1);
                  j--;
                  this.score += newNum;
                  inc+=newNum;
                  inct++;
                
              canMoveUp = true;
              visited = true;
            } else {
              if (column[j].y !== column[j - 1].y + 1) {
                column[j].y = column[j - 1].y + 1;
                canMoveUp = true;
                //如果进行一次无合并的移动，则表示上一格（这一格）没进行合并
                visited = false;
              }
            }
          }
        }
      }
      
      if (canMoveUp) {
        this.generateOneNumberCell();
      }
      if(inct>1){
        this.score+=inc*inct/8;
      }
    },
    //向下移动
    moveDown() {
      //一个表示可以向下移动的变量
      let canMoveDown = false;
      var inc=0,inct=0;
      for (let i = 0; i < 4; i++) {
        //按顺序获得该列的数字格
        let column = this.numberCells
          .filter((cell) => cell.x === i)
          .sort(this.sortByY);
        //一个表示上一格已经过合并的变量
        let visited = false;
        for (let j = column.length - 1; j >= 0; j--) {
          //如果当前是最后一个数字格，则其下边一定没有数字格，则直接推向最下边
          if (j === column.length - 1) {
            //如果已经在最后边则无需变动，也不会把可以移动的变量置为true
            //如果不在最后边则移动
            if (column[j].y !== 3) {
              column[j].y = 3;
              canMoveDown = true;
            }
          } else {
            //如果当前数字格与下一数字格的数字一样，则合并
            //否则就是将其挪到下一格的前一行，条件是下一格的前一行不为当前格
            if (column[j].num === column[j + 1].num && !visited) {
              column[j].y = column[j + 1].y;
              //滑动中禁止键盘输入
              this.canMove = false;

              
                  const newNum = column[j].num * 2;
                  column[j + 1].num = newNum;
                  column[j + 1].color = this.color[newNum];
                  let dom2 = document.querySelector(`#c${column[j + 1].id}`);
                  this.animateMerge(dom2);
                  this.numberCells.splice(this.getIndexById(column[j].id), 1);
                  column.splice(j, 1);
                  this.score += newNum;
                  inc+=newNum;
                  inct++;
                
              canMoveDown = true;
              visited = true;
            } else {
              if (column[j].y !== column[j + 1].y - 1) {
                column[j].y = column[j + 1].y - 1;
                canMoveDown = true;
                //如果进行一次无合并的移动，则表示上一格（这一格）没进行合并
                visited = false;
              }
            }
          }
        }
      }
      
      if (canMoveDown) {
        this.generateOneNumberCell();
      }
      if(inct>1){
        this.score+=inc*inct/8;
      }
    },
    //判断棋盘是否已满
    isFull() {
      return this.numberCells.length > 15;
    },
    //判断是否游戏结束
    isGameOver() {
      //判断是否可以移动
      //思路是看每个格子的右边或下边的格子是否与自己的数值相等
      //因此第四行已经经过了第三行的比较，不用再向下比较
      //第四列的已经经过第三列的比较，不用再向右比较
      let cannotMove = () => {
        for (let i = 0; i < 4; i++) {
          let row = this.numberCells
            .filter((cell) => cell.y === i)
            .sort(this.sortByX);
          for (let j = 0; j < 4; j++) {
            //除第四行外，所有格子跟下一行同一列的格子比较数值是否相等
            if (i < 3) {
              if (row[j].num === this.getCellByPoint({ x: j, y: i + 1 }).num) {
                return false;
              }
            }
            //除第四列外，所有格子跟同一行下一列的格子比较数值是否相等
            if (j < 3) {
              if (row[j].num === row[j + 1].num) {
                return false;
              }
            }
          }
        }
        return true;
      };
      return this.isFull() && cannotMove();
    },
  },
}

</script>
<style scoped>
@import '../cssFolder/single.css'

</style>