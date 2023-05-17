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
        backgroundColor.value = '#337333'
    
      } else {
        router.push('/')
        backgroundColor.value = 'white'
      }
    }
  }
)

</script>

<template>
  <div  
  v-bind:class="{ 'common-layout-white': backgroundColor=='white' , 'common-layout': backgroundColor!='white' }" 
  :style="{'background-color': backgroundColor}">
    <el-container>
      <el-header><MyHeader /></el-header>
      <el-main><RouterView /></el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<style>
/** important : permet d'afficher la fenetre de saisie du user AU DESSUS des notifications  **/
.el-overlay {
  z-index: 99999999999999 !important;
}

body {
  margin:0;
}

.common-layout-white{
    background: url("@/assets/bg_poker_white.jpg") no-repeat right bottom fixed;
}
.common-layout{
    background: url("@/assets/bg_poker.jpg") no-repeat right bottom fixed;
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

