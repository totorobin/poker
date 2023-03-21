<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { User } from '@element-plus/icons-vue'
import { useRoomStore } from '@/stores'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const roomStore = useRoomStore()
const { userName } = storeToRefs(roomStore)

const open = () => {
  ElMessageBox.prompt('Please input your name', 'Name', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+?/,
    inputErrorMessage: 'Invalid Surname',
  })
    .then(({ value }) => {
        if (value !== '') {
            roomStore.setUser(value)
        }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

</script>

<template>
    <div class="user" @click="open">
        <el-icon size="20"><User /></el-icon> {{ userName }}
    </div>
</template>


<style scoped>
.user {
  height: 30px;
  border-radius: 3px;
  border: 1px solid grey;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
}


@media (max-width: 450px) {

  .user {
    height: 16px;
  }
}
</style>