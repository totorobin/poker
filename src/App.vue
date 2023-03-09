<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import { FullScreen, Share , User} from '@element-plus/icons-vue'
import router from './router'
import { useRoomStore } from './stores/room'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const roomStore = useRoomStore()
const { user } = storeToRefs(userStore)

const showNameModal = ref(false)

const nameForm = ref('')

const handleClose = () => {
  showNameModal.value = !user.value.name
}

const setName = () => {
  if (nameForm.value !== '') {
    userStore.setUser(nameForm.value)
    showNameModal.value = false
  }
}
if (!user.value.name) {
  showNameModal.value = true
}

const openInWindow = () => {
  window.open(
    window.location.href,
    '',
    'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=440,height=400'
  )
  router.push('/')
  roomStore.leave()
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
  ElMessage('Link has been paste into clipboard')
  
}
</script>

<template>
  <el-dialog
    v-model="showNameModal"
    title="What's your name"
    :before-close="handleClose"
  >
    <span>please state your name</span>
    <el-input v-model="nameForm" placeholder="name" v-on:keyup.enter="setName" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="setName"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
          <RouterLink to="/"
            ><img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="20" height="20"
          /></RouterLink>
          <div class="flex-grow" />          
          <div @click="copyToClipboard" >
            <el-icon size="20"><Share /></el-icon>
          </div>
          <div class="window-button" @click="openInWindow" >
            <el-icon size="20"><FullScreen /></el-icon>
          </div>
          <div class="user" @click="() => (showNameModal = true)"><el-icon size="20"><User /></el-icon> {{ user.name }}</div>
        </el-menu>
      </el-header>
      <RouterView />
    </el-container>
  </div>
</template>

<style scoped>
header {
  line-height: 3;
}
.el-dialog {
  max-width: 200px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
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

.flex-grow {
  flex-grow: 1;
}
.el-menu div {
  padding: 3px;
}

@media (max-width: 450px) {
  header {
    height: 25px;
    --el-header-padding: 0 2px;
  }
  .el-menu {
    height: 25px;
    --el-menu-item-height: 25px;
  }
  .window-button {
    display: none;
  }
  .user {
     height: 16px;
  }
  header {
    line-height: 1;
  }
}
</style>
