<template>

  <div class='single-easy'>
    <p>
        巅峰榜
    </p>
    <div class="showit">
      <RankBoard :type="rankSimple" :title="titleSimple" style="margin-right: 30px">

      </RankBoard>
      <RankBoard :type="rankHard" :title="titleHard">

      </RankBoard>
      <!-- <div class="background">
      <div class="grid-cell " :key="item.name" v-for="item in getRank()">
         {{ item.name }}  {{ item.score }}
      </div>
      </div> -->
    </div>
  </div>

</template>

<script>
import RankBoard from './rankBoard';

export default {
  name: 'rankList',
  components: {
    
    RankBoard
  },
  mounted() {
    document.querySelector('body').setAttribute('style', 'background-color: #c7c2be')
  },
  data(){
    return {
        rankSimple: 'simple',
        rankHard: 'hard',
        titleSimple: '简单',
        titleHard: '困难'
    };
  },
  methods: {
    getRank() {
        // TODO
        return this.scores.slice(0, 10);
    }
  }
}

</script>
<style scoped>

.showit{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
}

 p {
    margin-top: 10rpx;
    margin-bottom: 10rpx;
    font-size: 16px;
    
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