<script setup lang="ts">
import { useI18n, type Locale } from 'vue-i18n'

const { t, locale, availableLocales } = useI18n({ useScope: 'global' })

const changelang = () => {
  locale.value =
    availableLocales[
      (availableLocales.indexOf(locale.value as Locale) + 1) % availableLocales.length
    ]
}
</script>

<template>
 <el-tooltip class="box-item" effect="dark" :content="t('tooltips.lang')" placement="top-start">
   <div class="flag" @click="changelang">
    {{ t('flag') }}
  </div>
  </el-tooltip>
</template>

<style scoped>
.flag {
  padding: 0 5px;
}

</style>