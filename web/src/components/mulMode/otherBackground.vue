<template>

  <div class="background">
    <div v-for="i of 16" :key="i" class="grid-cell"></div>
  </div>
</template>

<script>

</script>

<style scoped>
.background {
  width: 104px;
  height: 104px;
  padding: 2px;
  margin-top: 2px;
  background-color: #bbada0;
  border-radius: 5px;
  display: grid;
  grid-row-gap: 1px;
  grid-column-gap: 1px;
  grid-template-columns: repeat(4, 25px);
  grid-template-rows: repeat(4, 25px);
}
.grid-cell {
    width: 25px;
    height: 25px;
    border-radius: 5px;
    background-color: #ccc0b3;
  }
</style>