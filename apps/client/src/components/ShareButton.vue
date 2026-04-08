<script lang="ts" setup>
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
  <el-tooltip :content="t('tooltips.share')" class="box-item" effect="dark" placement="top-start">
    <div class="share" @click="copyToClipboard">
      <el-icon><Share /></el-icon>
    </div>
  </el-tooltip>
</template>

<style scoped>
  .share {
    padding: 0 5px;
    margin-top: 2px;
  }
</style>
