<script setup lang="ts">
import { Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const copyToClipboard = () => {
  navigator.clipboard.writeText(`${window.location.href}`)
  ElMessage(t('notifications.clipboard'))
}
</script>

<template>
  <el-tooltip class="box-item" effect="dark" :content="t('tooltips.share')" placement="top-start">
    <div @click="copyToClipboard" class="share">
        <el-icon size="20"><Share /></el-icon>
    </div>
  </el-tooltip>
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