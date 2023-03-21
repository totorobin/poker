<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import router from '@/router'
import { useRoomStore } from '@/stores'
import MyHeader from '@/components/MyHeader.vue'

const roomStore = useRoomStore()
const { room } = storeToRefs(roomStore)

watch(
  () => room.value.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      if (newId) {
        router.push('/room/' + newId)
      } else {
        router.push('/')
      }
    }
  }
)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <MyHeader />
      </el-header>
      <RouterView />
    </el-container>
  </div>
</template>

<style scoped>
header {
  line-height: 3;
}

.flex-grow {
  flex-grow: 1;
}

@media (max-width: 450px) {
  header {
    height: 25px;
    --el-header-padding: 0 2px;
    line-height: 1;
  }
}
</style>
