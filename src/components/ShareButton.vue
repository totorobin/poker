<script setup lang="ts">
import { Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const copyToClipboard = () => {
  navigator.clipboard.writeText(`${window.location.href}`)
  ElMessage('Link has been paste into clipboard')
}
</script>

<template>
    <div @click="copyToClipboard" class="share">
        <el-icon size="20"><Share /></el-icon>
    </div>
</template>

<style scoped>
.share {
  justify-content: center;
  align-items: center;
  line-height: 3em;
}
@media (max-width: 450px) {
  .share {
    line-height: 0.5em;
  }
}


</style>