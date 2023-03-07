<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useUserStore } from './stores/user'
import { FullScreen, Share } from '@element-plus/icons-vue'
import router from './router'
import { useRoomStore } from './stores/room'
import { ElMessage, ElNotification } from 'element-plus'

const userStore = useUserStore()
const roomStore = useRoomStore()
const route = useRoute()
const { user } = storeToRefs(userStore)

const showNameModal = ref(false)

const nameForm = ref('')

const handleClose = () => {
  if (!user.value.name) {
    showNameModal.value = true
  }
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
    route.fullPath,
    '',
    'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=490,height=400'
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
    width="30%"
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
          <div @click="openInWindow" >
            <el-icon size="20"><FullScreen /></el-icon>
          </div>
          <div @click="() => (showNameModal = true)">player : {{ user.name }}</div>
        </el-menu>
      </el-header>
      <RouterView />
    </el-container>
  </div>
</template>

<style scoped>
header {
  line-height: 2;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.flex-grow {
  flex-grow: 1;
}
.el-menu div {
  padding: 3px;
}
</style>
