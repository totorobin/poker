<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import ChangeLangButton from './ChangeLangButton.vue'
  import PopupWindowButton from './PopupWindowButton.vue'
  import ShareButton from './ShareButton.vue'
  import UserButton from './UserButton.vue'
</script>

<template>
  <el-row>
    <RouterLink to="/">
      <img alt="Vue logo" class="logo" src="../assets/logo.png" />
    </RouterLink>
    <div class="flex-grow" />
    <ChangeLangButton />
    <ShareButton />
    <PopupWindowButton />
    <UserButton />
  </el-row>
</template>

<style scoped>
  .el-row {
    color: white;
    font-size: 20px;
  }
  .logo {
    height: 40px;
    display: block;
    margin: 5px auto;
  }

  .flex-grow {
    flex-grow: 1;
  }

  @media (max-width: 450px) {
    .logo {
      height: 29px;
      margin: 0 auto;
    }
  }
</style>
