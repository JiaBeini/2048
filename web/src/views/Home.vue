<template>

  <div class="home">
    
    <!-- 这里是主页面的标题部分，包括标题以及规则介绍 -->
    <div class="header-2048">
      <div class="header-1">
        <!-- 这里是标题 -->
        <div class="title-2048">2048</div>
        
        <!-- 这里是游戏规则介绍链接，点击链接会弹出介绍窗口 -->

      </div>
      <HomeHeader class="welcome"></HomeHeader>
      <div class="link-block">
          <a href="" @click.prevent="showHow=true" class="link-rule">游戏规则</a>
      </div>
      <!-- 这里是规则介绍弹窗，弹窗标题以及内容都可以修改，p中的是弹窗内容（游戏介绍） -->
      <Modal v-if="showHow" :show="showHow" :title="title" @hideModal="hideModal">
        <p>游戏分为单人模式(简单/困难)、双人模式，选择模式后开始游戏(默认为单人简单模式)。简单模式中每次出现一个新的数字，
          困难模式出现两个数字，你需要按下上下左右(或WASD)按键使所有数字移动，移动后相邻相同的两个数字将加在一起。一次合并数字越多得分越高。
          加油吧玩家！
        </p>
      </Modal>
      
       
    </div>
    <!-- 这里是主体部分，包括模式选择按钮和模式的组件 -->
    <body scroll="no" overflow="hidden" class="showit" >
      <!-- 模式选择按钮 -->
      <div class="bolder">
		    <button class="btn btnStyle" @click="comName='singleEasy'">单人(简单)</button>
		    <button class="btn btnStyle" @click="comName='singleHard'">单人(困难)</button>
		    <button class="btn btnStyle" @click="comName='mulMode'">双人对战</button>
		    <button class="btn btnStyle" @click="comName='rankList'">巅峰榜</button>
		  </div>
      <!-- 下面是模式对应的组件，接下来跳转到具体组件中 -->
      <div>
        <component :is="comName"></component>
      </div>
      
    </body>
    
    
  </div>
</template>

<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
<script>
//导入组件components
import Background from '../components/Background';
import Modal from '../components/Modal';
import singleEasy from '../components/single/singleEasy';
import singleHard from '../components/single/singleHard';
import rankList from '../components/rankList/rankList';
import mulMode from '../components/mulMode/mulMode';
import HomeHeader from '../components/HomeHeader'

export default {
  name: 'Home',
  components: {
    Background,
    Modal,
    singleEasy,
    singleHard,
    mulMode,
    rankList,
    HomeHeader,
  },
  mounted() {
    this.getchild();
    //在这里设置一下背景颜色
    document.querySelector('body').setAttribute('style', 'background-color: #c7c2be')
  },
  //这里存储初始数据如弹窗标题，初始默认选择游戏模式为单人简单
  data(){
    return{
      score:0,
      showHow:false,
      title:"游戏规则",
      comName:'singleEasy',
      username:'',
      ip:'空'
    }
  },

  methods:{
    
    getchild(){
      this.username=this.$store.state.username.name;
      //console.log(this.username)
  },
    hideModal() {
            // 取消弹窗回调
            this.showHow = false
        },
  }
}

</script>
<style scoped>

.showit{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2%;
  overflow:auto;
  overflow-y:hidden;
  
  display:block;
  margin: auto;
  text-align: center;
}

  header h1 {
    margin-top: 2%;
    margin-bottom: 2%;
    font-size: 60px;
  }
  header h2 {
    margin-top: 0;
    font-size: 20px;
  }
  header a {
    font-size: 15px;
  }

  header p {
    margin: 0;
    margin-top: 10px;
    font-size: 16px;
    
  }
  span {
      font-weight: bold;
    }


.home{
  /*background-color: #c7c2be;*/
  background-image:url('background.jpg');
  background-color:rgb(251, 242, 237); 
  width:100%;
  height:100%;
  position:absolute; 
  left:0; 
  top:0;
}
.btn{
	width: 85px;
  height: 30px;
	background:  #8f7a66;
	border: none;
	color: white;
	margin: 6px 10px;
}

.btnStyle{
	border-radius: 20px 20px 20px 20px;
}
.bolder{
	width: 500px;
	height: 40px;
  border-radius: 10px;
  margin:auto;
}
  .header-2048{
  width:405px;
  display:block;
  margin: auto;
  padding-top:50px;
  font-weight: 700;
}
.title-2048 {
    text-align: center;
    margin-top: 2%;
    margin-bottom: 2%;
    font-size: 60px;
    margin-right:2%;
    width:150px;
    display:inline;
  }
 .welcome{
    float:right;
    width:180px;
    margin-left:16px;
    display:inline;
  }
    .link-rule{
    color:#8f7a66;
    
  }
  .link-rule:hover{
    font-weight:bold;
  }
  .header-1{
    display:inline;
    height:82px;
    width:150px;
    margin:0px;
  }
  .link-block{
    display:block;
    height:20px;
    margin:auto;
    width:405px;
    text-align: center;
    
    /*float:right;
    position:relative;
    /*right:-120px;
    bottom:-50px;*/
  }
</style>