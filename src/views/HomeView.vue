<script setup lang="ts">
import CreateRoom from '@/components/CreateRoom.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <CreateRoom />
    </el-container>
  </div>
</template>


<style scoped>
.el-container {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
</style>
