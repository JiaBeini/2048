<template>
    <div>
        <div v-if="showInput==1" class="loginTotal">
            <div class="loginHold" @click="hideLogin"></div>
            <div class="loginBlock">
                <p class="name">请输入你的中文用户名</p>
                <input type="text" v-model="inputName" @keydown.enter="saveName" v-focus/>
                
                <button class="loginButton" @click="saveName">确认</button>
            </div>
        </div>
        <div class="header" >
            <div class="header-content">
                
                    
                        <div v-if="username==''" @click='login'>
                            <button class="loginButton" style="list-style-type:none;"  v-if="showLogin==1" @click="loginButton">登录</button>
                        </div>
                        <div v-if="username!=''">
                            <button id="welcome" class="loginButton">欢迎 {{username}}</button>
                        </div>
                    
                
            </div>
        </div>
        
    </div>   
    
</template>
<script>
// import Background from '../Background';
export default {
    name:'HomeHeader',
    data () {
		return {
            showInput: false,
            showLogin:true,
            inputName:'',
            username: '',
		}
    },
    mounted(){
        if(!window.sessionStorage){
            alert("浏览器不支持sessionStorage!");
        }else{
            let storage = window.sessionStorage;
            let username=storage.getItem("username");
            if(username!=null&&username!=''){
                this.username=username;
                this.inputName=username;
                this.showInput=false;
                this.$store.commit('setUsername',this.inputName)
            }
            //console.log(this.username)
        }
    },
 
    methods:{
        
        loginButton(){
            this.showLogin=false; 
        },
        login(){
            this.showInput=true;            
        },
        hideLogin(){
            this.showInput=false;
        },
        saveName(){
            if(!window.sessionStorage){
                alert("浏览器不支持sessionStorage!");
            }else{
                //用户名不能为空
                if(this.inputName==''){
                    alert('请输入用户名')
                }else{
                    let storage = window.sessionStorage;
                    storage.setItem("username",this.inputName);
                    this.username=this.inputName;
                    this.showInput=0;
                    this.$store.commit('setUsername',this.inputName)
                }
                
            }
            
        },
        
    },
    
    directives: {
        focus: {
            // 指令的定义
            update: function (el) {
            el.focus()
            }
        }
    },
}
</script>
<style scoped>



.header-content a {
    margin: center;
    margin-top: 2%;
    margin-bottom: 2%;
    font-size: 30px;
    
    color: #fff;
    width: 60px;
    height: 30px;
    margin: 10px;
    /* padding: 10px; */
     text-align: center;
  
  }

.loginButton {
  width: 60px;
  height: 20px;
  line-height:20px;
  margin: 10px;
  /* padding: 10px; */
  background-color: #8f7a66;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  font-size: 16px;
  font-weight: bold;
  
}
.name{
    margin:0px;
}
#welcome {
     width: 160px;
     background-color: rgba(143,122,102,0.2);
     color: #8f7a66;
}
.loginButton:hover {
  background-color: #463f38;
}
</style>
