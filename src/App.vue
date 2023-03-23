<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import router from '@/router'
import { useRoomStore } from '@/stores'
import MyHeader from '@/components/MyHeader.vue'

const roomStore = useRoomStore()
const { room } = storeToRefs(roomStore)
const backgroundColor = ref('white')

watch(
  () => room.value.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      if (newId) {
        router.push('/room/' + newId)
        backgroundColor.value = '#56ab2f'
      } else {
        router.push('/')
        backgroundColor.value = 'white'
      }
    }
  }
)
</script>

<template>
  <div class="common-layout" :style="{'background-color': backgroundColor }">
    <el-container>
      <el-header><MyHeader /></el-header>
      <el-main><RouterView /></el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<style>
body {
  margin:0;
}
</style>
<style scoped>

.el-header {
  height: 50px;
  line-height: 50px;
  background-color: #1a330e;
}
.el-container {
  height: 100vh;
}
@media (max-width: 450px) {
  .el-header  {
    height: 30px;
    line-height: 30px;
  }
  .el-main {
    padding: 10px;
  }
}
</style>

