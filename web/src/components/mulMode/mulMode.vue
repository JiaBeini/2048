<template>
<div>
  <!-- 有用户名才可进入多人模式 -->
  <div v-if="getUserName!=''" class='single-easy' >
    <div >
    <!-- 输入房间名并进入房间 , 进入房间才显示游戏界面-->
    <div class="intoRoom" v-if="showSubmit==1">
      <span>请输入房间名：</span>
      <input type="text" v-model="roomNumber" />
      <button class="roomButton" @click="saveRoom">提交</button>
      
    </div>
    <!-- 多人界面 -->
    <div class="mulRoom" v-else >
      <span>欢迎玩家 {{getUserName}} 来到房间：{{getRoomNumber}}</span>
      <div v-if="readyShow==1">
       <button class="roomButton" v-if="getReady==1">已准备</button>
       <button class="roomButton" @click="saveReady" v-else>准备</button>
      </div>
      <div v-else>
        <MulPlay></MulPlay>
      </div>
  </div>
    
  </div>
  </div>
  <!-- 没有登录不能多人 -->
  <div v-else>
    <p>来者何人</p>
    <p>（请登陆）</p>
  </div>
</div>
</template>

<script>

import Background from '../Background';
import mulPlay from './mulPlay';
import MulPlay from './mulPlay.vue';
import io from 'socket.io-client';
import { bus } from '../../main.js';


export default {
  name: 'mulMode',

  components: {
    MulPlay,
    Background,
 
  },

  data(){
    return{
      score:1,
      getReady:false,
      readyShow:true,
      score:0,
      userName:'',
      roomNumber: '',
      showSubmit:true,
      sockId: '',
      // intoMsg:'',
      socket: null,
      showRoom:false,
    }
  },
  computed: {
    // 获取用户名
    getUserName() {
      return this.$store.state.username.name;
    },
    // 获取房间名
    getRoomNumber() {
      return this.$store.state.roomNumber;
    },
  },
  created () {
    // 本地测试服务端，本地的服务端运行在3000端口
    //this.socket = io.connect('http://localhost:3000');
    this.socket = io.connect('http://sock.dancingline.cn');
    this.initSocketEvents();
    bus.$on('change', ({cells, score, gameState}) => {
      console.log(cells, score,gameState); 
      this.socket.emit('gridChange', {otherCells: cells, otherScore: score, roomId: this.roomNumber, sockId: this.sockId, otherGameState: gameState});/**/
    });
    console.log('parent created');
  },
  beforeDestroy() {
    this.socket.emit('userLeave', {
            userName: this.getUserName,
            sockId: this.sockId,
            roomId: this.roomNumber,
          });
    bus.$off();
    this.socket.off();
    console.log('parent destroy');
  },
  mounted() {

    document.querySelector('body').setAttribute('style', 'background-color: #c7c2be')
    
    if(!window.sessionStorage){
            alert("浏览器不支持sessionStorage!");
        }else{
            let storage = window.sessionStorage;
            let username=storage.getItem("username");
            let roomnumber=storage.getItem("roomnumber");
            
            this.userName=username;
        }
        
  },
  methods:{
        saveRoom(){
           if(!window.sessionStorage){
                alert("浏览器不支持sessionStorage!");
            }else{
                let storage = window.sessionStorage;
                storage.setItem("roomnumber",this.roomNumber);
                // 给后端发送消息确定房间是否可以加入
                // emit表示发送事件，第一个参数是事件名，第二个参数是处理函数
                this.socket.emit('checkRoom', {
                  roomId: this.roomNumber,
                  sockId: this.sockId,
                  userName: this.getUserName,
                });
            }
            //对房间号进行判断
           if(this.roomNumber==''){
               alert("请输入房间号");
            }else {
              //加入房间时判断房间内是否为2个人，超过则不能进入。符合条件的保存并进入房间
               this.socket.on('checkRoomSuccess', (exsitRoomUsers) => {
                 if (exsitRoomUsers && exsitRoomUsers.length > 1) {
                   alert("当前房间人数已满~请换个房间id");
                  }else{
                    this.showSubmit=false;
                  this.$store.commit('setRoomNumber',this.roomNumber)
              }
           });
          }  
        },
        //点击准备
        saveReady(){
          let storage = window.sessionStorage;
          this.getReady=true;
          storage.setItem("getReady",this.getReady);
          if(this.userName!=''&&this.sockId!=''&&this.roomNumber!=''){
            this.socket.emit('checkReady', {
              userName: this.getUserName,
              sockId: this.sockId,
              roomId: this.roomNumber,
              getReady:this.getReady,
            });
          }
    
        },
      initSocketEvents () {
        // 即将刷新或者离开页面时，发送退出的消息给服务器
        window.onbeforeunload = () => {
          // username
          console.log(this.getUserName, this.sockId, this.roomNumber);
          this.socket.emit('userLeave', {
            userName: this.getUserName,
            sockId: this.sockId,
            roomId: this.roomNumber,
          });
        };
        // 成功连接返回sock id之后的处理
        this.socket.on('connectionSuccess', (sockId) => {
          this.sockId = sockId;
          console.log('connectionSuccess client sockId:', sockId);
        });
        //加入房间成功
        this.socket.on('joinRoomSuccess', (roomUsers) => {
          console.log('joinRoomSuccess client user:', roomUsers);
          const otherUser = roomUsers.find(item => item.sockId !== this.sockId);
          if (!otherUser) return false;
          this.$message.success(`${otherUser.userName}加入了房间`);
        });
        // 更新准备状态
        this.socket.on('readyUpdate',(readyList) => {
            if(readyList.length > 1){
              this.readyShow=false;
            }else{
              this.readyShow=true;
            }
            console.log('ready',readyList);
        });
        // 接收来自对方的更新
        this.socket.on('otherUpdate', ({ otherCells, otherScore, roomId, sockId,otherGameState}) => {
          if(sockId !== this.sockId) {
              bus.$emit('set', {cells: otherCells, score: otherScore, gameState: otherGameState});
          }
        });
      },
    },
}

</script>
<style scoped>

.showit{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
}
 h1 {
    margin: 0;
    font-size: 50px;
  }

 p {
    margin-top: 10rpx;
    margin-bottom: 10rpx;
    font-size: 16px;
    
  }
  /* span {
      font-weight: bold;
    } */
.single-easy p {
    margin-top: 2%;
    margin-bottom: 2%;
    font-size: 20px;
  }
.roomButton {
  width: 50px;
  margin: 5px;
  padding: 2px;
  background-color: #8f7a66;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  font-size: 8px;
  font-weight: bold;
  
}
.divcss-left{

  display: inline;
  float: left;
}
.divcss-right{
  display: inline;
  float: left;
}
.roomButton:hover {
  background-color: #463f38;
}
.single-easy{
  background-color:transparent;
}

.mulRoom{

  display:block;
  margin:auto;
}
.intoRoom{

  display:block;
  margin:auto;
}
</style>