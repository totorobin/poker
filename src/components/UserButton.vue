<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { User } from '@element-plus/icons-vue'
import { useRoomStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' })

const roomStore = useRoomStore()
const { userName, userSaved } = storeToRefs(roomStore)

const open = () => {
  ElMessageBox.prompt(t('prompt-name.message'), t('prompt-name.title'), {
    confirmButtonText: t('prompt-name.confirm'),
    cancelButtonText: t('prompt-name.cancel'),
    inputPattern: /^[^_!¡?÷¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,32}$/,
    inputErrorMessage: t('prompt-name.error-input'),
  })
    .then(({ value }) => {
        if (value !== '') {
            roomStore.setUser(value)
        }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('prompt-name.cancel-notif'),
      })
    })
}

</script>

<template>
    <el-badge :is-dot="!userSaved" class="user" @click="open">
        <el-icon size="20"><User /></el-icon> {{ userName }}
    </el-badge>
</template>


<style scoped>
.user {
  height: 30px;
  margin: auto 5px ;
  padding-right: 2px;
  border-radius: 3px;
  border: 1px solid grey;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
}


@media (max-width: 450px) {

  .user {
    height: 19px;
  }
}
</style>