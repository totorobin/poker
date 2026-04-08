<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import { Operation } from '@element-plus/icons-vue'
import {ref, watch} from 'vue'
import { useStorage } from '@vueuse/core'

const { t } = useI18n({ useScope: 'global' })

const themeModalVisible = ref(false)
const openThemeModal = () => {
  themeModalVisible.value = true
}

const color = useStorage('color',  '#56AB2F')
const back = useStorage('card-back', '/src/assets/playing-card-back_old.png')
const backs = ref<string[]>([])
Object.entries(import.meta.glob(['@/assets/playing-card-back_*.png'])).forEach(([key]) => {
  backs.value.push( key )
})

watch(color, (value) => {
  if(value)
      document.documentElement.style.setProperty('--primary-color-theme', color.value)
    }
    , { immediate: true })

watch(back, (value) => {
  if(value)
      document.documentElement.style.setProperty('--card-back-background-image', `url(${value})`)
    }
    , { immediate: true })
</script>

<template>
  <el-tooltip class="box-item" effect="dark" :content="t('tooltips.theme')" placement="top-start">
    <div class="theme" @click="openThemeModal">
      <el-icon><Operation /></el-icon>
    </div>
  </el-tooltip>

  <el-dialog v-model="themeModalVisible" :title="t('theme.form.title')">
    <div class="demo-color-block">
      <span class="demonstration">{{ t('theme.form.color') }}</span>
      <el-color-picker v-model="color" />
    </div>
    <div class="back-selector">

      <span>{{ t('theme.form.card') }}</span>
      <el-space wrap>
        <div v-for="i in backs" :key="i" class="box-card" :class="{ selected : back === i }" @click="back = i">
          <img class="item" :src="i" />
        </div>
      </el-space>

    </div>
  </el-dialog>
</template>


<style scoped>
.theme {
  padding: 0 5px;
  margin-top: 2px;
}
.demo-color-block {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.demo-color-block .demonstration {
  margin-right: 16px;
}
.box-card {
  border: 1px solid #e4e4e4;
  &.selected {
      border-color: v-bind(color);
  }
}
.item {
  width: 100px;
  height: 150px;
}
.box-card , .back-selector {
  display: grid;
}

</style>