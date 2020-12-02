<template>

    <div class="background">
      <div class="grid-cell" style="border-radius: 0px; color: #ffffff; background-color: #f65e3b">
          {{ title }}
      </div>
      <div class="grid-cell " :key="item.name" v-for="(item, ind) in getRank()">
         {{ ind+1 }} {{ item.name }}  {{ item.score }}
      </div>
    </div>

</template>

<script>
import rankList from './rankList.vue';
export default {
//   name: 'rankBoard',
  components: {
    // rankList
  },
  props: ['type', 'title'],
  mounted() {
    // axios异步请求消息 返回降序的top10分数，如果不足10个全部返回
    this.$axios({
        method: 'post',
        url: '/api/get_rank/',
        //headers: 'Content-Type: application/json',
        data:this.$qs.stringify({
            type: this.type // score的类型，simple或者hard
        })
    }).then(response=>{
        this.scores = JSON.parse(response['data']['result']);
        console.log(JSON.parse(response['data']['result']));
    }).catch(error => {
        console.log(error);
    });

    // 下面这段注释的代码是用于保存分数的，可以封装在需要的地方，注意表单项data的填写

    // this.$axios({
    //     method: 'post',
    //     url: '/api/save_score/',
    //     data:this.$qs.stringify({
    //         ip: '1.0.0.0', // 用户ip, String()
    //         name: 'test', // 用户名，String()
    //         type: this.type, // score的类型，simple或者hard, String()
    //         score: 4000 // 分数，Number()
    //     })
    // }).then(response=>{
    //     console.log(response);
    // }).catch(error => {
    //     // TODO  存储失败需要给用户一点响应
    //     console.log(error);
    // });

  },
  data(){
    return {
        scores: [
            // {name: 'test', score: 1000},
            // {name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: 'test', score: 1000},
            // {name: "test2", score: 2000}
        ]
    };
  },
  methods: {
    getRank() {
        // TODO
        //console.log(this.type)
        return this.scores.slice(0, 10);
    }
  }
}

</script>
<style scoped>


.background {
  width: 200px;
  height: 430px;
  padding: 20px;
  margin-top: 10rpx;
  background-color: #bbada0;
  border-radius: 10px;
  display: grid;
  grid-row-gap: 10px;
  grid-template-rows: repeat(11, 30px);
}
.grid-cell {
    width: 200px;
    height: 30px;
    line-height: 30px;
    font-weight: bold;
    color: #776e65;
    border-radius: 5px;
    background-color: #ccc0b3;
  }
  .rank {
    margin-top: 10rpx;
    margin-bottom: 20rpx;
    font-size: 16px;
  }
</style>