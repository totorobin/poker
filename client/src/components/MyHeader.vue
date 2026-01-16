<script setup lang="ts">
import {RouterLink} from 'vue-router'
import ChangeLangButton from './ChangeLangButton.vue'
import PopupWindowButton from './PopupWindowButton.vue'
import ShareButton from './ShareButton.vue'
import UserButton from './UserButton.vue'
import Logo from "@/components/Logo.vue";
import ChangeThemeButton from "@/components/ChangeThemeButton.vue";
</script>

<template>
  <el-row>
    <RouterLink to="/">
        <Logo class="logo" alt="Vue logo" />
    </RouterLink>
    <div class="flex-grow" />
    <ChangeThemeButton />
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
