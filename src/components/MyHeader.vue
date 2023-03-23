<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ChangeLangButton from '@/components/ChangeLangButton.vue'
import PopupWindowButton from '@/components/PopupWindowButton.vue';
import ShareButton from '@/components/ShareButton.vue'
import UserButton from '@/components/UserButton.vue'


</script>

<template>
    <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
        <RouterLink to="/">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="20" height="20"/>
        </RouterLink>
        <div class="flex-grow" />
        <ChangeLangButton />
        <ShareButton />
        <PopupWindowButton />
        <UserButton />
    </el-menu>
</template>

<style scoped>
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

@media (max-width: 450px) {
  .el-menu {
    height: 25px;
    --el-menu-item-height: 25px;
  }
}
</style>
